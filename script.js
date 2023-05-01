window.addEventListener("load", () => maze.init(7, 7));

const maze = {
  init(w, h) {
    this.divs = [];
    let self = this;
    this.width = w;
    this.height = h;
    fetch(
      "https://www2.hs-esslingen.de/~melcher/internet-technologien/maze/?request=generate&userid=mefait00&width=" +
        this.width +
        "&height=" +
        this.height
    )
      .then((response) => response.json())
      .then((data) => {
        if (data["status"] == "ok") {
          self.current = [data["playerX"], data["playerY"]];
          self.token = data["token"];
          self.build();
        } else {
          alert("Something went wrong!");
        }
      })
      .catch((error) => console.error(error));
  },

  build() {
    const body = document.body;
    body.innerHTML = "";
    const header = this.generateHeader("Maze", "By Metin Fakili");
    const main = this.generateMain();
    const footer = this.generateFooter("&copy by Metin Fakili");
    body.appendChild(header);
    body.appendChild(main);
    body.appendChild(footer);
  },

  generateHeader(title, subtitle) {
    const header = document.createElement("header");
    const divLimiter = this.elementWithClassses("div", "header limiter");

    const h1Title = document.createElement("h1");
    h1Title.innerText = title;

    const h2Subtitle = document.createElement("h2");
    h2Subtitle.innerText = subtitle;

    divLimiter.appendChild(h1Title);
    divLimiter.appendChild(h2Subtitle);
    header.appendChild(divLimiter);
    return header;
  },
  makeFieldset(title) {
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");

    legend.innerText = title;
    fieldset.appendChild(legend);
    return fieldset;
  },

  generateField(width, height) {
    const newField = this.elementWithClassses("div", "field");
    for (row = 0; row < height; row++) {
      newField.appendChild(this.generateRow(row, width));
    }
    return newField;
  },

  generateRow(rowIndex, width) {
    const row = this.elementWithClassses("div", "row");
    for (colum = 0; colum < width; colum++) {
      row.appendChild(this.generateCell(rowIndex, colum));
    }
    return row;
  },

  generateCell(row, colum) {
    const divSquareHolder = this.elementWithClassses("div", "square-holder");
    const divSquareSizer = this.elementWithClassses("div", "square-sizer");
    const divSquareContent = this.elementWithClassses(
      "div",
      "square-content cell"
    );

    divSquareContent.dataset.x = colum;
    divSquareContent.dataset.y = row;

    divSquareHolder.appendChild(divSquareSizer);
    divSquareSizer.appendChild(divSquareContent);
    return divSquareHolder;
  },

  positionPlayer(x, y) {
    this.playerX = x;
    this.playerY = y;

    const playerCell = document.querySelector(
      '[data-x="' + x + '"][data-y="' + y + '"]'
    );
    playerCell.classList.remove("cell");
    playerCell.classList.add("way");

    const oldPlayer = document.querySelector(".square-content.playersymbol");
    if (oldPlayer) {
      oldPlayer.classList.remove("playersymbol");
    }
    if (this.maze.maze[y][x] == "1") {
      playerCell.classList.add("target");
    } else playerCell.classList.add("playersymbol");
  },

  elementWithClassses(elemenType, classNames) {
    const element = document.createElement(elemenType);
    for (let className of classNames.split(" ")) {
      element.classList.add(className);
    }
    return element;
  },

  width: 7,
  height: 7,
  current: [1, 1],
  divs: [],
  directions: [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ],
  token: "",

  generateMain() {
    let self = this;

    const main = document.createElement("main");
    const divMainLimiter = this.elementWithClassses("div", "limiter");
    main.appendChild(divMainLimiter);
    const divMain = this.elementWithClassses("div", "main");
    divMainLimiter.appendChild(divMain);

    const fieldset = this.makeFieldset("Maze");
    divMain.appendChild(fieldset);

    const field = this.elementWithClassses("div", "field");
    fieldset.appendChild(field);
    for (let y = 0; y < this.width; y++) {
      const divRow = this.elementWithClassses("div", "row");
      field.appendChild(divRow);
      let accessRow = [];
      for (let x = 0; x < this.height; x++) {
        const squareHolder = this.elementWithClassses("div", "square-holder");
        squareHolder.style.width = "calc(100% / " + this.width + ".0)";
        divRow.appendChild(squareHolder);
        const squareSizer = this.elementWithClassses("div", "square-sizer");
        squareHolder.appendChild(squareSizer);
        const cellSquareContent = this.elementWithClassses(
          "div",
          "cell square-content"
        );
        squareSizer.appendChild(cellSquareContent);
        accessRow.push(cellSquareContent);
      }
      this.divs.push(accessRow);
    }
    this.divs[this.current[1]][this.current[0]].classList.add("playersymbol");
    this.divs[this.current[1]][this.current[0]].classList.add("way");

    // Buttons for the game difficulty
    field.appendChild(this.generateSizeBar());

    // Controll
    const fieldsetControll = this.makeFieldset("Controls");
    divMain.appendChild(fieldsetControll);

    const divControllHolder = this.elementWithClassses(
      "div",
      "controll-holder"
    );
    fieldsetControll.appendChild(this.generateControl());

    const divSquareHolder = this.elementWithClassses("div", "square-holder");
    divControllHolder.appendChild(divSquareHolder);

    const divSquareSizer = this.elementWithClassses("div", "square-sizer");
    divSquareHolder.appendChild(divSquareSizer);

    const divControllContent = this.elementWithClassses(
      "div",
      "controll-content"
    );
    divSquareSizer.appendChild(divControllContent);

    const squareContent = this.elementWithClassses("div", "square-content");
    divControllContent.appendChild(squareContent);

    const fieldsetCommunication = this.makeFieldset("Communication");
    fieldsetControll.appendChild(fieldsetCommunication);

    return main;
  },

  generateSizeBar() {
    let self = this;
    let divSizeBar = this.elementWithClassses("div", "size-bar");
    const smallButton = this.generateButton("Small", "btn-small");
    const mediumButton = this.generateButton("Medium", "btn-medium");
    const largeButton = this.generateButton("Large", "btn-large");

    smallButton.addEventListener("click", () => {
      self.init(7, 7);
    });
    mediumButton.addEventListener("click", () => {
      self.init(13, 13);
    });
    largeButton.addEventListener("click", () => {
      self.init(25, 25);
    });
    divSizeBar.appendChild(smallButton);
    divSizeBar.appendChild(mediumButton);
    divSizeBar.appendChild(largeButton);

    return divSizeBar;
  },
  generateButton(text, id) {
    const button = document.createElement("button");
    button.type = "type";
    button.innerHTML = text;
    if (id == undefined) false;
    button.id = id;
    return button;
  },

  makeFieldset(title) {
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");

    legend.innerText = title;
    fieldset.appendChild(legend);
    return fieldset;
  },
  mazeMove(dx, dy, callback) {
    let self = this;
    fetch(
      "https://www2.hs-esslingen.de/~melcher/internet-technologien/maze/?request=move&token=" +
        this.token +
        "&dx=" +
        dx +
        "&dy=" +
        dy
    )
      .then((response) => response.json())
      .then((data) => {
        let res;
        let c = data["code"]["cell"];
        console.log(data);
        if (c == 0) {
          self.divs[self.current[1]][self.current[0]].classList.remove(
            "playersymbol"
          );
          self.current[0] += dx;
          self.current[1] += dy;
          self.divs[self.current[1]][self.current[0]].classList.add(
            "playersymbol"
          );
          self.divs[self.current[1]][self.current[0]].classList.add("way");
          res = "possible";
        } else if (c == 1) {
          self.divs[self.current[1]][self.current[0]].classList.remove(
            "playersymbol"
          );
          self.current[0] += dx;
          self.current[1] += dy;
          self.divs[self.current[1]][self.current[0]].classList.add(
            "playersymbol"
          );
          self.divs[self.current[1]][self.current[0]].classList.add("way");
          self.divs[self.current[1]][self.current[0]].classList.add("target");
          setTimeout(() => {
            alert("You won!");
            window.location.reload();
          }, 20);
          res = "won";
        } else {
          self.divs[self.current[1] + dy][
            self.current[0] + dx
          ].style.backgroundColor = "#fb8500";
        }
        if (callback) callback(res);
      })
      .catch((err) => {
        console.log("Something went wrong");
      });
  },

  autoSolve() {
    let movement = [];
    let checkpoints = [];
    for (let i = 0; i < this.directions.length; i++) {
      movement.push(this.directions[i]);
      checkpoints.push(false);
    }
    let self = this;
    function moving() {
      setTimeout(() => {
        let coordinate = movement.shift();
        let check = checkpoints.shift();
        self.mazeMove(coordinate[0], coordinate[1], (stat) => {
          if (!check) {
            if (stat == "possible") {
              movement.unshift([-coordinate[0], -coordinate[1]]);
              checkpoints.unshift(true);
              for (let i = 0; i < self.directions.length; i++) {
                let p = self.directions[i];
                if (p[0] != -coordinate[0] || p[1] != -coordinate[1]) {
                  movement.unshift(p);
                  checkpoints.unshift(false);
                }
              }
            }
          }
          if (movement.length > 0) {
            moving();
          }
        });
      }, 2);
    }
    moving();
  },

  generateFooter(title) {
    const footer = document.createElement("footer");
    const divLimiter = this.elementWithClassses("div", "footer limiter");

    divLimiter.innerHTML = title;
    footer.appendChild(divLimiter);
    return footer;
  },

  generateControlsFieldset() {
    const fieldset = this.makeFieldset("Controls");
    const controls = this.generateControl();
    fieldset.appendChild(controls);
    const divControllHolder = this.elementWithClassses(
      "div",
      "controll-holder"
    );
    fieldset.appendChild(divControllHolder);

    const fieldsetCommunication = this.makeFieldset("Communication");
    paragraph = document.createElement("p");
    fieldsetCommunication.appendChild(paragraph);
    fieldset.appendChild(fieldsetCommunication);
    return fieldset;
  },

  generateControl() {
    const divControlls = this.elementWithClassses("div", "controll-holder");
    const divSquareHolder = this.elementWithClassses("div", "square-holder");
    const divSquareSizer = this.elementWithClassses("div", "square-sizer");
    const divControllContent = this.elementWithClassses(
      "div",
      "controll-content"
    );
    const divSquareContent = this.elementWithClassses("div", "square-content");

    counter = 0;
    for (row = 0; row < 3; row++) {
      for (colum = 0; colum < 3; colum++) {
        let number = colum + row + 1;
        if (number % 2 === 0) {
          divSquareContent.appendChild(this.generateArrow(counter));
          counter++;
        } else {
          if (row == 1 && colum == 1) {
            const playersymbolConstroll = this.generateSpacer(
              "direction-spacer playersymbol"
            );
            playersymbolConstroll.addEventListener("click", () => {
              this.autoSolve(0, 0);
            });
            divSquareContent.appendChild(playersymbolConstroll);
          } else
            divSquareContent.appendChild(
              this.generateSpacer("direction-spacer")
            );
        }
      }
    }
    divControllContent.appendChild(divSquareContent);
    divSquareSizer.appendChild(divControllContent);
    divSquareHolder.appendChild(divSquareSizer);
    divControlls.appendChild(divSquareHolder);
    return divControlls;
  },

  generateSpacer(className) {
    const divDirectionSpacer = this.elementWithClassses("div", className);
    return divDirectionSpacer;
  },

  generateArrow(number) {
    const array = [
      [" up", 0, -1],
      [" left", -1, 0],
      [" right", 1, 0],
      [" down", 0, 1],
    ];

    let classNames = "direction-arrow" + array[number][0];
    const divDirectionArrow = this.elementWithClassses("div", classNames);

    divDirectionArrow.addEventListener("click", () => {
      this.mazeMove(array[number][1], array[number][2]);
    });
    return divDirectionArrow;
  },
};
