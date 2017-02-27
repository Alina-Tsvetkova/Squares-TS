let one = null, two = null, width: number, height: number, counterAim: number, maxClicks: number, mul: number;

class UserAnswer {
    private askUserWidthHeight() {
        event.preventDefault();
        let gameElements = squareGame.initialize();
        width = +(<HTMLInputElement>gameElements.resultWidth).value;
        height = +(<HTMLInputElement>gameElements.resultHeight).value;
        mul = width * height;
        maxClicks = mul * 3;
        counterAim = (width * height) / 2;
        if (mul % 2 === 0 && mul > 0) {
            (<HTMLInputElement>gameElements.squaresSettings).style.display = 'none';
            squareGame.game();
        } else if (mul == 0 || !(mul % 2 === 0)) {
            (<HTMLInputElement>gameElements.warningMsg).style.display = 'inline-block';
        }
    }
}

class SquaresGameLogic {
    public initialize() {
        return {
            wraps: document.getElementsByClassName('wrapper'),
            submitSettings: document.getElementsByClassName('submit-settings')[0],
            squaresSettings: document.getElementsByClassName('squares-settings')[0],
            resultWidth: document.getElementsByClassName('width')[0],
            resultHeight: document.getElementsByClassName('height')[0],
            beginGameButton: document.getElementsByClassName('begin-game-button')[0],
            counterSpan: document.getElementsByClassName('counter')[0],
            warningMsg: document.getElementsByClassName('warning-msg ')[0],
            smallSquare: document.getElementsByClassName('small-square'),
        }
    }

    public init() {
        let gameElements = squareGame.initialize();
        let userAnswer = new UserAnswer();
        gameElements.beginGameButton.addEventListener('click', function () {
            squareGame.takeSettings(userAnswer);
        }, false);
    }

    private getRandomColor() {
        let letters: string = '0123456789ABCDEF';
        let color: string = '#';
        for (let i: number = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    private takeSettings(userObject) {
        let gameElements = squareGame.initialize();
        (<HTMLInputElement>gameElements.squaresSettings).style.display = 'block';
        gameElements.submitSettings.addEventListener('click', userObject.askUserWidthHeight, false);
    }

    private changer() {
        let coll = document.querySelectorAll('.small-square');
        let colors: string[] = [];
        for (let k: number = 0; k < (width * height) / 2; k++) {
            let newColor: string = this.getRandomColor();
            colors.push(newColor);
        }
        let mass: string[] = colors.concat(colors);
        let num: number = 0;
        for (let i: number = 0; i < coll.length; i++) {
            let random = Math.round(Math.random() * (mass.length - 1));
            (<HTMLInputElement>coll[num]).style.backgroundColor = mass[random];
            mass.splice(random, 1);
            num++;
        }
    }

    public game() {
        let gameElements = squareGame.initialize();
        (<HTMLButtonElement>gameElements.beginGameButton).style.display = "none";
        let main = document.createElement('div');
        main.className = "squares";
        let secondMain = document.createElement('div');
        secondMain.className = "secondMain";
        secondMain.style.width = ((width * 100) + ((5 * width) * 2)) + "px";
        document.body.appendChild(main);
        for (let m: number = 0; m < height * width; m++) {
            let divs = document.createElement('div');
            divs.className = "small-square";
            main.appendChild(divs);
        }
        for (let m: number = 0; m < height * width; m++) {
            let wrap = document.createElement('div');
            wrap.className = 'wrapper';
            secondMain.appendChild(wrap);
        }
        main.style.width = ((width * 100) + ((5 * width) * 2)) + "px";
        document.body.appendChild(secondMain);
        this.changer();

        for (let k: number = 0; k < gameElements.wraps.length; k++) {
            gameElements.wraps[k].addEventListener('click', this.openRightSquares, false);
        }
    }

    private openRightSquares() {
        let gameElements = squareGame.initialize();
        if (one !== null && two !== null) {
            return;
        }
        let elem = <HTMLDivElement>event.target;
        elem.style.visibility = 'hidden';
        for (let i: number = 0; i < gameElements.wraps.length; i++) {
            if (gameElements.wraps[i] === event.target) {
                if (one === null) {
                    one = i;
                } else if (two === null) {
                    two = i;
                    if ((<HTMLDivElement>gameElements.smallSquare[one]).style.backgroundColor === (<HTMLDivElement>gameElements.smallSquare[two]).style.backgroundColor) {
                        one = null;
                        two = null;
                        if (counterAim <= 1) {
                            squareGame.notificationInformer('Congratulations! You have won!');
                        }
                        counterAim--;
                    } else {
                        setTimeout(function () {
                            (<HTMLDivElement>gameElements.wraps[one]).style.visibility = 'visible';
                            (<HTMLDivElement>gameElements.wraps[two]).style.visibility = 'visible';
                            one = null;
                            two = null;

                        }, 1000);
                    }
                }
            }
        }
        let newCounter: number = parseInt(gameElements.counterSpan.innerHTML);
        newCounter++;
        gameElements.counterSpan.innerHTML = newCounter.toString();
        if (+(<HTMLParagraphElement>gameElements.counterSpan).innerHTML > maxClicks) {
            squareGame.notificationInformer("You are loser! Too much clicks! You will have to begin from the start!");
        }
    }

    private notificationInformer(str: string) {
        let notificationContainer = document.createElement('div');
        notificationContainer.classList.add('notification');
        notificationContainer.innerHTML = str;
        document.body.appendChild(notificationContainer);
        setTimeout(function () {
            location.reload();
        }, 3000);
    }
}


let squareGame = new SquaresGameLogic();
squareGame.init();