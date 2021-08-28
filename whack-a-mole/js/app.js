// variables
const moles = document.querySelectorAll('.game-mole')
const holes = document.querySelectorAll('.game-hole')
const scoreBoard = document.querySelector('.score')
let endGame = false
let score = 0
let lastMole

// functions
function getScore() {
	score++
	this.parentNode.classList.remove('up')
	scoreBoard.textContent = score
}

function randomTime(min, max) {
	return Math.floor(Math.random() * (max - min) + min)
}

function randomMole(holes) {
	let mole = holes[Math.floor(Math.random() * holes.length)]
	if (lastMole === mole) { return randomMole(holes) }
	lastMole = mole
	return mole

}
function molesUp() {
	let time = randomTime(250, 1000)
	let mole = randomMole(holes)
	mole.classList.add('up')
	setTimeout(() => {
		console.log(time)
		mole.classList.remove('up')
		if (!endGame) molesUp()
	}, time)
}

function startGame() {
	score = 0
	scoreBoard.textContent = score
	endGame = false
	molesUp()
	setTimeout(() => endGame = true, 10000)
}

// browser events
moles.forEach(mole => (mole.addEventListener('click', getScore)))