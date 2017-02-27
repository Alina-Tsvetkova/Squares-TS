var one = null, two = null, width, height, counterAim, maxClicks, mul;
var UserAnswer = (function () {
    function UserAnswer() {
    }
    UserAnswer.prototype.askUserWidthHeight = function () {
        event.preventDefault();
        var gameElements = squareGame.initialize();
        width = +gameElements.resultWidth.value;
        height = +gameElements.resultHeight.value;
        mul = width * height;
        maxClicks = mul * 3;
        counterAim = (width * height) / 2;
        if (mul % 2 === 0 && mul > 0) {
            gameElements.squaresSettings.style.display = 'none';
            squareGame.game();
        }
        else if (mul == 0 || !(mul % 2 === 0)) {
            gameElements.warningMsg.style.display = 'inline-block';
        }
    };
    return UserAnswer;
}());
var SquaresGameLogic = (function () {
    function SquaresGameLogic() {
    }
    SquaresGameLogic.prototype.initialize = function () {
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
        };
    };
    SquaresGameLogic.prototype.init = function () {
        var gameElements = squareGame.initialize();
        var userAnswer = new UserAnswer();
        gameElements.beginGameButton.addEventListener('click', function () {
            squareGame.takeSettings(userAnswer);
        }, false);
    };
    SquaresGameLogic.prototype.getRandomColor = function () {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    SquaresGameLogic.prototype.takeSettings = function (userObject) {
        var gameElements = squareGame.initialize();
        gameElements.squaresSettings.style.display = 'block';
        gameElements.submitSettings.addEventListener('click', userObject.askUserWidthHeight, false);
    };
    SquaresGameLogic.prototype.changer = function () {
        var coll = document.querySelectorAll('.small-square');
        var colors = [];
        for (var k = 0; k < (width * height) / 2; k++) {
            var newColor = this.getRandomColor();
            colors.push(newColor);
        }
        var mass = colors.concat(colors);
        var num = 0;
        for (var i = 0; i < coll.length; i++) {
            var random = Math.round(Math.random() * (mass.length - 1));
            coll[num].style.backgroundColor = mass[random];
            mass.splice(random, 1);
            num++;
        }
    };
    SquaresGameLogic.prototype.game = function () {
        var gameElements = squareGame.initialize();
        gameElements.beginGameButton.style.display = "none";
        var main = document.createElement('div');
        main.className = "squares";
        var secondMain = document.createElement('div');
        secondMain.className = "secondMain";
        secondMain.style.width = ((width * 100) + ((5 * width) * 2)) + "px";
        document.body.appendChild(main);
        for (var m = 0; m < height * width; m++) {
            var divs = document.createElement('div');
            divs.className = "small-square";
            main.appendChild(divs);
        }
        for (var m = 0; m < height * width; m++) {
            var wrap = document.createElement('div');
            wrap.className = 'wrapper';
            secondMain.appendChild(wrap);
        }
        main.style.width = ((width * 100) + ((5 * width) * 2)) + "px";
        document.body.appendChild(secondMain);
        this.changer();
        for (var k = 0; k < gameElements.wraps.length; k++) {
            gameElements.wraps[k].addEventListener('click', this.openRightSquares, false);
        }
    };
    SquaresGameLogic.prototype.openRightSquares = function () {
        var gameElements = squareGame.initialize();
        if (one !== null && two !== null) {
            return;
        }
        var elem = event.target;
        elem.style.visibility = 'hidden';
        for (var i = 0; i < gameElements.wraps.length; i++) {
            if (gameElements.wraps[i] === event.target) {
                if (one === null) {
                    one = i;
                }
                else if (two === null) {
                    two = i;
                    if (gameElements.smallSquare[one].style.backgroundColor === gameElements.smallSquare[two].style.backgroundColor) {
                        one = null;
                        two = null;
                        if (counterAim <= 1) {
                            squareGame.notificationInformer('Congratulations! You have won!');
                        }
                        counterAim--;
                    }
                    else {
                        setTimeout(function () {
                            gameElements.wraps[one].style.visibility = 'visible';
                            gameElements.wraps[two].style.visibility = 'visible';
                            one = null;
                            two = null;
                        }, 1000);
                    }
                }
            }
        }
        var newCounter = parseInt(gameElements.counterSpan.innerHTML);
        newCounter++;
        gameElements.counterSpan.innerHTML = newCounter.toString();
        if (+gameElements.counterSpan.innerHTML > maxClicks) {
            squareGame.notificationInformer("You are loser! Too much clicks! You will have to begin from the start!");
        }
    };
    SquaresGameLogic.prototype.notificationInformer = function (str) {
        var notificationContainer = document.createElement('div');
        notificationContainer.classList.add('notification');
        notificationContainer.innerHTML = str;
        document.body.appendChild(notificationContainer);
        setTimeout(function () {
            location.reload();
        }, 3000);
    };
    return SquaresGameLogic;
}());
var squareGame = new SquaresGameLogic();
squareGame.init();
