import defaultWordList from 'words';

export default async function solve(app) {

  //Get the guesses and correctness
  var { validity, words } = app.state;
  const wordSize = validity[0].length;

  //Letters we know it contains and it's place
  const correctLetters = new Array(wordSize).fill(void (0));

  //Letters we know it does not contain
  const wrongLetters = [];

  //The letters we know that it includes
  const knownLetters = [];

  //The index of where each letter we know that it includes isn't
  const wrongLetterPlaces = {};

  //Keep trying until we're done
  let wordList = defaultWordList.slice();
  while (!app.state.done) {

    //Remove all of the correct letters
    for (const n in correctLetters) {
      const correctLetter = correctLetters[n];
      if (correctLetter)
        wordList = wordList.filter(w => w[n] === correctLetter);
    }

    //Remove all of the invalid letters
    for (const wrongLetter of wrongLetters)
      wordList = wordList.filter(w => !w.includes(wrongLetter));

    //Check all of the letters we know
    for (const knownLetter of knownLetters) {

      //Make sure the letters we know aren't in any of the wrong places
      for (const wrongLetterPlace of wrongLetterPlaces[knownLetter]) {
        wordList = wordList.filter(w => w.includes(knownLetter) && w[wrongLetterPlace] !== knownLetter);
      }
    }

    console.log(wordList);
    const guess = randomItem(wordList);
    await app.insertWord(guess);
    validity = app.state.validity;
    words = app.state.words;

    //Analyze the output
    const rowNumber = app.state.currentRow - 1;
    const row = validity[rowNumber];

    for (const letterIndex in row) {
      const letterValidity = row[letterIndex];
      const letter = words[rowNumber][letterIndex].toLowerCase();
      switch (letterValidity) {

        //If it's in the wrong position push the index where we know it's not
        case 'wrong-pos':
          if (!wrongLetterPlaces[letter])
            wrongLetterPlaces[letter] = [];
          if (!knownLetters.includes(letter))
            knownLetters.push(letter);
          wrongLetterPlaces[letter].push(letterIndex);
          break;

        //If it's correct set it to the position of where it is
        case 'correct':
          correctLetters[letterIndex] = letter;
          break;

        //If it's wrong put it with all the wrong ones
        default:
          wrongLetters.push(letter);
          break;
      }
    }
    console.log('bottom')
  }
}

//Pick a random item from an array
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}