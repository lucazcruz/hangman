class Hangman {
  constructor() {
    this.hangmanImage = document.querySelector(".hangman img");
    this.themeList = document.querySelectorAll(".theme");
    this.keyboard = document.querySelector("#keyboard");
    this.wordContainerElement = document.querySelector(".word-container");
    this.alertGameModal = document.querySelector("#alert-game");
    this.selectThemeModal = document.querySelector("#select-theme");
    this.startButton = document.querySelector(".start-game");

    this.startGame = this.startGame.bind(this);
    this.handleKeyboard = this.handleKeyboard.bind(this);
    this.toggleThemeModal = this.toggleThemeModal.bind(this);
  }

  alertGame(message) {
    this.alertGameModal.innerText = message;
    this.alertGameModal.classList.add("visible");
    this.keyboard.classList.remove("visible");
  }

  async fetchWords() {
    const response = await fetch("./words.json");
    return await response.json();
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

    if(win === 0) this.alertGame("You win! :)");

    this.wordContainerElement.innerHTML = `
      <h4 class="theme">${this.theme}</h4>
      <div class="word">
        ${content}
      </div>
    `;
  }

  async handleWord() {
    const wordsArray = await this.fetchWords();
    const maxNum = wordsArray[this.theme].length;
    const randonNumber = Math.floor(Math.random() * maxNum);
    this.word = wordsArray[this.theme][randonNumber].toUpperCase();
    this.wordContainerConstructor();
  }

  resetGame() {
    this.mistakes = 0;
    this.hangmanImage.src = `./assets/forca-${this.mistakes}.png`;
    document.querySelectorAll("button[disabled]").forEach(element => element.removeAttribute("disabled"));
  }
  
  startGame({ currentTarget }) {
    this.theme = currentTarget.getAttribute("data-theme");
    this.resetGame();
    this.handleWord();

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
      this.mistakes += 1;
      this.hangmanImage.src = `./assets/forca-${this.mistakes}.png`;
      if(this.mistakes === 6) this.alertGame("You lose! :(");
    }
  }

  toggleThemeModal() { this.selectThemeModal.classList.toggle("visible") };

  init() {
    this.alertGame('Click "New game" to start');
    this.startButton.addEventListener("click", this.toggleThemeModal);
    this.themeList.forEach(theme => theme.addEventListener("click", this.startGame));
    [...this.keyboard.children].forEach(key => key.addEventListener("click", this.handleKeyboard));
  }
}

const hangman = new Hangman();
hangman.init();