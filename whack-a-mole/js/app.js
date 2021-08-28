const moles = document.querySelectorAll('.game-mole')
const holes = document.querySelectorAll('.game-hole')
let score = 0

function getScore(e) {
	console.log(e)
	let scoreBoard = document.querySelector('.score')
	score++
	scoreBoard.textContent = score
}

moles.forEach(mole => (mole.addEventListener('click', getScore)))
moles.forEach(mole => (mole.addEventListener('click', function () {
	for (hole of holes) {
		hole.classList.remove('up')
	}
})))

function randomMole() {
	console.log(holes[Math.floor(Math.random() * holes.length)])
	return holes[Math.floor(Math.random() * holes.length)].classList.add('up')

}

function startGame() {
	randomMole()
}