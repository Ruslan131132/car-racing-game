const score = document.querySelector('.score_container'),
    gameArea = document.querySelector('.gamearea'),
    car = document.createElement('div'),
    diffBtn = document.querySelectorAll('.difficulty__button'),
    againBtn = document.querySelector('.play_again'),
    backToMenuBtn = document.querySelector('.change-mode-button'),
    leaderBtn = document.querySelector('.leader-button'),
    screenGame = document.querySelector('.screen_game'),
    screenStart = document.querySelector('.screen_start'),
    screenResult = document.querySelector('.screen_result'),
    puddle = document.querySelector('.puddle'),
    trustScroll = document.querySelector('.trust-scroll__image'),
    pointsValue = document.querySelector('.points-value');

let allowSwipe = true;

let posInit = 0,
    posX1 = 0,
    posX2 = 0,
    posY1 = 0,
    posY2 = 0,
    posFinal = 0,
    isSwipe = false,
    isScroll = false,
    activeEnemiesLines = [],
    splash;

// const enemyStyles = ['enemy1', 'enemy2', 'enemy3', 'enemy4', 'enemy5'];
let enemyStyles = [];

const lineStyles = ['img_1', 'img_2', 'img_3', 'img_4'];
const enemyPositions = [
    (gameArea.offsetWidth * 165 / 590) + 'px',
    gameArea.offsetWidth * 0.5 + 'px',
    (gameArea.offsetWidth * 425 / 590) + 'px',
];
const enemyOffsets = [-20, -10, 10, 20];
const lineAvailablePositions = [];

car.classList.add('car');

document.addEventListener('keydown', startGame);
document.addEventListener('keyup', stopGame);

const music = ['./audio/game-audio.wav', './audio/boom.wav', './audio/splash.wav'];
const audio = new Audio();
audio.src = music[0];
audio.volume = 0.1;
const boomAudio = new Audio();
boomAudio.src = music[1];
boomAudio.volume = 0.1;
const splashAudio = new Audio();
splashAudio.src = music[2];
splashAudio.volume = 0.1;

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
    mode: 'gravity'
};

let speedSum = settings.speed
let speedSumInc = 1
let puddleSpeedSum = settings.speed
let puddleSpeedSumInc = 1

function getQuantityElements(heightElement) {
    return document.documentElement.clientHeight / heightElement + 1;
}

function random(num) {
    return Math.floor(Math.random() * num);
}

diffBtn.forEach(item => {
    item.addEventListener('click', () => {
        if (item.classList.contains('offroad')) {
            settings.mode = 'offroad'
            enemyStyles = [
                {
                    name: 'enemy1',
                    width: document.documentElement.clientWidth * 133 / 590 + 'px',
                    height: document.documentElement.clientHeight * 49 / 1200 + 'px',
                },
                {
                    name: 'enemy2',
                    width: document.documentElement.clientWidth * 111 / 590 + 'px',
                    height: document.documentElement.clientHeight * 50 / 1200 + 'px',
                }
            ];
            speedSum = settings.speed;
            speedSumInc = 1
            generateGame()
        } else if (item.classList.contains('gravity')) {
            settings.mode = 'gravity'
            enemyStyles = [
                {
                    name: 'enemy1',
                    width: '67px',
                    height: '223px',
                },
                {
                    name: 'enemy2',
                    width: '46.87px',
                    height: '98px',
                },
                {
                    name: 'enemy3',
                    width: '64.97px',
                    height: '125px',
                },
                {
                    name: 'enemy4',
                    width: '51px',
                    height: '96.98px',
                },
            ];
            speedSum = settings.speed / 2;
            speedSumInc = 0.5
            generateGame()
        } else if (item.classList.contains('comfort')) {
            settings.mode = 'comfort'
            speedSum = settings.speed;
            speedSumInc = 1
            enemyStyles = [
                {
                    name: 'enemy1',
                    width: document.documentElement.clientWidth * 89 / 590 + 'px',
                    height: document.documentElement.clientHeight * 49 / 1200 + 'px',
                },
                {
                    name: 'enemy2',
                    width: document.documentElement.clientWidth * 30 / 590 + 'px',
                    height: document.documentElement.clientHeight * 35 / 1200 + 'px',
                }
            ];
            generateGame()
        }
    });
});

againBtn.addEventListener('click', (event) => {
   generateGame()
});

