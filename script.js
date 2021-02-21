class ScoreInfo {
  constructor (score) {
    this.score = score;
    this.time = new Date();
  }

}

const character = document.getElementById('character');
const game = document.getElementById('game');
const ghost = document.getElementById('ghostBlock');
const start = document.getElementById('startButton');
const blockWidth = [20, 30, 40, 50, 60];
const blockHeight = [20, 30, 40];
const block_y = [0, 30, 60];
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
    var delay = Math.floor(Math.random() * 200);
    setTimeout(() => {
      var newBlock = document.createElement('div');
      newBlock.className = 'block';
      let w = blockWidth[Math.floor(Math.random() * 5)];
      let y = block_y[Math.floor(Math.random() * 3)];
      let h = (y === 0) ? blockHeight[Math.floor(Math.random() * 3)] : 20; 
      newBlock.style.width = w + 'px';
      newBlock.style.height = h + 'px';
      newBlock.style.top = (200 - h - y) + 'px';
      newBlock.style.animation = 'block 1s linear';
      game.insertBefore(newBlock, ghost);
      setTimeout(() => {
        newBlock.remove();
      }, 1000);
    }, delay);
  }, 800);
  const checkDead = setInterval(() => {
    var flag = true;
    const characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    const blocks = document.getElementsByClassName('block');
    //console.log(blocks);
    for(let i = 0; i < blocks.length; i++) {
      let blockLeft = parseInt(window.getComputedStyle(blocks[i]).getPropertyValue("left"));
      let blockTop = parseInt(window.getComputedStyle(blocks[i]).getPropertyValue("top"));
      let w = parseInt(window.getComputedStyle(blocks[i]).getPropertyValue("width"));
      let h = parseInt(window.getComputedStyle(blocks[i]).getPropertyValue("height"));
      // console.log(characterTop, blockLeft, blockTop, w, h);
      if (!(characterTop + 50 <= blockTop || characterTop >= blockTop + h) && blockLeft > -w && blockLeft <= 20) {
        flag = false;
        break;
      }
    }
    if (flag) {
      counter++;
      document.getElementById('scoreSpan').innerHTML = Math.floor(counter/100);
    } else {
      for(i = 0;i < blocks.length; i++) {
        blocks[i].remove();
      }
      score = Math.floor(counter/100);
      alert('Game Over. Score: ' + score);
      updateHighscore(score);
      onGame = false;
      counter = 0;
      document.getElementById('scoreSpan').innerHTML = 0;
      clearInterval(createRandomBlock);
      clearInterval(checkDead);
    }
  }, 10);
}

document.addEventListener('keydown', jump);
start.addEventListener('click', startGame);





