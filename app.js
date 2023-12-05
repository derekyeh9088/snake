//debug 1.HTML忘了連接js 2.setInterval中的function無須() 3.height
const canvas = document.getElementById("mycanvas");
const ctx = canvas.getContext("2d");
//getContect()會回傳一個會回傳一個drawing context
//drawing context可用來在canvas內部畫圖
const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;
//設定將蛇設定為一arr,內部放儲存位置的物件
let snake = [];
function createSnake() {
  snake[0] = { x: 80, y: 0 };
  snake[1] = { x: 60, y: 0 };
  snake[2] = { x: 40, y: 0 };
  snake[3] = { x: 20, y: 0 };
}

//製作果實
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }
  pickAlocation() {
    let new_x;
    let new_y;
    let notTheSame = false;
    function check(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x == new_x && snake[i].y == new_y) {
          notTheSame = true;
          return;
        } else {
          notTheSame = false;
        }
      }
    }
    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      check(new_x, new_y);
    } while (notTheSame);

    this.x = new_x;
    this.y = new_y;
  }
}
//初始設定
let myFruit = new Fruit();
createSnake();

let d = "Right";
//偵測間盤上下左右
window.addEventListener("keydown", changedirection);
//控制方向
function changedirection(e) {
  if ((e.key == "ArrowUp" || e.key == "w") && d != "Down") {
    d = "Up";
    // console.log("向上");
  } else if ((e.key == "ArrowDown" || e.key == "s") && d != "Up") {
    d = "Down";
    // console.log("向下");
  } else if ((e.key == "ArrowRight" || e.key == "d") && d != "Left") {
    d = "Right";
    // console.log("向右");
  } else if ((e.key == "ArrowLeft" || e.key == "a") && d != "Right") {
    d = "Left";
    // console.log("向左");
    //有可能出現大回轉的狀況，回過頭來咬自己
    window.removeEventListener("keydown", changedirection);
  }
}

let score = 0;
let highestscore;
loadHighestScore();
document.getElementById("myscore").innerHTML = "目前分數:" + score;
document.getElementById("myscore2").innerHTML = "最高分數:" + highestscore;

function draw() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      window.alert("GAME OVER");
    }
  }
  //避免蛇無限延伸,因此背景要隨著setinterval更新
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //劃出果實
  myFruit.drawFruit();
  //劃出一隻蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue"; //選擇顏色
    }
    ctx.strokeStyle = "white";
    //蛇的穿牆功能要寫在這
    if (snake[0].x >= canvas.width) {
      snake[0].x = 0;
    } else if (snake[0].x < 0) {
      snake[0].x = canvas.width - unit;
    } else if (snake[0].y < 0) {
      snake[0].y = canvas.height - unit;
    } else if (snake[0].y >= canvas.height) {
      snake[0].y = 0;
    }
    //匯出
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit); //給定四個參數(x,y,width,height)來劃出一個長方形
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }
  //這會讓我們的x,y座標超過範圍
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (d == "Right") {
    snakeX += unit;
  } else if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Down") {
    snakeY += unit;
  }
  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  //吃果實邏輯
  // 如果蛇沒有吃到果實,同時pop、unshift,讓他維持
  // 如果蛇有吃到果實,不用pop,unshift維持,讓他變長
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    //當蛇頭碰到果實了
    console.log("碰到果實了");
    ///更換座標,劃出新的fruit
    myFruit.pickAlocation();
    //更新分數
    score++;
    setHighestScore(score);
    document.getElementById("myscore").innerHTML = "目前分數:" + score;
    document.getElementById("myscore2").innerHTML = "最高分數:" + highestscore;
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
  window.addEventListener("keydown", changedirection);
}
//draw結束
//更新畫面
let myGame = setInterval(draw, 90);
//拿出最高分的函式
function loadHighestScore() {
  if (localStorage.getItem("highestscore") == null) {
    highestscore = 0;
  } else {
    highestscore = localStorage.getItem("highestscore");
  }
}
//當score>highestscore時,要讓highestscore = score
function setHighestScore(score) {
  if (score > highestscore) {
    localStorage.setItem("highestscore", score);
    highestscore = score;
  }
}

function rangeOfNumbers(startNum, endNum) {
  if (startNum > endNum) {
    return [];
  } else {
    const count = rangeOfNumbers(startNum, endNum - 1);
    count.push(endNum);
    return count;
  }
}
console.log(rangeOfNumbers(4, 4), rangeOfNumbers(1, 5), rangeOfNumbers(6, 9));