backToMenuBtn.addEventListener('click', (event) => {
    screenResult.classList.add('screen_hide');
    screenGame.classList.add('screen_hide')
    screenStart.classList.remove('screen_hide');
    screenStart.classList.add('screen_show');
    screenGame.classList.remove('screen-up')
    screenGame.style.marginTop = null
});

function generateGame() {
    gameArea.innerHTML = '';
    car.style.left = 'calc(50% - 25px)';
    car.style.bottom = '170px';
    screenResult.classList.add('screen_hide');
    screenGame.classList.remove('screen_hide')
    screenStart.classList.remove('screen_show');
    screenGame.classList.add('screen-up')
    trustScroll.style.display = 'block'
    setTimeout(() => {
        trustScroll.style.display = 'none'
    }, 3000);


    // ГЕНЕРАЦИЯ ПОЛЯ
    for (let j = 0; j < 5; j++) {
        const line_block = document.createElement('div');
        line_block.classList.add('line_block');
        line_block.style.bottom = (j) * 298 + 'px';
        line_block.y = ((j) * 298);
        line_block.style.backgroundImage = 'url("image/' + settings.mode + '/' + lineStyles[random(lineStyles.length)] + '.png")'
        gameArea.appendChild(line_block);
    }

    // ГЕНЕРАЦИЯ ПРЕПЯТСТВИЙ
    for (let i = 0; i < 4; i++) {//lines
        let y = -500 * (i + 1);

        let countCars = i % 2 == 0 ? 1 : 2; // количество машин на одной полосе
        let enemyOffsetsArray = JSON.parse(JSON.stringify(enemyOffsets));
        activeEnemiesLines[i] = []
        lineAvailablePositions[i] = [...enemyPositions];

        for (let j = 0; j < countCars; j++) {//lines
            let randPos = random(lineAvailablePositions[i].length)
            let carPos = lineAvailablePositions[i][randPos];
            let randOffset = random(enemyOffsetsArray.length)
            let enemyOffset = enemyOffsetsArray[randOffset]
            lineAvailablePositions[i].splice(randPos, 1)
            enemyOffsetsArray.splice(randOffset, 1)

            const enemy = document.createElement('div');
            enemy.classList.add('enemy');
            // enemy.dataset.line = i;
            enemy.dataset.pos = carPos;
            enemy.dataset.offset = enemyOffset;
            let chosen_enemy = enemyStyles[random(enemyStyles.length)]
            enemy.style.background =
                'rgba(0, 0, 0, 0) url(image/' + settings.mode + '/' + chosen_enemy.name + '.svg) center / cover no-repeat';
            enemy.style.width = chosen_enemy.width
            enemy.style.height = chosen_enemy.height
            enemy.y = y + enemyOffset
            enemy.style.top = enemy.y + 'px';
            enemy.style.left = 'calc(' + carPos + ' - ' + chosen_enemy.width + '/ 2)'
            gameArea.append(enemy);
            gameArea.appendChild(enemy);
            activeEnemiesLines[i].push(enemy)
        }
    }

    //Лужа
    const puddle = document.createElement('div');
    puddle.classList.add('enemy');
    puddle.classList.add('puddle');
    puddle.y = -2500;
    puddle.style.top = '-2500px';
    puddle.style.left = (gameArea.offsetWidth * 101 / 590) + 'px';
    puddle.style.backgroundImage = 'url("image/' + settings.mode + '/puddle.svg")'
    gameArea.appendChild(puddle);
    activeEnemiesLines[4] = [puddle];

    //ВСПЛЕСК
    splash = document.createElement('div');
    splash.classList.add('splash');
    splash.classList.add('hide');
    gameArea.appendChild(splash);

    //Машина на другой полосе

    if (settings.mode == 'gravity') {
        let chosen_enemy = enemyStyles[random(enemyStyles.length)]
        const enemyBack = document.createElement('div');
        enemyBack.classList.add('enemy');
        enemyBack.classList.add('back');
        enemyBack.style.background =
            'rgba(0, 0, 0, 0) url(image/' + settings.mode + '/' + chosen_enemy.name + '.svg) center / cover no-repeat';
        enemyBack.style.width = chosen_enemy.width
        enemyBack.style.height = chosen_enemy.height
        enemyBack.style.transform = 'rotate(180deg)'
        enemyBack.y = - 2000
        enemyBack.style.top = '-2000px';
        enemyBack.style.left = '-30px'
        gameArea.appendChild(enemyBack);
        activeEnemiesLines[5] = [enemyBack];
    }

    settings.score = 0;
    settings.start = true;
    gameArea.appendChild(car);
    settings.x = car.offsetLeft;
    settings.y = car.offsetTop;
    audio.autoplay = true;
    audio.play();
    // playGame();
    requestAnimationFrame(playGame);
}

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
}


