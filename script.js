const score = document.querySelector('.score_container'),
    game = document.querySelector('.game'),
    cordiantHref = document.querySelector('.cordiant-href'),
    car = document.createElement('div'),
    diffBtn = document.querySelectorAll('.difficulty__button'),
    againBtn = document.querySelector('.play_again'),
    backToMenuBtn = document.querySelector('.change-mode-button'),
    leaderBtn = document.querySelector('.leader-button'),
    screenGame = document.querySelector('.screen_game'),
    screenStart = document.querySelector('.screen_start'),
    screenResult = document.querySelector('.screen_result'),
    pointsValue = document.querySelector('.points-value'),
    startMenu = document.querySelector('.start__menu');

let allowSwipe = false;
let isOfficerActive = false;
let crossedSlowBlock = false;
let timeOutId = null;

let posInit = 0,
    posX1 = 0,
    posX2 = 0,
    posY1 = 0,
    posY2 = 0,
    posFinal = 0,
    isSwipe = false,
    isScroll = false;


let lines,//блоки заднего фона
    enemies, //препятствия
    gameArea,//игровое поле
    trustScroll;
const lineStyles = ['img_1', 'img_2', 'img_3', 'img_4'];
const enemyOffsets = [-20, -10, 10, 20];
const lineAvailablePositions = [];
let enemyStyles = ['enemy1', 'enemy2', 'enemy3', 'enemy4'];
const enemyPositions = [
    (65 / 390),
    0.5,
    (330 / 390),
];

officerPosition = 65 / 390;

const settings = {
    start: false,
    score: 0,
    speed: 6,
    traffic: 3,
    last: 6,
    mode: 'winter_drive'
};


let speedSum = settings.speed
let speedSumInc = 1
let puddleSpeedSum = settings.speed
let puddleSpeedSumInc = 1

car.classList.add('car');

document.addEventListener('keydown', startGame);
document.addEventListener('keyup', stopGame);

const music = ['./audio/game-audio.wav', './audio/boom.wav', './audio/splash.wav'];
const audio = new Audio();
audio.src = music[0];
audio.volume = 0.05;
const boomAudio = new Audio();
boomAudio.src = music[1];
boomAudio.volume = 0.1;
const splashAudio = new Audio();
splashAudio.src = music[2];
splashAudio.volume = 0.1;


//Лужа
const puddle = document.createElement('div');
puddle.classList.add('puddle_ice');
puddle.y = -1500;
puddle.style.top = '-1500px';

//ВСПЛЕСК
const splash = document.createElement('div');
splash.classList.add('splash');
splash.classList.add('hide');

const keys = {
    ArrowDown: false,
    ArrowUp: false,
    ArrowLeft: false,
    ArrowRight: false,
};

function random(num) {
    return Math.floor(Math.random() * num);
}

document.querySelector('.splide__button').addEventListener('click', () => {
    let mode = document.querySelector('.splide__slide.is-active').dataset.mode;
    if (mode == 'trucks') {
        settings.mode = 'trucks'
        speedSum = settings.speed / 2;
        speedSumInc = 0.5
        enemyStyles = ['enemy1', 'enemy2', 'enemy3', 'enemy3'];
        cordiantHref.href = 'https://cordiant.ru/professional/cordiant-professional-dr-1/'
        generateGame()
    } else if (mode == 'winter_drive') {
        settings.mode = 'winter_drive'
        speedSum = settings.speed / 2;
        speedSumInc = 0.5
        enemyStyles = ['enemy1', 'enemy2', 'enemy3', 'enemy4'];
        generateGame()
        cordiantHref.href = 'https://cordiant.ru/car/winter/cordiant_winter_drive_2/'
    } else if (mode == 'snow_cross') {
        settings.mode = 'snow_cross'
        speedSum = settings.speed;
        speedSumInc = 1
        enemyStyles = ['enemy1', 'enemy2', 'enemy3'];
        cordiantHref.href = 'https://cordiant.ru/car/winter/snow_cross_2/'
        generateGame()
    } else if (mode == 'cars_drive') {
        settings.mode = 'cars_drive'
        speedSum = settings.speed;
        speedSumInc = 1
        enemyStyles = ['enemy1', 'enemy2', 'enemy3'];
        cordiantHref.href = 'https://cordiant.ru/car/business/cordiant_business_ca2/'
        generateGame()
    }
});

