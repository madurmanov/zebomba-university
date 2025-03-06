(function () {
  const data = {
    rating: [
      {
        id: "123",
        name: "Владимир",
        lastName: "Ларионов",
        img: "./male.png",
        points: "463",
      },
      {
        id: "9",
        name: "Владимир",
        lastName: "Сергеев",
        img: "./male.png",
        points: "521",
      },
      {
        id: "231",
        name: "Вениамин",
        lastName: "Васильев",
        img: "./male.png",
        points: "865",
      },
      {
        id: "321",
        name: "Мария",
        lastName: "Логинова",
        img: "./female.png",
        points: "865",
      },
      {
        id: "492",
        name: "Борис",
        lastName: "Казанцев",
        img: "./male.png",
        points: "784",
      },
      {
        id: "452",
        name: "Полина",
        lastName: "Калинина",
        img: "./female.png",
        points: "225",
      },
      {
        id: "796",
        name: "Даниил",
        lastName: "Воробьёв",
        img: "./male.png",
        points: "642",
      },
      {
        id: "4",
        name: "Эрик",
        lastName: "Аксёнов",
        img: "./male.png",
        points: "150",
      },
      {
        id: "1155",
        name: "Иван",
        lastName: "Иванов",
        img: "./male.png",
        points: "100",
      },
      {
        id: "12145",
        name: "Артем",
        lastName: "Алексеев",
        img: "./male.png",
        points: "1000",
      },
    ],
    friends: [
      {
        id: "9",
        name: "Владимир",
        lastName: "Сергеев",
        img: "./male.png",
      },
      {
        id: "4",
        name: "Эрик",
        lastName: "Аксёнов",
        img: "./male.png",
      },
      {
        id: "15411",
        name: "Ирина",
        lastName: "Чеснокова",
        img: "./female.png",
      },
      {
        id: "15564",
        name: "Дарина",
        lastName: "Боброва",
        img: "./female.png",
      },
    ],
  };

  class Game {
    static CLASSES_GAME_LOADED = "Game_loaded";

    currentMove = 0;
    moves = [
      { x: 444, y: 507 },
      { x: 350, y: 476 },
      { x: 276, y: 519 },
      { x: 189, y: 538 },
      { x: 110, y: 510 },
      { x: 123, y: 446 },
    ];
    game = document.querySelector(".Game");
    map = this.game.querySelector(".Game-Map");
    canvas = this.game.querySelector(".Game-Canvas");
    context = this.canvas.getContext("2d");
    moveButton = this.game.querySelector(".Game-Button_move");
    ratingButton = this.game.querySelector(".Game-Button_rating");
    player = null;
    rating = null;

    constructor() {
      if (this.map.complete) {
        this.init();
      } else {
        this.map.addEventListener("load", () => {
          this.init();
        });
      }
    }

    init() {
      this.game.classList.add(Game.CLASSES_GAME_LOADED);
      this.player = new GamePlayer(this.context, this.moves[this.currentMove]);
      this.rating = new GameRating();
      new GameSlider();
      this.moveButton.addEventListener("click", () => this.movePlayer());
      this.ratingButton.addEventListener("click", () => this.rating.open());
    }

    movePlayer() {
      if (this.currentMove < this.moves.length - 1) {
        const oldMove = this.moves[this.currentMove];
        this.currentMove++;
        const newMove = this.moves[this.currentMove];

        this.player.move(oldMove, newMove);
      }
    }
  }

  class GamePlayer {
    static PLAYER_IMAGE = "./images/player.png";

    player = new Image();
    alpha = 0;

    constructor(context, initialCoordinates) {
      this.context = context;
      this.player.src = GamePlayer.PLAYER_IMAGE;

      this.player.onload = () => {
        this.fadeIn(initialCoordinates.x, initialCoordinates.y);
      };
    }

    draw(x, y) {
      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
      this.context.globalAlpha = this.alpha;

      const playerWidth = this.player.naturalWidth;
      const playerHeight = this.player.naturalHeight;

      this.context.drawImage(this.player, x - playerWidth / 2, y - playerHeight, playerWidth, playerHeight);
    }

    fadeIn(x, y) {
      let alpha = 0;

      const step = () => {
        if (alpha < 1) {
          alpha += 0.01;
          this.alpha = alpha;
          this.draw(x, y);
          requestAnimationFrame(step);
        } else {
          this.alpha = 1;
        }
      };

      step();
    }

    fadeOut(x, y, callback) {
      let alpha = 1;

      const step = () => {
        if (alpha > 0) {
          alpha -= 0.01;
          this.alpha = alpha;
          this.draw(x, y);
          requestAnimationFrame(step);
        } else {
          callback();
        }
      };

      step();
    }

    move(oldCoordinates, newCoordinates) {
      this.fadeOut(oldCoordinates.x, oldCoordinates.y, () => {
        this.fadeIn(newCoordinates.x, newCoordinates.y);
      });
    }
  }

  class GameSlider {
    static CLASSES_BUTTON_DISABLED = "Game-Slider-Button_disabled";

    slider = document.querySelector(".Game-Slider");
    list = this.slider.querySelector(".Game-Slider-List");
    prevButton = this.slider.querySelector(".Game-Slider-Button_prev");
    nextButton = this.slider.querySelector(".Game-Slider-Button_next");
    items = [];
    itemWidth = 0;
    visibleItems = 8;
    currentPosition = 0;

    constructor() {
      this.items = Array.from(this.list.querySelectorAll(".Game-Slider-List-Item"));
      this.itemWidth = this.items[0].offsetWidth + parseFloat(window.getComputedStyle(this.items[0]).marginRight) * 2;

      this.prevButton.addEventListener("click", () => {
        if (this.currentPosition > 0) {
          this.currentPosition--;
          this.updateSlider();
        }
      });

      this.nextButton.addEventListener("click", () => {
        if (this.currentPosition < this.items.length - this.visibleItems) {
          this.currentPosition++;
          this.updateSlider();
        }
      });

      this.updateSlider();
    }

    updateSlider() {
      const offset = -this.currentPosition * this.itemWidth;
      this.items[0].style.marginLeft = `${offset}px`;

      if (this.currentPosition === 0) {
        this.disableButton(this.prevButton);
      } else {
        this.enableButton(this.prevButton);
      }

      if (this.currentPosition >= this.items.length - this.visibleItems) {
        this.disableButton(this.nextButton);
      } else {
        this.enableButton(this.nextButton);
      }
    }

    disableButton(button) {
      button.disabled = true;
      button.classList.add(GameSlider.CLASSES_BUTTON_DISABLED);
    }

    enableButton(button) {
      button.disabled = false;
      button.classList.remove(GameSlider.CLASSES_BUTTON_DISABLED);
    }
  }

  class GameRating {
    static CLASSES_VISIBLE = "Game-Rating_visible";
    static CLASSES_ITEM = "Game-Rating-List-Item";
    static CLASSES_ITEM_FRIEND = "Game-Rating-List-Item_friend";
    static CLASSES_ITEM_INNER = "Game-Rating-List-Item-Inner";
    static CLASSES_ITEM_INNER_PLACE = "Game-Rating-List-Item-Inner_place";
    static CLASSES_ITEM_INNER_IMAGE = "Game-Rating-List-Item-Inner_image";
    static CLASSES_ITEM_INNER_NAME = "Game-Rating-List-Item-Inner_name";
    static CLASSES_ITEM_INNER_POINTS = "Game-Rating-List-Item-Inner_points";

    rating = document.querySelector(".Game-Rating");
    list = this.rating.querySelector(".Game-Rating-List");
    closeButton = this.rating.querySelector(".Game-Rating-Close");

    constructor() {
      this.init();
      this.closeButton.addEventListener("click", () => this.close());
    }

    init() {
      data.rating
        .sort((a, b) => a.id - b.id)
        .forEach((user) => {
          const item = document.createElement("li");
          item.classList.add(GameRating.CLASSES_ITEM);

          if (data.friends.some((friend) => friend.id === user.id)) {
            item.classList.add(GameRating.CLASSES_ITEM_FRIEND);
          }

          const itemPlace = document.createElement("span");
          itemPlace.classList.add(GameRating.CLASSES_ITEM_INNER, GameRating.CLASSES_ITEM_INNER_PLACE);
          itemPlace.innerHTML = user.id;
          item.appendChild(itemPlace);

          const itemImage = document.createElement("span");
          itemImage.classList.add(GameRating.CLASSES_ITEM_INNER, GameRating.CLASSES_ITEM_INNER_IMAGE);
          item.appendChild(itemImage);

          const itemName = document.createElement("span");
          itemName.classList.add(GameRating.CLASSES_ITEM_INNER, GameRating.CLASSES_ITEM_INNER_NAME);
          itemName.innerHTML = `${user.name} ${user.lastName}`;
          item.appendChild(itemName);

          const itemPoints = document.createElement("span");
          itemPoints.classList.add(GameRating.CLASSES_ITEM_INNER, GameRating.CLASSES_ITEM_INNER_POINTS);
          itemPoints.innerHTML = user.points;
          item.appendChild(itemPoints);

          this.list.appendChild(item);
        });
    }

    open() {
      this.rating.classList.add(GameRating.CLASSES_VISIBLE);
    }

    close() {
      this.rating.classList.remove(GameRating.CLASSES_VISIBLE);
    }
  }

  new Game();
})();
