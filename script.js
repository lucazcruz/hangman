class Hangman {
  constructor() {
    this.hangmanImage = document.querySelector(".hangman img");
    this.themes = document.querySelectorAll(".theme");
    this.keyboard = document.querySelector("#keyboard");
    this.wordContainerElement = document.querySelector(".word-container");
    this.alertGameModal = document.querySelector("#alert-game");
    this.selectThemeModal = document.querySelector("#select-theme");
    this.startButton = document.querySelector(".start-game");

    this.handleKeyboard = this.handleKeyboard.bind(this);
    this.startGame = this.startGame.bind(this);
    this.handleStartgame = this.handleStartgame.bind(this);
  }

  win() {
    this.alertGameModal.innerText = "You win! :)";
    this.alertGameModal.classList.add("visible");
    this.keyboard.classList.remove("visible");
  }

  gameover() {
    this.alertGameModal.innerText = "You lose! :(";
    this.alertGameModal.classList.add("visible");
    this.keyboard.classList.remove("visible");
  }

  async fetchWords(theme) {
    const response = await fetch("./words.json");
    const wordsArray = await response.json();
    const maxNum = wordsArray[theme].length;
    const randonNumber = Math.floor(Math.random() * maxNum);
    return wordsArray[theme][randonNumber];
  }

  wordContainerConstructor() {
    let win = this.word.length;
    let content = ``;

    const usedKeys = [...document.querySelectorAll("button[disabled]")].map(item => item.innerText);
    [...this.word].forEach(letter => {
      if(usedKeys.includes(letter)) {
        content += `<span class="letter">${letter}</span>`;
        win -= 1
      } else {
        content += `<span class="letter"></span>`;
      }
    })

    if(win === 0) this.win();

    this.wordContainerElement.innerHTML = `
      <h4 class="theme">${this.theme}</h4>
      <div class="word">
        ${content}
      </div>
    `;
  }

  async handleWordContainer(currentTarget) {
    this.theme = currentTarget.getAttribute("data-theme");
    this.word = (await this.fetchWords(this.theme)).toUpperCase();
    this.wordContainerConstructor();
  }
  
  startGame({ currentTarget }) {
    this.handleWordContainer(currentTarget);
    this.chance = 0;
    
    this.hangmanImage.src = `./assets/forca-${this.chance}.png`;
    document.querySelectorAll("button[disabled]").forEach(element => element.removeAttribute("disabled"));
    this.keyboard.classList.add("visible");
    this.wordContainerElement.classList.add("visible");
    this.selectThemeModal.classList.remove("visible");
    this.alertGameModal.classList.remove("visible");
  }


  handleKeyboard({ currentTarget }) {
    currentTarget.setAttribute("disabled", "");
    const letter = currentTarget.innerText;
    this.wordContainerConstructor();
    
    if(!this.word.includes(letter)) {
      this.chance += 1;
      this.hangmanImage.src = `./assets/forca-${this.chance}.png`;
      if(this.chance === 6) this.gameover();
    }
  }

  handleStartgame() {
    this.selectThemeModal.classList.toggle("visible");
  }

  init() {
    this.startButton.addEventListener("click", this.handleStartgame);

    [...this.keyboard.children].forEach(tecla => {
      tecla.addEventListener("click", this.handleKeyboard);
    })

    this.themes.forEach(theme => {
      theme.addEventListener("click", this.startGame);
    })
  }
}


const hangman = new Hangman();
hangman.init();