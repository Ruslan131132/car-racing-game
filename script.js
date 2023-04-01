const score = document.querySelector('.score'),
    startBtn = document.querySelector('.game__start'),
    gameArea = document.querySelector('.gamearea'),
    car = document.createElement('div'),
    diffBtn = document.querySelectorAll('.difficulty__button'),
    diffSelected = document.querySelector('.difficulty-selected'),
    screens = document.querySelectorAll('.screen'),
    screenGame = document.querySelector('.screen_game'),
    screenStart = document.querySelector('.screen_start'),
    startMenu = document.querySelector('.start__menu');

let allowSwipe = true;

let posInit = 0,
    posX1 = 0,
    posX2 = 0,
    posY1 = 0,
    posY2 = 0,
    posFinal = 0,
    isSwipe = false,
    isScroll = false
    activeEnemiesLines = [];

const enemyStyles = ['enemy1', 'enemy2', 'enemy3', 'enemy4', 'enemy5'];
const lineStyles = ['forest_1', 'forest_2', 'forest_3'];
const enemyPositions = [
    (gameArea.offsetWidth * 100 / 590) + ((gameArea.offsetWidth * 60 / 590)) - 25 + 'px',
    'calc(50% - 25px)',
    (gameArea.offsetWidth * 360 / 590) + ((gameArea.offsetWidth * 65 / 590)) - 25  + 'px',
];

car.classList.add('car');

document.addEventListener('keydown', startGame);
document.addEventListener('keyup', stopGame);

const music = ['./audio/game-audio.mp3'];
const audio = new Audio();
audio.src = music[0];
audio.volume = 0.1;

const keys = {
    ArrowDown: false,
    ArrowUp: false,
    ArrowLeft: false,
    ArrowRight: false,
};

const settings = {
    start: false,
    score: 0,
    speed: 6,
    traffic: 3,
};

function getQuantityElements(heightElement) {
    return document.documentElement.clientHeight / heightElement + 1;
}

function random(num) {
    return Math.floor(Math.random() * num);
}

diffBtn.forEach(item => {
    item.addEventListener('click', () => {
        if (item.classList.contains('easy')) {
            settings.speed = 5;
            settings.traffic = 3.5;
            diffSelected.textContent = 'Выбрана сложность: легкая';
            diffBtn.forEach(item => {
                item.classList.remove('active');
            });
            item.classList.add('active');
        } else if (item.classList.contains('medium')) {
            settings.speed = 6;
            settings.traffic = 3;
            diffSelected.textContent = 'Выбрана сложность: средняя';
            diffBtn.forEach(item => {
                item.classList.remove('active');
            });
            item.classList.add('active');
        } else if (item.classList.contains('hard')) {
            settings.speed = 10;
            settings.traffic = 2.5;
            diffSelected.textContent = 'Выбрана сложность: сложная';
            diffBtn.forEach(item => {
                item.classList.remove('active');
            });
            item.classList.add('active');
        }
    });
});

startBtn.addEventListener('click', () => {
    startMenu.classList.add('hide');
    gameArea.innerHTML = '';
    car.style.left = 'calc(50% - 25px)';
    car.style.bottom = '170px';
    screenGame.classList.add('screen-up')
    screenGame.classList.remove('screen_hide')
    screenStart.classList.remove('screen_show');
    // ГЕНЕРАЦИЯ ПОЛЯ
    for (let j = 0; j < 5; j++) {
        const line_block = document.createElement('div');
        line_block.classList.add('line_block');
        line_block.style.bottom = (j) * 298 + 'px';
        line_block.y = ((j) * 298);
        line_block.style.backgroundImage = 'url("image/forest/' + lineStyles[random(lineStyles.length)] + '.png")'
        gameArea.appendChild(line_block);
    }

    for (let i = 0; i < Math.ceil(getQuantityElements(80 * settings.traffic)); i++) {//lines
        let y = -300 * (i + 1);

        let countCars = Math.floor(Math.random() * 2) + 1; // количество машин на одной полосе

        const positions = JSON.parse(JSON.stringify(enemyPositions));

        activeEnemiesLines[i] = []

        for (let j = 0; j < countCars; j++) {//lines
            let randPos = random(positions.length)
            let carPos = positions[randPos];
            positions.splice(randPos, 1)

            const enemy = document.createElement('div');
            enemy.classList.add('enemy');
            enemy.dataset.line = i;
            enemy.dataset.pos = carPos;
            enemy.y = y

            enemy.style.left = carPos

            // Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';

            enemy.style.top = enemy.y + 'px';
            enemy.style.background =
                'rgba(0, 0, 0, 0) url(./image/' +
                enemyStyles[random(enemyStyles.length)] +
                '.png) center / cover no-repeat';
            gameArea.append(enemy);
            gameArea.appendChild(enemy);
            activeEnemiesLines[i].push(enemy)
        }
    }
    settings.score = 0;
    settings.start = true;
    gameArea.appendChild(car);
    settings.x = car.offsetLeft;
    settings.y = car.offsetTop;
    audio.autoplay = true;
    audio.play();
    requestAnimationFrame(playGame);
});