let swipeAction = function () {

    let evt = getEvent();

    posX2 = posX1 - evt.clientX;
    posX1 = evt.clientX;

    //РАБОЧАЯ ВЕРСИЯ
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


    //НОВАЯ ВЕРСИЯ
    // if (posX1 == settings.x || Math.abs(posX1 - settings.x) < 50) {
    //     settings.x = Math.ceil(posX1) - 25
    //     if (settings.x > gameArea.offsetWidth - car.offsetWidth - (gameArea.offsetWidth * 100 / 590)) {
    //         settings.x = gameArea.offsetWidth - car.offsetWidth - (gameArea.offsetWidth * 100 / 590)
    //     }
    //     if (settings.x < (gameArea.offsetWidth * 100 / 590)) {
    //         settings.x = (gameArea.offsetWidth * 100 / 590)
    //     }
    //     return
    // }
    //
    //
    // if (posX1 - posInit > 0) {
    //     if (settings.x < gameArea.offsetWidth - car.offsetWidth - (gameArea.offsetWidth * 100 / 590) - 25) {
    //         settings.x += settings.speed;
    //     }
    // } else if (posX1 - posInit < 0) {
    //     if (settings.x > (gameArea.offsetWidth * 100 / 590) + 25) {
    //         settings.x -= settings.speed;
    //     }
    // }
}

function startGame(event) {
    event.preventDefault();
    keys[event.key] = true;
}

function playGame() {
    if (settings.start) {
        settings.score += settings.speed;
        let checkScore = settings.score % 5000

        if (settings.speed <= 12 && checkScore > 4996 || (checkScore >= 0 && checkScore < 4)) {
            settings.speed += 1
            speedSum += speedSumInc
            puddleSpeedSum += puddleSpeedSumInc
        }
        score.innerHTML = settings.score;
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
        // setTimeout(playGame, 1000 / 120)
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
            line.style.backgroundImage = 'url("image/' + settings.mode + '/' + lineStyles[random(lineStyles.length)] + '.png")'

        }
    });
}

