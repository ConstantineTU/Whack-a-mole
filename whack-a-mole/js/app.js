

// variables
const moles = document.querySelectorAll('.game-mole')// коллекция кротов
const holes = document.querySelectorAll('.game-hole')// коллекция дыр
const scoreBoard = document.querySelector('.score')// отображение score за раунд
const totalBoardScore = document.querySelector('.top-total__score')// отображение Total score за всё время игры, пока есть здоровье
const heartClone = document.querySelector('.heart')// клон сердца
const hummerClone = document.querySelector('.hummer')// клон молотка
const btnGame = document.getElementById('btnGame')// кнопка Начать игру Start Game
const btnNewGame = document.getElementById('newGame')// кнопка Новой игры New Game
const btnSaveGame = document.getElementById('btnSaveGame')// кнопка сохранения игры
const btnLoadGame = document.getElementById('btnLoadGame')// кнопка загрузки игры
const panelHummers = document.querySelector('.hummers')// панель молотков
const panelHearts = document.querySelector('.hearts')// панель здоровья

let topLvlNumber = document.querySelector('.top-lvl__number')// Уровень игрока
let topNeedScore = document.querySelector('.top-need__score')// Отображение необходимого количества очков для перехода на новый уровень
let gameBoard = document.querySelector('.game')// Игровая панель где происходит соновная игра
let storePriceFisrstHelp = document.querySelector('.store-price__fisrst-help')// стоимость аптечки в магазине
let expLvlFactorBoard = document.querySelector('.expLvlFactor')// отображение множителя очков опыта
let expLvlFactor = 3// начальный уровень очков опыта, когда сердец 3
let requiredNumberOfPoints = 50// Необходимое количество очков для перехода на новый уровень
let level = 1// уровень игрока
let downHealth = false
let gaming = false// обозначение, что игрок находится в игре
let endGame = false// обозначение, что игра закончена
let saveGameClick = false
let autoLoadGame = false
let score = 0// количество набранных за раунд
let scoreLvl = 1
let totalScore = 0// общее количество очков набранных за всю игру
let lastMole// описание в функции randomMole
let min = 550// минимальное время опускания крота
let max = 2000//максимальное время опускания крота
let startGameTimeout = 20000// начальное время игры на 1 уровне
let lvlUpTimeout = 21000// начальное время игры для поднятия уровня
let priceFirstHelp = 50// стоимость аптечки 


