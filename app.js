const startData = {
  canvas: document.getElementById("canvas"),
  startButton: document.getElementById("start"),
  stopButton: document.getElementById("stop"),
  scoreTag: document.getElementById("score")
};

class App {
  constructor(startData) {
    (this.canvas = startData.canvas),
    (this.startButton = startData.startButton),
    (this.stopButton = startData.stopButton),
    (this.scoreTag = startData.scoreTag),
    (this.score = 0),
    (this.arrayRects = []),
    (this.side = 30),
    (this.requestId = undefined),
    (this.startFlag = false),
    (this.counter = 0),
    (this.digitTriggering = 0),
    (this.arrayColors = [
      "red",
      "green",
      "gray",
      "brown",
      "violet",
      "tan",
      "teal",
      "SpringGreen",
      "SkyBlue",
      "Sienna",
      "red",
      "plum",
      "pink",
      "PaleVioletRed",
      "OrangeRed",
      "orange",
      "navy",
      "lime",
      "indigo",
      "gold",
      "cyan"
    ]);
  }
  //Ф. стоворює обєкт чотирикутник
  Rect(x, y, width, height, color, speed) {
    return {
      x,
      y,
      width,
      height,
      color,
      speed
    };
  }

  //Ф. створює довільне число від мін до макс
  randomDigit(max, min) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  //Ф. заповнює всі данні обєкта чотирикутник і створює його
  createRect() {
    let { side, canvas, arrayColors, Rect } = this;
    let rect, positionX, speedRect, colorRect;
    positionX = this.randomDigit(
      parseInt(canvas.clientWidth) - parseInt(side),
      0
    );
    speedRect = this.randomDigit(3, 1);
    colorRect = this.randomDigit(arrayColors.length, 0);
    rect = Rect(positionX, 0, side, side, arrayColors[colorRect], speedRect);
    this.arrayRects.push(rect);
  }

  //Ф. анімації падіння чотирикутників, довільного їх утворення а також 
  // зупинки ф. анімації.
  animate() {
    let { side, canvas, arrayRects } = this;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientWidth);

    arrayRects.forEach(el => {
      if (el.y >= canvas.clientHeight) {
        el.y = -side;
      } else {
        el.y = el.y + el.speed;
      }
      ctx.fillStyle = el.color;
      return ctx.fillRect(el.x, el.y, el.width, el.height);
    });
    if (this.startFlag) {
      if (this.counter === this.digitTriggering) {
        this.createRect();
        this.digitTriggering = this.counter + this.randomDigit(100, 1);
      }
      requestAnimationFrame(this.animate.bind(this));
      this.counter++;
    }
  }

  //Ф. запуск анімації
  start(loop) {
    if (!this.requestId) {
      this.requestId = window.requestAnimationFrame(loop);
    }
    this.startFlag = true;
  }

  //Ф. зупинки анімації
  stop() {
    if (this.requestId) {
      window.cancelAnimationFrame(this.requestId);
      this.requestId = undefined;
    }
    this.startFlag = false;
  }

  //Ф. створення обробників подій
  startGame() {
    //Подія кліку на кнопу Старт
    this.startButton.addEventListener("click", () => {
      if (!this.startFlag) {
        for (let i = 5; i >= 0; i--) {
          this.createRect();
        }
        this.start(this.animate.bind(this));
        this.score = 0;
        this.scoreTag.innerText = this.score;
      }
    });

    //Подія кліку на кнопку Стоп
    this.stopButton.addEventListener("click", () => {
      if (this.startFlag) {
        this.stop();
        this.arrayRects.length = 0;
      }
    });

    //Подія кліку на окремий чотирикуткик
    this.canvas.addEventListener("click", event => {
      let mouseX = event.offsetX;
      let mouseY = event.offsetY;
      let { arrayRects, side } = this;
      this.arrayRects = arrayRects.filter(el => {
        if (
          mouseX >= el.x &&
          mouseX <= el.x + side &&
          mouseY >= el.y &&
          mouseY <= el.y + side
        ) {
          this.score += 1;
          this.scoreTag.innerText = this.score;
        } else {
          return el;
        }
      });
    });
  }
}

const runGame = new App(startData);
document.body.onload = runGame.startGame.bind(runGame);