function moveEnemy() {
    activeEnemiesLines.forEach(function (enemies, index) {
        if (index == 5) {
            enemies[0].y += 2.5 * speedSum;
            enemies[0].style.top = enemies[0].y + 'px';
            if (enemies[0].y >= document.documentElement.clientHeight) {
                enemies[0].y = -1800;
                let chosen_enemy = enemyStyles[random(enemyStyles.length)]
                enemies[0].style.background =
                    'rgba(0, 0, 0, 0) url(./image/' + settings.mode + '/' + chosen_enemy.name + '.svg) center / cover no-repeat';
                enemies[0].style.width = chosen_enemy.width
                enemies[0].style.height = chosen_enemy.height
            }
            return;
        } else if (index == 4) {
            let carRect = car.getBoundingClientRect();
            let enemyRect = enemies[0].getBoundingClientRect();
            if (carRect.top - enemyRect.bottom <= puddleSpeedSum && carRect.top - enemyRect.bottom >= -puddleSpeedSum) {
                splashAudio.play()
                splash.classList.remove('hide');
                splash.style.left = carRect.left - (gameArea.offsetWidth * 212 / 590 / 2) + 25 + 'px'
                splash.style.top = carRect.top + 'px';
                setTimeout(() => {
                    splash.classList.add('splash-after');
                    splash.style.left = carRect.left - (gameArea.offsetWidth * 300 / 590 / 2) + 25 + 'px'
                    splash.style.top = carRect.top + 'px';
                    setTimeout(() => {
                        splash.classList.remove('splash-after');
                        splash.classList.add('hide');
                    }, 100);
                }, 100);
            }
            enemies[0].y += puddleSpeedSum;
            enemies[0].style.top = enemies[0].y + 'px';
            if (enemies[0].y >= document.documentElement.clientHeight) {
                enemies[0].y = -2500;
            }
            return;
        } else {
            enemies.forEach(function (item) {
                let carRect = car.getBoundingClientRect();
                let enemyRect = item.getBoundingClientRect();
                if (
                    carRect.top <= enemyRect.bottom - 2 &&
                    carRect.right >= enemyRect.left - 2 &&
                    carRect.left <= enemyRect.right - 2 &&
                    carRect.bottom >= enemyRect.top - 2
                ) {
                    boomAudio.play()
                    settings.start = false;
                    savePoints({
                        mode: settings.mode,
                        score: settings.score
                    });
                    audio.pause();
                    audio.currentTime = 0;
                    audio.autoplay = false;
                    settings.speed = 6
                    pointsValue.innerHTML = settings.score;
                    speedSum = settings.mode == 'gravity' ? settings.speed/2 : settings.speed
                    puddleSpeedSum = settings.speed;
                    const boom = document.createElement('div');
                    boom.classList.add('boom');

                    //ПОЗИЦИЯ ПО X
                    if (carRect.right - enemyRect.left < 15) {
                        boom.style.left = enemyRect.left - 25 + 'px'
                    } else if (enemyRect.right - carRect.left < 15 ) {
                        boom.style.left = carRect.left - 25 + 'px'
                    } else {
                        boom.style.left = carRect.left + ((carRect.right - carRect.left )/2) - 25 + 'px'
                    }

                    //ПОЗИЦИЯ ПО Y
                    if (enemyRect.bottom - carRect.top < 10) {
                        boom.style.top = carRect.top - 25 + 'px';
                    } else if (carRect.bottom - enemyRect.top < 10 ) {
                        boom.style.top = enemyRect.top - 25 + 'px';
                    } else {
                        boom.style.top = enemyRect.top + 25 + 'px';
                    }


                    setTimeout(() => {
                        // gameArea.innerHTML = '';
                        boomAudio.pause();
                        boomAudio.currentTime = 0;
                        screenResult.classList.remove('screen_hide');
                        screenStart.classList.add('screen_hide');
                        screenGame.classList.add('screen_hide');
                        againBtn.classList.add(settings.mode);
                        screenGame.classList.remove('screen-up')
                        screenGame.style.marginTop = '0'
                    }, 2000);

                    gameArea.append(boom);
                }
                item.y += speedSum;
                item.style.top = item.y + 'px';
                if (item.y >= document.documentElement.clientHeight) {
                    item.y = -2000 + document.documentElement.clientHeight;
                    let carPos = lineAvailablePositions[index][0];
                    let chosen_enemy = enemyStyles[random(enemyStyles.length)]
                    item.style.left = 'calc(' + carPos + ' - ' + chosen_enemy.width + '/ 2)'
                    lineAvailablePositions[index] = [item.dataset.pos]
                    item.dataset.pos = carPos;

                    item.style.background =
                        'rgba(0, 0, 0, 0) url(./image/' + settings.mode + '/' + chosen_enemy.name + '.svg) center / cover no-repeat';
                    item.style.width = chosen_enemy.width
                    item.style.height = chosen_enemy.height
                }
            });
        }

    })
}

leaderBtn.addEventListener('click', () => {
    document.querySelector('.modal-overlay').classList.add('--show')
    let modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = ''
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://cordiant.4k-pr.com/api/getTopUsers', true);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send();

    xhr.onload = function () {
        if (xhr.status != 200) { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
            console.log(`Ошибка ${xhr.status}: ${xhr.statusText}`); // Например, 404: Not Found
        } else { // если всё прошло гладко, выводим результат
            console.log(`Готово, получили ${xhr.response.length} байт`); // response -- это ответ сервера
            let response = JSON.parse(xhr.response);
            modalBody.innerHTML = response.data.map(item => {
                return `<div class="user-item">
                <div class="user-info">
                    <img class="user-img" src="${item.avatar ? 'http://cordiant.4k-pr.com/storage/' + item.avatar : 'image/user.jpg'}">
                    <span class="user-mode">${item.mode}</span>
                </div>
                <span class="user-name">${item.tg}</span>
                <span class="user-points">${item.count}</span>
            </div>`
            }).join('');
        }
    };

})

function savePoints(data) {
    const urlParams = new URLSearchParams(window.location.search);
    let user_id = urlParams.get('user_id')

    if (user_id == null) return;

    let formData = JSON.stringify({
        user_id: user_id,
        count: data.score,
        mode: data.mode
    });

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://cordiant.4k-pr.com/api/addPoints', true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send(formData);
}

document.addEventListener('touchstart', swipeStart);