// sliderTrack.addEventListener('transitionend', () => allowSwipe = true);


let getEvent = function () {
    return (event.type.search('touch') !== -1) ? event.touches[0] : event;
}

let swipeStart = function () {
    let evt = getEvent();


    if (allowSwipe) {

        posInit = posX1 = evt.clientX;
        posY1 = evt.clientY;
        //если страница с игрой и игра идет?

        document.addEventListener('touchmove', swipeAction);
        document.addEventListener('touchend', swipeEnd);
    }
}

let swipeEnd = function () {
    posFinal = posInit - posX1;

    isScroll = false;
    isSwipe = false;

    document.removeEventListener('touchmove', swipeAction);
    document.removeEventListener('touchend', swipeEnd);

    keys.ArrowRight = false
    keys.ArrowLeft = false

    // if (posInit < posX1) {
    //     slideIndex--;
    // } else if (posInit > posX1) {
    //     slideIndex++;
    // }
    //

    // if (allowSwipe) {
    //     if (Math.abs(posFinal) > posThreshold) {
    //
    //     }
    //
    //     if (posInit !== posX1) {
    //         allowSwipe = false;
    //         slide();
    //     } else {
    //         allowSwipe = true;
    //     }
    //
    // } else {
    //     allowSwipe = true;
    // }

}


let swipeAction = function () {

    let evt = getEvent();

    posX2 = posX1 - evt.clientX;
    posX1 = evt.clientX;


    posY2 = posY1 - evt.clientY;
    posY1 = evt.clientY;


    // if (posX1 == settings.x || Math.abs(posX1 - settings.x) < 30) {
    keys.ArrowRight = false
    keys.ArrowLeft = false
    settings.x = Math.ceil(posX1) - 25
    if (settings.x > gameArea.offsetWidth - car.offsetWidth - (gameArea.offsetWidth * 100 / 590)) {
        settings.x = gameArea.offsetWidth - car.offsetWidth - (gameArea.offsetWidth * 100 / 590)
    }
    if (settings.x < 0 + (gameArea.offsetWidth * 100 / 590)) {
        settings.x = 0 + (gameArea.offsetWidth * 100 / 590)
    }
    return
    // }


    // if (posX1 - posInit > 0) {
    //     keys.ArrowRight = true
    //     keys.ArrowLeft = false
    //     if (settings.x < gameArea.offsetWidth - car.offsetWidth) {
    //         settings.x += settings.speed;
    //     }
    // } else if (posX1 - posInit < 0) {
    //     keys.ArrowLeft = true
    //     keys.ArrowRight = false
    //     if (settings.x > 0) {
    //         settings.x -= settings.speed;
    //     }
    // }
    //
    // console.log('posX2: ' + posX2)
    // console.log(settings.x)
    // console.log('posX1: ' + posX1)
    // console.log('posY2: ' + posY2)
    // console.log('posY1: ' + posY1)
    // console.log('posInit: ' + posInit)

    // определение действия свайп или скролл
    // if (!isSwipe && !isScroll) {
    //     let posY = Math.abs(posY2);
    //     if (posY > 7 || posX2 === 0) {
    //         isScroll = true;
    //         allowSwipe = false;
    //     } else if (posY < 7) {
    //         isSwipe = true;
    //     }
    // }
    //
    // if (isSwipe) {
    //     if (settings.x > 0) {
    //         settings.x -= settings.speed;
    //     }
    //     if (settings.x < gameArea.offsetWidth - car.offsetWidth) {
    //         settings.x += settings.speed;
    //     }
    //
    //
    //     console.log()
    // // запрет ухода влево на первом слайде
    // if (slideIndex === 0) {
    //     if (posInit < posX1) {
    //         setTransform(transform, 0);
    //         return;
    //     } else {
    //         allowSwipe = true;
    //     }
    // }
    //
    // // запрет ухода вправо на последнем слайде
    // if (slideIndex === --slides.length) {
    //     if (posInit > posX1) {
    //         setTransform(transform, lastTrf);
    //         return;
    //     } else {
    //         allowSwipe = true;
    //     }
    // }
    //
    // // запрет протаскивания дальше одного слайда
    // if (posInit > posX1 && transform < nextTrf || posInit < posX1 && transform > prevTrf) {
    //     reachEdge();
    //     return;
    // }
    // }

}