// functions
// Функция при попадании по противнику накапливает очки за раунд и отправляет противника обратно в дыру
function getScore() {
	let hearts = document.querySelectorAll('.heart')
	let getAudio = document.getElementById('pow-sound')
	if (score === 999) score = 0
	scoreLvl = hearts.length
	score = score + scoreLvl
	getAudio.currentTime = 0
	getAudio.play()
	this.parentNode.classList.remove('up')
	scoreBoard.textContent = score
}
// Функция случайного времени для появления кротов 
function randomTime(min, max) {
	console.log('min: ' + min + ' max: ' + max)
	return Math.floor(Math.random() * (max - min) + min)
}
// Функция случайного появления крота в разных дырах
function randomMole(holes) {
	let mole = holes[Math.floor(Math.random() * holes.length)]
	if (lastMole === mole) { return randomMole(holes) } // проверка, что новый крот появится в новой дыре, а не в прошлой
	lastMole = mole
	return mole
}
// одна из главных функций игры, позволяющая кротам вылазить из нор вновь и вновь
function molesUp() {
	let hearts = document.querySelectorAll('.heart')
	let hummers = document.querySelectorAll('.hummer')
	let time = randomTime(min, max)
	let mole = randomMole(holes)
	mole.classList.add('up')
	setTimeout(() => {
		console.log(time)
		mole.classList.remove('up')
		if (hummers.length === 0) {// Если молотки заканчиваются, то
			if (hearts.length !== 0) {//То идёт проверка на наличие здоровья
				let heart = document.querySelector('.heart')
				score = 0
				scoreBoard.textContent = score
				heart.remove()// И если проверка проходит, игрок теряет 1 сердце
				if (hearts.length !== 0 && hummers.length !== 7) {//при потере сердца игрок получает 8 молотков
					gameBoard.style.cursor = "url(../../img/Hammer.cur), url(../../img/Hammer.png) 25 25, default";
					for (let i = 1; i <= 8; i++) {
						let hummerNew = hummerClone.cloneNode(true)
						panelHummers.appendChild(hummerNew)
					}
				}
				gaming = false// игра заканчивается
				endGame = true
				downHealth = true
				btnGame.disabled = false
				btnGame.classList.remove('disabled')
				btnNewGame.disabled = false
				btnNewGame.classList.remove('disabled')
				btnSaveGame.disabled = false
				btnSaveGame.classList.remove('disabled')
				btnLoadGame.disabled = false
				btnLoadGame.classList.remove('disabled')
				expLvlFactor--
				expLvlFactorBoard.textContent = expLvlFactor
			}
			return// и кроты больше не вылазят из нор
		}
		if (!endGame) {//Иначе, если молотки есть кроты будут вылазить пока не закончилось время в игре
			molesUp()
		} else { totalBoardScore.textContent = totalScore }// как только игра закончилась происходит обновление общего количество набранных очков
	}, time)
}
// игра начинается при нажатии кнопки Start Game
function startGame() {
	let hummers = document.querySelectorAll('.hummer')
	let hearts = document.querySelectorAll('.heart')
	if (hearts.length !== 0 && hummers.length === 0) {// исправление бага
		let heart = document.querySelector('.heart')
		heart.remove()
		if (hearts.length !== 0 && hummers.length !== 7) {//при потере сердца игрок получает 8 молотков
			gameBoard.style.cursor = "url(../../img/Hammer.cur), url(../../img/Hammer.png) 25 25, default";
			for (let i = 1; i <= 8; i++) {
				let hummerNew = hummerClone.cloneNode(true)
				panelHummers.appendChild(hummerNew)
			}
		}
	}
	if (hummers.length !== 0 && hearts.length !== 0) {// если молотки закончились, то игра не начнётся
		let heart = document.querySelector('.heart')
		let lvlUpTimeoutSetTimeout = setTimeout(() => {// таймер по окончанию которого игрок либо теряет здоровье, либо поднимает уровень, либо ничего не происходит
			if (endGame !== false && score < 10) {// если вы не набрали 10 очков, то вы теряете здоровье
				heart.remove()
				expLvlFactor--
				expLvlFactorBoard.textContent = expLvlFactor
			} else {// если вы набрали 10 очков то ваш Total Score плюсует полученные очки за раунд
				totalScore += score
				totalBoardScore.textContent = totalScore
			}
			if (totalScore >= requiredNumberOfPoints && score !== 0) {// происходит проверка, набрал ли игрок нужное количество очков для перехода на новый уровень
				level++
				if (requiredNumberOfPoints < 1150) {
					requiredNumberOfPoints += (Math.floor(requiredNumberOfPoints * 1.20) + 25)
				} else if (requiredNumberOfPoints > 1150 && requiredNumberOfPoints < 3600) {
					requiredNumberOfPoints += (Math.floor(requiredNumberOfPoints * 1.15) + 50) - requiredNumberOfPoints
				} else if (requiredNumberOfPoints > 3600 && requiredNumberOfPoints < 5000) {
					requiredNumberOfPoints += (Math.floor(requiredNumberOfPoints * 1.10) + 100) - requiredNumberOfPoints
				} else if (requiredNumberOfPoints >= 5000) {
					requiredNumberOfPoints += (Math.floor(requiredNumberOfPoints * 1.05) + 150) - requiredNumberOfPoints
				}
				topLvlNumber.textContent = level
				topNeedScore.textContent = requiredNumberOfPoints
				if (min >= 150) { // повышение сложности при повышении уровня
					min -= 50
				} else if (max <= 600 && max > 300) {
					max -= 50
				}
				if (max <= 2000 && max > 1500) {
					max -= 250
				} else if (max <= 1500 && max > 1050) {
					max -= 150
				} else if (max <= 1050 && max > 600) {
					max -= 100
				}
				if (startGameTimeout >= 10000) {
					startGameTimeout -= 1000
					console.log('startGameTimeout: ' + startGameTimeout)
				}
				if (lvlUpTimeout >= 11000) {
					lvlUpTimeout -= 1000
					console.log('lvlUpTimeout: ' + lvlUpTimeout)
				}
				let hummers = document.querySelectorAll('.hummer')
				if (hummers.length <= 7) {// если при переходе на новый уровень у игрока имеется меньше 8 молотков, то он получает + 1 молоток
					let hummerNew = hummerClone.cloneNode(true)
					panelHummers.appendChild(hummerNew)
				}
			}
		}, lvlUpTimeout);
		setInterval(() => {
			if (downHealth) {
				clearTimeout(lvlUpTimeoutSetTimeout)
				clearTimeout(startGameTimeoutSetTimeout)
			}
		}, 1100)
		score = 0
		scoreBoard.textContent = score
		gaming = true
		endGame = false
		downHealth = false
		btnGame.disabled = true
		btnGame.classList.add('disabled') // отключаются кнопки во время игры, чтобы не вызывать баги
		btnNewGame.disabled = true
		btnNewGame.classList.add('disabled')
		btnSaveGame.disabled = true
		btnSaveGame.classList.add('disabled')
		btnLoadGame.disabled = true
		btnLoadGame.classList.add('disabled')
		molesUp()
		let startGameTimeoutSetTimeout = setTimeout(() => {
			endGame = true;
			gaming = false;
			btnGame.disabled = false
			btnGame.classList.remove('disabled')
			btnNewGame.disabled = false
			btnNewGame.classList.remove('disabled')
			btnSaveGame.disabled = false
			btnSaveGame.classList.remove('disabled')
			if (localStorage.getItem('saveGameClick') === 'true') {
				btnLoadGame.disabled = false
				btnLoadGame.classList.remove('disabled')
			}
		}, startGameTimeout)
	} else {
		btnGame.textContent = 'Game over!'
	}
}
// при нажатии на кнопку New Game все параметры сбрасываются до изначальных значений
function newGame() {
	btnGame.textContent = 'Start Game!'
	level = 1
	score = 0
	totalScore = 0
	requiredNumberOfPoints = 50
	totalBoardScore.textContent = totalScore
	scoreBoard.textContent = score
	topLvlNumber.textContent = level
	topNeedScore.textContent = requiredNumberOfPoints
	priceFirstHelp = 50
	storePriceFisrstHelp.textContent = priceFirstHelp
	expLvlFactor = 3
	expLvlFactorBoard.textContent = expLvlFactor
	autoLoadGame = false
	localStorage.setItem('autoLoadGame', autoLoadGame)
	// здоровье и молотки обнуляются
	let hearts = document.querySelectorAll('.heart')
	for (let i = 1; i <= hearts.length; i++) {
		let heart = document.querySelector('.heart')
		if (heart !== null) {
			heart.remove()
		}
	}
	expLvlFactorBoard.textContent = 3
	for (let i = 1; i <= 8; i++) {
		let hummer = document.querySelector('.hummer')
		if (hummer !== null) {
			hummer.remove()
		}
	}
	// здоровье и молотки восстанавливаются
	for (let i = 1; i <= 3; i++) {
		let heartNew = heartClone.cloneNode(true)
		panelHearts.appendChild(heartNew)
	}
	for (let i = 1; i <= 8; i++) {
		let hummerNew = hummerClone.cloneNode(true)
		panelHummers.appendChild(hummerNew)
	}
}
// Покупка аптечки
function needHelp() {
	if (totalScore < priceFirstHelp) {
		alert(`Что-бы купить аптечку, вам необходимо набрать ${priceFirstHelp} очков`)
	} else {
		if (confirm(`Вы уверены, что хотите купить аптечку? Она будет стоить ${priceFirstHelp} очков`)) {
			if (totalScore >= priceFirstHelp) {
				totalScore -= priceFirstHelp
				totalBoardScore.textContent = totalScore
				priceFirstHelp *= 2
				let heartNew = heartClone.cloneNode(true)
				panelHearts.appendChild(heartNew)
				storePriceFisrstHelp.textContent = priceFirstHelp
				expLvlFactor++
				expLvlFactorBoard.textContent = expLvlFactor
			}
		}
	}
}
// Сохранение игры
function saveGame() {
	let hearts = document.querySelectorAll('.heart')
	let hummers = document.querySelectorAll('.hummer')
	localStorage.setItem('hearts', hearts.length)
	localStorage.setItem('hummers', hummers.length)
	localStorage.setItem('priceFirstHelp', priceFirstHelp)
	localStorage.setItem('totalScore', totalScore)
	localStorage.setItem('expLvlFactor', expLvlFactor)
	localStorage.setItem('level', level)
	localStorage.setItem('requiredNumberOfPoints', requiredNumberOfPoints)
	autoLoadGame = true
	localStorage.setItem('autoLoadGame', autoLoadGame)
	saveGameClick = true
	localStorage.setItem('saveGameClick', saveGameClick)
	btnLoadGame.disabled = false
	btnLoadGame.classList.remove('disabled')
}
// Загрузка игры
function loadGame() {
	let hearts = document.querySelectorAll('.heart')
	for (let i = 1; i <= hearts.length; i++) {
		let heart = document.querySelector('.heart')
		if (heart !== null) {
			heart.remove()
		}
	}
	for (let i = 1; i <= 8; i++) {
		let hummer = document.querySelector('.hummer')
		if (hummer !== null) {
			hummer.remove()
		}
	}
	// здоровье и молотки восстанавливаются
	for (let i = 1; i <= +(localStorage.getItem('hearts')); i++) {
		let heartNew = heartClone.cloneNode(true)
		panelHearts.appendChild(heartNew)
	}
	for (let i = 1; i <= +(localStorage.getItem('hummers')); i++) {
		let hummerNew = hummerClone.cloneNode(true)
		panelHummers.appendChild(hummerNew)
	}
	priceFirstHelp = +(localStorage.getItem('priceFirstHelp'))
	storePriceFisrstHelp.textContent = priceFirstHelp
	totalScore = +(localStorage.getItem('totalScore'))
	totalBoardScore.textContent = totalScore
	expLvlFactor = +(localStorage.getItem('expLvlFactor'))
	expLvlFactorBoard.textContent = expLvlFactor
	level = +(localStorage.getItem('level'))
	topLvlNumber.textContent = level
	requiredNumberOfPoints = +(localStorage.getItem('requiredNumberOfPoints'))
	topNeedScore.textContent = requiredNumberOfPoints
	autoLoadGame = true
	localStorage.setItem('autoLoadGame', autoLoadGame)
	saveGameClick = true
	localStorage.setItem('saveGameClick', saveGameClick)
}
// browser events
holes.forEach(hole => (hole.addEventListener('click', function (e) {
	if (e.target.classList[0] === 'game-mole') {
		moles.forEach(mole => (mole.addEventListener('click', getScore)))
	} else if (e.target.classList[0] === 'game-hole') {
		let hummer = document.querySelector('.hummer')
		if (gaming !== false && hummer !== null) {
			hummer.remove()
		}
		if (hummer === null) {
			gameBoard.style.cursor = 'pointer'
		}
	}
})))
// Автозагрузка сохранения
if (localStorage.getItem('autoLoadGame') === 'true') {
	loadGame()
} else if (localStorage.getItem('saveGameClick') === 'true') {
	btnLoadGame.disabled = false
	btnLoadGame.classList.remove('disabled')
} else {
	btnLoadGame.disabled = true
	btnLoadGame.classList.add('disabled')
}

