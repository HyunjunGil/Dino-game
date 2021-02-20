class ScoreInfo {
  constructor (score) {
    this.score = score;
    this.time = new Date();
  }

}

const character = document.getElementById('character');
const block = document.getElementById('block');
const start = document.getElementById('startButton');
const blockWidth = [20, 30, 40, 50, 60];
const blockHeight = [20, 30, 40];
var counter = 0;
var onGame = false;
var rankers = new Map();
rankers.set(1, undefined);
rankers.set(2, undefined);
rankers.set(3, undefined);
rankers.set(4, undefined);
rankers.set(5, undefined);



function jump () {
  if (character.classList == 'animate' || !onGame ) return;
  character.classList.add('animate');
  setTimeout(function() {
    character.classList.remove('animate');
  }, 500);
}

function updateHighscore(score) {
  let result = new ScoreInfo(score);
    let i = 5;
    while (i > 0) {
      if (rankers.get(i) === undefined || rankers.get(i).score <= result.score) {
        i--;
      } else break;
    }
    i++;
    let j = 4;
    while (j >= i) {
      rankers.set(j+1, rankers.get(j));
      j--;
    }
    rankers.set(i, result);
    for(let i = 1; i < 6; i++) {
      if (rankers.get(i) === undefined) {
        break;
      }
      var rowEl = document.getElementById('row' + i);
      document.getElementById('row' + i).innerHTML =
        `<td>${i}</td><td>${rankers.get(i).score}</td><td>${rankers.get(i).time}</td>`
    }
}


function startGame () {
  if (onGame) return;
  onGame = true;
  const createRandomBlock = setInterval(() => {
    let w = blockWidth[Math.floor(Math.random() * 5)];
    let h = blockHeight[Math.floor(Math.random() * 3)];
    block.style.width = w + 'px';
    block.style.height = h + 'px';
    block.style.top = (150 - h) + 'px';
    block.style.animation = 'block 1s infinite linear';
  }, 1000);
  const checkDead = setInterval(() => {
    const characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    const blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    const w = parseInt(window.getComputedStyle(block).getPropertyValue("width"));
    const h = parseInt(window.getComputedStyle(block).getPropertyValue("height"));
    if ((characterTop >= 150 - h) && blockLeft > -w && blockLeft <= 20) {
      block.style.animation = 'none';
      score = Math.floor(counter/100);
      alert('Game Over. Score: ' + score);
      updateHighscore(score);
      onGame = false;
      counter = 0;
      document.getElementById('scoreSpan').innerHTML = 0;
      clearInterval(createRandomBlock);
      clearInterval(checkDead);
    } else {
      counter++;
      document.getElementById('scoreSpan').innerHTML = Math.floor(counter/100);
    }
  }, 10);
}

document.addEventListener('keydown', jump);
start.addEventListener('click', startGame);