function startGame(event) {
    event.preventDefault();
    keys[event.key] = true;
}

function playGame() {
    if (settings.start) {
        settings.score += settings.speed;
        score.innerHTML = 'Score <br>' + settings.score;
        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft && settings.x > (gameArea.offsetWidth * 100 / 590)) {
            settings.x -= settings.speed;
        }
        if (keys.ArrowRight && settings.x < gameArea.offsetWidth - car.offsetWidth - (gameArea.offsetWidth * 100 / 590)) {
            settings.x += settings.speed;
        }
        if (keys.ArrowUp && settings.y > 0) {
            settings.y -= settings.speed;
        }
        if (keys.ArrowDown && settings.y < gameArea.offsetHeight - car.offsetHeight) {
            settings.y += settings.speed;
        }
        car.style.top = settings.y + 'px';
        car.style.left = settings.x + 'px';
        requestAnimationFrame(playGame);
    }
}

function stopGame(event) {
    event.preventDefault();
    keys[event.key] = false;
}

function moveRoad() {
    let lines = document.querySelectorAll('.line_block');
    lines.forEach(function (line) {
        line.y -= settings.speed;
        line.style.bottom = line.y + 'px';
        if (line.y <= -298) {
            line.y = 1192 + line.y + 298;
            line.style.backgroundImage = 'url("image/forest/' + lineStyles[random(lineStyles.length)] + '.png")'

        }
    });
}

function moveEnemy() {
    activeEnemiesLines.forEach(function (enemies, index) {
        const positions = JSON.parse(JSON.stringify(enemyPositions));
        enemies.forEach(function (item) {
            let carRect = car.getBoundingClientRect();
            let enemyRect = item.getBoundingClientRect();
            if (
                carRect.top <= enemyRect.bottom &&
                carRect.right >= enemyRect.left &&
                carRect.left <= enemyRect.right &&
                carRect.bottom >= enemyRect.top
            ) {
                settings.start = false;

                audio.pause();
                audio.currentTime = 0;
                audio.autoplay = false;
                startMenu.classList.remove('hide');
                settings.speed = 5;
                settings.traffic = 3;
                diffSelected.textContent = '';
                diffBtn.forEach(item => {
                    item.classList.remove('active');
                });
            }
            item.y += settings.speed / 2;
            item.style.top = item.y + 'px';
            if (item.y >= document.documentElement.clientHeight) {
                item.y = -600;
                let randPos = random(positions.length)
                let carPos = positions[randPos];
                positions.splice(randPos, 1)
                item.style.left = carPos
                item.dataset.pos = carPos;
                item.style.background =
                    'rgba(0, 0, 0, 0) url(./image/' +
                    enemyStyles[random(enemyStyles.length)] +
                    '.png) center / cover no-repeat';
            }
        });
    })
}


document.addEventListener('touchstart', swipeStart);