function generateGame() {
    allowSwipe = true
    game.innerHTML = '';
    screenGame.classList.add('screen-show')
    screenGame.classList.remove('screen_hide')
    screenStart.classList.remove('screen-show')
    screenStart.classList.add('screen_hide')
    screenResult.classList.add('screen_hide')
    screenResult.classList.remove('screen-show')
    score.classList.remove('hide');
    gameArea = document.createElement('div');
    gameArea.classList.add('gamearea');
    game.appendChild(gameArea);
    car.style.left = 'calc(50% - 25px)';
    car.style.bottom = '170px';
    car.classList.add(settings.mode)

    trustScroll = document.createElement('div');
    trustScroll.classList.add('trust-scroll__image')
    trustScroll.style.display = 'block'
    setTimeout(() => {
        trustScroll.style.display = 'none'
    }, 3000);
    game.appendChild(trustScroll)

    // ГЕНЕРАЦИЯ ПОЛЯ
    for (let j = 0; j < 5; j++) {
        const line_block = document.createElement('div');
        line_block.classList.add('line_block');
        line_block.classList.add(settings.mode);
        let img = lineStyles[random(lineStyles.length)]
        line_block.classList.add(img);
        line_block.dataset.img = img;
        line_block.dataset.officer = "0";
        if (j == 2) {
            line_block.classList.add('slow_before_officer');
            line_block.classList.add('enemy');
        }
        if (j == 3) {
            // line_block.classList.add('img_5');
            line_block.classList.add('officer_img');
            line_block.classList.add('enemy');
            line_block.classList.add(settings.mode);
            // line_block.dataset.img = 'img_5';
            line_block.dataset.officer = "1";
        }

        line_block.style.bottom = (j) * 298 + 'px';
        line_block.y = ((j) * 298);
        // line_block.style.backgroundImage = 'url("image/' + settings.mode + '/' + lineStyles[random(lineStyles.length)] + '.png")'
        game.appendChild(line_block);
    }
    lines = document.querySelectorAll('.line_block');


    // ГЕНЕРАЦИЯ ПРЕПЯТСТВИЙ
    for (let i = 0; i < 16; i++) {//lines
        let y = -500 * (i + 1);

        let countCars = i % 3 == 0 ? 2 : 1; // количество машин на одной полосе
        let enemyOffsetsArray = JSON.parse(JSON.stringify(enemyOffsets));
        lineAvailablePositions[i] = [...enemyPositions];

        // if (i == 15) {
        //     lineAvailablePositions[i].splice(0, 1) // левая часть
        //     const officer = document.createElement('div');
        //     let officerPos = lineAvailablePositions[i][0];
        //     officer.classList.add('enemy');
        //     officer.dataset.line = i;
        //     officer.dataset.pos = officerPos;
        //     officer.dataset.offset = 0;
        //     officer.classList.add('officer');
        //     officer.dataset.current = 'officer';
        //     officer.y = y - 120
        //     officer.style.top = officer.y + 'px';
        //     gameArea.appendChild(officer);
        //     officer.classList.add("--hide");
        //     // officer.style.left = gameArea.offsetWidth * officerPos - (officer.clientWidth / 2) + 'px'
        // } else  {
        for (let j = 0; j < countCars; j++) { //lines
            let randPos = random(lineAvailablePositions[i].length)
            let carPos = lineAvailablePositions[i][randPos];
            let randOffset = random(enemyOffsetsArray.length)
            let enemyOffset = enemyOffsetsArray[randOffset]
            lineAvailablePositions[i].splice(randPos, 1)
            enemyOffsetsArray.splice(randOffset, 1)
            const enemy = document.createElement('div');
            enemy.classList.add('enemy');
            enemy.classList.add(settings.mode);
            enemy.dataset.line = i;
            enemy.dataset.pos = carPos;
            enemy.dataset.offset = enemyOffset;
            let chosen_enemy = enemyStyles[random(enemyStyles.length)]
            enemy.classList.add(chosen_enemy);
            // if (settings.mode == 'trucks' && chosen_enemy =='enemy2') {
            //     enemy.classList.add('free');
            // }
            enemy.dataset.current = chosen_enemy;
            enemy.y = y + enemyOffset
            enemy.style.top = enemy.y + 'px';
            gameArea.appendChild(enemy);
            enemy.style.left = gameArea.offsetWidth * carPos - (enemy.clientWidth / 2) + 'px'
        }
        // }


    }
    enemies = document.querySelectorAll('.enemy');

    //Background лужи
    if (settings.mode == 'trucks' || settings.mode == 'cars_drive') {
        puddle.style.backgroundImage = 'url("image/' + settings.mode + '/puddle_ice.svg")'
        gameArea.appendChild(puddle);
        // gameArea.appendChild(splash);
    }

    //Машина на другой полосе

    // if (settings.mode == 'winter_drive') {
    //     let chosen_enemy = enemyStyles[random(enemyStyles.length)]
    //     enemyBack.style.background =
    //         'rgba(0, 0, 0, 0) url(image/' + settings.mode + '/' + chosen_enemy.name + '.svg) center / cover no-repeat';
    //     enemyBack.style.width = chosen_enemy.width
    //     enemyBack.style.height = chosen_enemy.height
    //     enemyBack.style.display = 'block'
    //     gameArea.appendChild(enemyBack);
    // }

    settings.score = 0;
    settings.start = true;
    gameArea.appendChild(car);
    settings.x = car.offsetLeft;
    settings.y = car.offsetTop;
    audio.autoplay = true;
    audio.loop = true;
    audio.play();
    startTimeoutOfficer();
    requestAnimationFrame(playGame);
}

