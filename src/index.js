import React from 'react';
import ReactDOM from 'react-dom';
import words from 'words';
import 'main.css';
import 'babel-polyfill';

import { ErrorMessage, SuccessMessage } from './message';

import solve from 'solver';

words.sort();

//The size of words
const wordSize = words[0].length;

//The amount of rows (guesses)
const rowCount = 6;

//A single letter square
function Square(props) {
  return (
    <div className={"square " + props.validity}>
      <div className="letter">
        {props.letter}
      </div>
    </div>
  );
}

function Row(props) {

  //Create all the squares
  const squares = [];
  for (let i = 0; i < wordSize; ++i) {
    squares.push(<Square key={i} letter={props.word[i] ?? null} validity={props.validity[i]} />)
  }
  return (
    <div className="row">
      {squares}
    </div>
  );
}

//Main application
class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      validity: new Array(rowCount).fill(new Array(wordSize).fill('default')),
      words: new Array(rowCount).fill(''),
      currentRow: 0,
      answer: words[Math.floor(Math.random() * words.length)].toUpperCase(),
      done: false,
      isCorrect: false,
      locked: false,
      _messageTimerId: void (0)
    };
    this.eventListener = e => this.keydown(e);
  }

  //Get keydown events and apply them to the proper letter
  async keydown(e) {
    if (this.state.done || this.state.locked) return e.preventDefault();
    const key = String.fromCharCode(e.keyCode);

    //Only detect alpha keys and backspace
    if ((!/[a-z]/i.test(key) || key.length > 1) && e.keyCode !== 8) return;

    await this.insertLetter(e.keyCode === 8 ? 'DELETE' : key);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.eventListener);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.eventListener);
  }

  //Insert a letter
  insertLetter(key) {
    return new Promise(resolve => {
      let rowDone = false;

      this.setState(state => {

        const words = state.words.slice();

        //Delete on backspace
        if (key === 'DELETE') words[state.currentRow] = words[state.currentRow].slice(0, -1);
        else words[state.currentRow] += key;

        //Move to the next row if needed
        rowDone = words[state.currentRow].length >= wordSize;
        const currentRow = state.currentRow + rowDone;
        return { words, currentRow };
      }, () => {

        //Calculate the validity for a row once it's done
        if (rowDone) {

          let oldRow = this.state.currentRow - 1;
          let oldWord = this.state.words[oldRow];

          //Check if it's a word if it's not clear the row
          if (!words.includes(oldWord.toLowerCase())) {
            const originallyLocked = this.state.locked;
            return this.setState({ locked: true }, () => {

              //Display an error message
              this.showError('Not in word list', 1500, () => {
                this.setState(state => {
                  const words = state.words.slice();
                  words[oldRow] = '';
                  return {
                    currentRow: oldRow,
                    words,
                    locked: originallyLocked
                  }
                }, resolve);
              });
            });
          }

          //Create a deep copy of the validity array
          const validity = JSON.parse(JSON.stringify(this.state.validity));

          //Loop through all the letters
          for (let i in oldWord) {
            let letter = oldWord[i];

            if (letter === this.state.answer[i]) {
              validity[oldRow][i] = 'correct';
            } else if (this.state.answer.includes(letter)) {
              validity[oldRow][i] = 'wrong-pos';
            } else continue;
          }
          const isCorrect = validity[oldRow].every(v => v === 'correct');
          const done = isCorrect || this.state.currentRow === rowCount;
          if (done) {
            if (isCorrect)
              this.showSuccess('Yay you got the word nice job!')
            else
              this.showError('Aww you didn\'t get the word, the word was: ' + this.state.answer, Infinity, () => { });
          }
          this.setState({ validity, done, isCorrect }, resolve);
        } else 
          resolve();
      });
    });
  }

  //Insert a whole word
  async insertWord(word) {
    for (const letter of word.toUpperCase().split('')) 
      await this.insertLetter(letter);
  }

  //Set an error
  showError(message, time, messageEndCB) {
    this.clearMessage();

    //Show the new message
    var tId;

    if (time < Infinity) {
      tId = setTimeout(() => {
        this.setState({ isErrorShown: false, message: void (0), _messageTimerId: void (0) });
        messageEndCB();
      }, time);
    }
    this.setState({ isErrorShown: true, message, _messageTimerId: tId });
  }

  //Set an error
  showSuccess(message, time, messageEndCB) {
    this.clearMessage();

    //Show the new message
    var tId;
    if (time < Infinity) {
      tId = setTimeout(() => {
        this.setState({ isSuccessShown: false, message: void (0), _messageTimerId: void (0) });
        messageEndCB();
      }, time);
    }
    this.setState({ isSuccessShown: true, message, _messageTimerId: tId });
  }

  //Clear all messages
  clearMessage() {

    //Clear any already displayed messages
    if (this.state._messageTimerId) {
      clearTimeout(setTimeout);
      messageEndCB();
    }
  }

  //Start autosolving
  autosolve() {
    return new Promise(resolve => {
      //Clear whatever current row we're on
      this.setState(state => {
        const newWords = state.words;
        newWords[state.currentRow] = '';
        return {
          locked: true,
          words: newWords
        };
      }, async () => {
        await solve(this);
        resolve();
      });
    });
  }

  //Main render function
  render() {

    //Create all the rows
    const rows = [];
    for (let i = 0; i < rowCount; ++i)
      rows.push(<Row key={i} word={this.state.words[i] ?? ""} validity={this.state.validity[i]} />);
    return (
      <div className="wrapper">
        {this.state.isErrorShown && <ErrorMessage message={this.state.message}></ErrorMessage>}
        {this.state.isSuccessShown && <SuccessMessage message={this.state.message}></SuccessMessage>}
        <center>
          <h1>Wordle</h1>
          {rows}
          <br />
          <button onClick={this.autosolve.bind(this)}>Solve</button>
        </center >
      </div>
    );
  }
}

// ReactDOM.render(<App />, document.querySelector('#root'));

let correct = 0;
const attempts = 100;
for (let i = 0; i < attempts; ++i) {
  const app = ReactDOM.render(<App />, document.querySelector('#root'));
  await app.autosolve();
  correct += app.state.isCorrect;
  console.log(`${i + 1}/${attempts}`)
  if (i !== attempts - 1)
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
}
console.log(correct / attempts);