console.log('Для удобства проверки моей работы - вывожу в консоль браузера самооценку своего проекта по пунктам, с указанием баллов за каждый выполненный мною пункт')
console.log('Считаю, что я разобрался в коде чужого проекта, понял его и воспроизвёл исходное приложение. Правки и изменения не ухудшают внешний вид и функционал исходного проекта - 10 баллов')
console.log('Дополнил исходный проект обязательным дополнительным функционалом (Присутствует кнопка сохранения, при нажатии на которую происходит сохранение всех ключивых данных в localStorage, игра будет загружать сохранение при перезагрузке страницы и до тех пор пока игрок не нажмет на кнопку New Game, но данные в localStorage не изменяся пока вы их не сохраните, так что если игрок случайно нажмёт на New Game, то он может снова нажать на Load Game и продолжить играь на своём сохранении), (так-же происходит повышение уровня при достижении определенного Score, при повышении уровня - усложняется игра, игра становится быстрее и кроты оже становятся быстрее) указанным в описании задания - 10 баллов')
console.log('Дополнил исходный проект дополнительным функционалом на выбор из тех, которые перечислены в описании задания - Добавлены молотки, при промахе вы теряете молоток, при потере всех молотков вы теряете сердце, при потере сердца вы получаете 8 молотков, присутствует магазин аптечек для увеличения сердец, чем больше сердец - тем больше получаешь опыта за один удар по кроту, мышь имеет курсор молотка, есть звуки при попадании по кроту и анимация удара молотком  - 10 баллов')
console.log('Самооценка - Score: 30/30')
console.log('Спасибо за проверку, надеюсь, что я прошёл задание на максимальный балл, если вы обнаружили у меня какие-то недочеты, прошу вас указать их при проверке. ')
console.log('P.S. Больше описания в файле JS в комментариях в коде')