againBtn.onclick = () => {
    generateGame()
}

backToMenuBtn.onclick = () => {
    screenResult.classList.add('screen_hide');
    screenGame.classList.add('screen_hide')
    screenStart.classList.remove('screen_hide');
    screenStart.classList.add('screen_show');
    car.classList.remove(settings.mode)
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

let swipeEnd = function() {
    posFinal = posInit - posX1;
    isScroll = false;
    isSwipe = false;
    document.removeEventListener('touchmove', swipeAction);
    document.removeEventListener('touchend', swipeEnd);
    keys.ArrowRight = false
    keys.ArrowLeft = false
}


let swipeAction = function() {

    let evt = getEvent();

    posX2 = posX1 - evt.clientX;
    posX1 = evt.clientX;


    posY2 = posY1 - evt.clientY;
    posY1 = evt.clientY;

        keys.ArrowRight = false
        keys.ArrowLeft = false
        settings.x = Math.ceil(posX1) - ( 100 / 590 * gameArea.offsetWidth) - 50
        if (settings.x > gameArea.offsetWidth - car.offsetWidth) {
            settings.x = gameArea.offsetWidth - car.offsetWidth
        }
        if (settings.x < 0) {
            settings.x = 0
        }
        return
}

function startGame(event) {
    event.preventDefault();
    keys[event.key] = true;
}

function playGame() {
    if (settings.start) {
        settings.score += settings.speed;
        score.innerHTML = settings.score;
        moveRoad();
        moveEnemy();
        if (settings.mode == 'trucks' || settings.mode == 'cars_drive') {
            movePuddle();
        }

        let checkScore = settings.score % 5000

        if (settings.speed <= 15 && checkScore > 4996 || (checkScore >= 0 && checkScore < 4)) {
            settings.speed += 1
            speedSum += speedSumInc
            puddleSpeedSum += puddleSpeedSumInc
        }

        if (keys.ArrowLeft && settings.x > 0) {
            settings.x -= settings.speed;
        }
        if (keys.ArrowRight && settings.x < gameArea.offsetWidth - car.offsetWidth) {
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
    lines.forEach(function (line) {
        line.y -= settings.speed;
        line.style.bottom = line.y + 'px';
        if (line.y <= -298) {
            line.y = 1192 + line.y + 298;
            let img = isOfficerActive && line.dataset.officer == "1" ? 'img_5' : lineStyles[random(lineStyles.length)];
            line.classList.remove(line.dataset.img);
            line.classList.add(img);
            line.dataset.img = img;
        }
    });
}
function moveEnemy() {
    enemies.forEach(function (item) {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();
        if (
            !item.classList.contains('free') &&
            carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top
        ) {
            if (!item.classList.contains('officer_img') && !item.classList.contains('slow_before_officer') && !((settings.mode == 'snow_cross' || settings.mode == 'cars_drive') && item.classList.contains('enemy2'))) {
                settings.start = false;
                boomAudio.play()
                audio.pause();
                audio.currentTime = 0;
                audio.autoplay = false;
                settings.speed = 6
                clearOfficerTimeOut();
                hideOfficer();
                pointsValue.innerHTML = settings.score;
                speedSum = settings.mode == 'winter_drive' || settings.mode == 'trucks' ? settings.speed / 2 : settings.speed
                puddleSpeedSum = settings.speed;

                savePoints({
                    mode: settings.mode,
                    score: settings.score
                });

                setTimeout(() => {
                    game.innerHTML = '';
                    boomAudio.pause();
                    boomAudio.currentTime = 0;
                    screenResult.classList.remove('screen_hide');
                    screenStart.classList.add('screen_hide');
                    screenGame.classList.add('screen_hide');
                    againBtn.classList.add(settings.mode);
                    screenGame.classList.remove('screen-up')
                    score.classList.add('hide');
                }, 2000);
            } else if (!crossedSlowBlock && document.querySelector('.img_5') && isOfficerActive && item.classList.contains('slow_before_officer')) {
                crossedSlowBlock = true;
                settings.speed = settings.speed - 2;
                if (settings.mode == 'winter_drive' || settings.mode == 'trucks') {
                    speedSum = settings.speed / 2;
                }
            } else if (isOfficerActive && item.classList.contains('officer_img') && item.dataset.img == 'img_5') {
                // setTimeout(() => {
                settings.start = false;
                audio.pause();
                document.querySelector('.modal-overlay.officer-stopped').classList.add('--show')
                setTimeout(() => {
                    document.querySelector('.modal-overlay.officer-stopped').classList.remove('--show')
                    showQuestionModal();
                }, 4000);
                // }, 1000);
            }

        }
        if (!item.classList.contains('officer_img') && !item.classList.contains('slow_before_officer')) {
            item.y += speedSum;
            item.style.top = item.y + 'px';
            if (item.y >= document.documentElement.clientHeight) {
                item.y = -8000 + document.documentElement.clientHeight;
                let carPos =  lineAvailablePositions[item.dataset.line][0];
                item.style.left = gameArea.offsetWidth * carPos - (item.offsetWidth / 2) + 'px'
                lineAvailablePositions[item.dataset.line] = [item.dataset.pos]
                item.dataset.pos = carPos;
            }
        }

    });
}

function movePuddle() {
    // let carRect = car.getBoundingClientRect();
    // let carXPos = car.style.left;
    // let enemyRect = puddle.getBoundingClientRect();
    // if (carRect.top - enemyRect.bottom <= puddleSpeedSum && carRect.top - enemyRect.bottom >= -puddleSpeedSum) {
    //     splashAudio.play()
    //     splash.style.left = 'calc(' + carXPos +  ' - ' + ((gameArea.offsetWidth * 212 / 590 / 2) - 25) + 'px)'
    //     splash.style.top = carRect.top + 'px';
    //     splash.classList.remove('hide');
    //     setTimeout(() => {
    //         splash.classList.add('splash-after');
    //         splash.style.left = 'calc(' + carXPos +  ' - ' + ((gameArea.offsetWidth * 300 / 590 / 2) - 25) + 'px)'
    //         splash.style.top = carRect.top + 'px';
    //         setTimeout(() => {
    //             splash.classList.remove('splash-after');
    //             splash.classList.add('hide');
    //         }, 100);
    //     }, 100);
    // }
    puddle.y += puddleSpeedSum;
    puddle.style.top = puddle.y + 'px';
    if (puddle.y >= document.documentElement.clientHeight) {
        puddle.y = -1500;
    }
}

function showOfficer()
{
    isOfficerActive = true;
    // document.querySelector('.officer').style.left = '-24%'
    // document.querySelector('.officer').style.display = 'block'
    // document.querySelector('.officer').classList.remove("--hide");
}

function hideOfficer()
{
    isOfficerActive = false;
    crossedSlowBlock = false;
    // document.querySelector('.officer').style.left = '-600px';
    // document.querySelector('.officer').style.display = 'none'
    // document.querySelector('.officer').classList.add("--hide");
}

function startTimeoutOfficer()
{
    timeOutId = setTimeout(() => showOfficer(), 20000);
}

function clearOfficerTimeOut()
{
    clearTimeout(timeOutId);
}

leaderBtn.onclick = () => {
    document.querySelector('.modal-overlay').classList.add('--show')
    let modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = ''
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://races-bot-api.solvintech.ru/api/cordiant/getTopUsers', true);

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
                    <img class="user-img" src="${item.avatar ? 'https://races-bot-api.solvintech.ru/storage/' + item.avatar : 'image/icons/user.jpg'}">
                    <span class="user-mode">${item.mode.replaceAll('_', ' ')}</span>
                </div>
                <span class="user-name">${item.tg ? item.tg : item.name}</span>
                <span class="user-points">${item.count}</span>
            </div>`
            }).join('');
        }
    };

}

function showQuestionModal()
{
    document.querySelector('.modal-overlay.question').classList.add('--show')
    let modalBody = document.querySelector('.modal-overlay.question .options');
    let modalTitle = document.querySelector('.modal-overlay.question .modal-title');
    enemies.forEach(function (item) {
        if (!item.classList.contains('line_block')){
            item.y += -1200;
            item.style.top = item.y + 'px';
        }
    })
    modalBody.innerHTML = ''
    modalTitle.innerHTML = ''
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://races-bot-api.solvintech.ru/api/cordiant/question/random', true);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send();

    xhr.onload = function () {
        if (xhr.status != 200) { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
            console.log(`Ошибка ${xhr.status}: ${xhr.statusText}`);
        } else {
            let response = JSON.parse(xhr.response);
            modalTitle.innerHTML = response.data.title;
            modalBody.innerHTML = response.data.questions.map(item => {
                return `<div class="option-item" data-correct="${item.correct}">
                ${item.text}
            </div>`
            }).join('');

            document.querySelectorAll('.option-item').forEach((optionItem) => {
                optionItem.onclick = (event) => {
                    if (event.currentTarget.dataset.correct == 1)
                    {
                        hideOfficer();
                        closeQuestionModal();
                        document.querySelector('.modal-overlay.officer-stopped').classList.remove('--show')
                        document.querySelector('.modal-overlay.officer-success').classList.add('--show')
                        setTimeout(() => {
                            document.querySelector('.modal-overlay.officer-success').classList.remove('--show')
                            settings.start = true;
                            audio.play();
                            requestAnimationFrame(playGame);
                            startTimeoutOfficer();
                            setTimeout(() => {
                                // speedSum += speedSumInc;

                                settings.speed = settings.speed + 2;
                                if (settings.mode == 'winter_drive' || settings.mode == 'trucks') {
                                    speedSum = settings.speed / 2;
                                }
                            }, 1500);
                        }, 4000);

                    } else {
                        closeQuestionModal();
                        audio.currentTime = 0;
                        audio.autoplay = false;
                        settings.speed = 6
                        pointsValue.innerHTML = settings.score;
                        clearOfficerTimeOut();
                        hideOfficer();
                        speedSum = settings.mode == 'winter_drive' || settings.mode == 'trucks'  ? settings.speed / 2 : settings.speed
                        puddleSpeedSum = settings.speed;

                        savePoints({
                            mode: settings.mode,
                            score: settings.score
                        });

                        document.querySelector('.modal-overlay.officer-stopped').classList.remove('--show')
                        document.querySelector('.modal-overlay.officer-error').classList.add('--show')
                        setTimeout(() => {
                            document.querySelector('.modal-overlay.officer-error').classList.remove('--show')
                            game.innerHTML = '';
                            boomAudio.pause();
                            boomAudio.currentTime = 0;
                            screenResult.classList.remove('screen_hide');
                            screenStart.classList.add('screen_hide');
                            screenGame.classList.add('screen_hide');
                            againBtn.classList.add(settings.mode);
                            screenGame.classList.remove('screen-up')
                            score.classList.add('hide');
                        }, 4000);
                    }
                }
            });

        }
    };
}


function closeQuestionModal()
{
    document.querySelector('.modal-overlay.question').classList.remove('--show')
}





function savePoints(data) {
    const urlParams = new URLSearchParams(window.location.search);
    let user_id = urlParams.get('user_id')

    if (user_id == null) return;

    let formatted_mode = data.mode;

    switch(formatted_mode) {
        case 'winter_drive':
            formatted_mode = 'winter_drive_2'
            break;
        case 'cars_drive':
            formatted_mode = 'business_ca_2'
            break;
        case 'snow_cross':
            formatted_mode = 'snow_cross_2'
            break;
        case 'trucks':
            formatted_mode = 'professional_dr_1'
            break;
    }

    let formData = JSON.stringify({
        user_id: user_id,
        count: data.score,
        mode: formatted_mode
    });

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://races-bot-api.solvintech.ru/api/cordiant/addPoints', true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send(formData);
}


document.addEventListener('touchstart', swipeStart);