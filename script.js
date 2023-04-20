const words = [];

async function fetchWords() {
  const response = await fetch('https://random-word-api.herokuapp.com/word?number=1000');
  const data = await response.json();
  words.push(...data);
}

fetchWords().then(() => {
  let chosenWord = words[Math.floor(Math.random() * words.length)];
  let wordDisplay = "";
  let remainingLives = 7;
  let guessedLetters = [];
  let wrongLetters = [];

  for (let i = 0; i < chosenWord.length; i++) {
    if (/[a-zA-Z]/.test(chosenWord[i])) {
      wordDisplay += "_ ";
    } else {
      wordDisplay += chosenWord[i] + " ";
    }
  }

  document.getElementById("word").innerHTML = wordDisplay.trim();
  document.getElementById("lives").innerHTML = "Lives: " + remainingLives;

  const letterInput = document.getElementById("letterInput");
  const guessButton = document.getElementById("guessButton");
  const guessedList = document.getElementById("guessedList");
  const gameOver = document.getElementById("lives");

  letterInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      guess();
    }
  });

  guessButton.addEventListener("click", guess);

  function guess() {
    let guessedLetter = letterInput.value.toUpperCase();

    if (!/[A-Z]/.test(guessedLetter)) {
      alert("Please enter a letter from A-Z.");
      letterInput.value = "";
      return;
    }

    if (guessedLetters.includes(guessedLetter)) {
      alert("You already guessed this letter.");
      letterInput.value = "";
      return;
    }

    guessedLetters.push(guessedLetter);

    if (chosenWord.toUpperCase().includes(guessedLetter)) {
      for (let i = 0; i < chosenWord.length; i++) {
        if (chosenWord[i].toUpperCase() === guessedLetter) {
          wordDisplay = replaceAt(wordDisplay, i*2, chosenWord[i]);
        }
      }
      document.getElementById("word").innerHTML = wordDisplay;
      checkWin();
    } else {
      remainingLives--;
      document.getElementById("lives").innerHTML = "Lives: " + remainingLives;
      wrongLetters.push(guessedLetter);
      document.getElementById("wrong").innerHTML = "Wrong Letters: " + wrongLetters.join(", ");
      checkLoss();
    }

    guessedList.innerHTML = "Guessed Letters: " + guessedLetters.join(", ");
    letterInput.value = "";
  }

  function checkWin() {
    if (!wordDisplay.includes("_")) {
      gameOver.classList.add("gameOver");
      gameOver.innerHTML = "You win! The word was " + chosenWord.toUpperCase();
      letterInput.disabled = true;
      guessButton.disabled = true;
    }
  }

  function checkLoss() {
    if (remainingLives === 0) {
      gameOver.classList.add("gameOver");
      gameOver.innerHTML = "Game over! The word was " + chosenWord.toUpperCase();
      letterInput.disabled = true;
      guessButton.disabled = true;
    }
  }

  function replaceAt(str, index, char) {
    return str.substring(0, index) + char + str.substring(index + 1);
  }
});

