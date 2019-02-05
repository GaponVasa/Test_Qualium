let options = {
  canvas: document.getElementById("canvas"),
  startButton: document.getElementById("start"),
  stopButton: document.getElementById("stop"),
  scoreTag: document.getElementById("score"),
  //Сторона квадрата в px
  side: 30,
  //Кількість квадратів при старті
  numberSquaresStartup: 5,
  //Значення максимальної швидкості
  maxSpeed: 3,
  //Значення мінімальної швидкості
  minSpeed: 1,
  arrayColors: [
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
  ]
};

class Rect {
  constructor(valueY, value) {
    this.x,
    (this.y = valueY),
    (this.width = value),
    (this.height = value),
    this.color,
    this.speed;
  }

  setUp(maxWidth, minWidth, maxSpeed, minSpeed, arrayColors) {
    this.setPositionX(maxWidth, minWidth);
    this.setCollor(arrayColors);
    this.setSpeed(maxSpeed, minSpeed);
  }

  setSpeed(maxValue, minValue) {
    this.speed = this.findRandomDigitInclude(maxValue, minValue);
  }

  setCollor(arrayColors) {
    let randomDigit = this.findRandomDigitInclude(arrayColors.length, 0);
    this.color = arrayColors[randomDigit];
  }

  setPositionX(maxValue, minValue) {
    this.x = this.findRandomDigit(maxValue, minValue);
  }

  findRandomDigit(max, min) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  findRandomDigitInclude(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

class App {
  constructor(options, constrRect) {
    //Масив квадратів, які відображаються на полі
    (this.arrayRects = []),
    //Посилання на метод запуску анімації
    (this.requestId = undefined),
    //Флаг для відслідковування події початку
    (this.startFlag = false),
    //Лічільник кількості запуску анімації
    (this.counter = 0),
    //Тригер необхідний для рандомного додавання квадратів
    (this.digitTriggering = 0),
    //Лічільник рахунку
    (this.score = 0),
    //Посилання на обєкт налаштування
    (this.options = options),
    //Посилання на конструктор квадратів
    (this.constrRect = constrRect);
  }

  randomDigit(max, min) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  createRect() {
    let rect;
    let { arrayColors, side, maxSpeed, minSpeed } = this.options;
    rect = new this.constrRect(0, side);
    rect.setUp(
      canvas.clientWidth - side,
      0,
      maxSpeed,
      minSpeed,
      arrayColors
    );
    this.arrayRects.push(rect);
  }

  //Ф. анімації падіння чотирикутників, довільного їх утворення а також
  // зупинки ф. анімації.
  animate() {
    let { arrayRects } = this;
    let { canvas, side } = this.options;
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
      this.counter++;
      requestAnimationFrame(() => this.animate());
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
    let {
      numberSquaresStartup,
      startButton,
      stopButton,
      canvas,
      side
    } = this.options;
    canvas.width = window.innerWidth - side;
    canvas.height = window.innerHeight - side - 40;

    //Подія кліку на кнопу Старт
    startButton.addEventListener("click", () => {
      if (!this.startFlag) {
        for (let i = numberSquaresStartup; i > 0; i--) {
          this.createRect();
        }
        this.start(() => this.animate());
        this.score = 0;
        this.options.scoreTag.innerText = this.score;
      }
    });

    //Подія кліку на кнопку Стоп
    stopButton.addEventListener("click", () => {
      if (this.startFlag) {
        this.stop();
        this.arrayRects.length = 0;
      }
    });

    //Подія кліку на окремий чотирикуткик
    canvas.addEventListener("click", event => {
      let mouseX = event.offsetX;
      let mouseY = event.offsetY;
      let { arrayRects } = this;
      let { side } = this.options;
      this.arrayRects = arrayRects.filter(el => {
        if (
          mouseX >= el.x &&
          mouseX <= el.x + side &&
          mouseY >= el.y &&
          mouseY <= el.y + side
        ) {
          this.score += 1;
          this.options.scoreTag.innerText = this.score;
        } else {
          return el;
        }
      });
    });
  }
}

const runGame = new App(options, Rect);
runGame.startGame();
