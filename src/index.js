import React from 'react';
import ReactDOM from 'react-dom';
import words from 'words';
import 'main.css';

words.sort();

//The size of words
const wordSize = 5;

//The amount of rows
const rowCount = 10;

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
      validity: new Array(rowCount).fill(new Array(wordSize).fill("default")),
      words: new Array(rowCount).fill(""),
      currentRow: 0,
      answer: words[Math.floor(Math.random() * words.length)].toUpperCase(),
      done: false,
      isCorrect: false
    };
    window.addEventListener('keydown', e => this.keydown(e));
  }

  //Get keydown events and apply them to the proper letter
  keydown(e) {
    if (this.state.done) return e.preventDefault();
    const key = String.fromCharCode(e.keyCode);

    //Only detect alpha keys and backspace
    if (!/[a-z]/i.test(key) && e.keyCode !== 8) return;

    let rowDone = false;
    this.setState(state => {
      const words = state.words.slice();

      if (e.keyCode === 8) words[state.currentRow] = words[state.currentRow].slice(0, -1);
      else words[state.currentRow] += key;

      //Move to the next row if needed
      rowDone = words[state.currentRow].length >= wordSize;
      const currentRow = state.currentRow + rowDone;
      return { words, currentRow };
    });

    //Calculate the validity for a row once it's done
    if (rowDone) {

      let oldRow = this.state.currentRow - 1;
      let oldWord = this.state.words[oldRow];

      //Check if it's a word if it's not clear the row
      if (!words.includes(oldWord.toLowerCase()))
        return this.setState(state => {
          const words = state.words.slice();
          words[oldRow] = "";
          return {
            currentRow: oldRow,
            words
          }
        });


      for (let i in oldWord) {
        let letter = oldWord[i];

        //Create a deep copy of the validity array
        const validity = JSON.parse(JSON.stringify(this.state.validity));
        if (letter === this.state.answer[i]) {
          validity[oldRow][i] = "correct";
        } else if (this.state.answer.includes(letter)) {
          validity[oldRow][i] = "wrong-pos";
        } else continue;
        const isCorrect = validity[oldRow].every(v => v === "correct");
        const done = isCorrect || this.state.currentRow === rowCount;
        this.setState({ validity, done, isCorrect });
      }
    }
  }

  render() {
    const rows = [];
    for (let i = 0; i < rowCount; ++i) {
      rows.push(<Row key={i} word={this.state.words[i] ?? ""} validity={this.state.validity[i]} />)
    }
    return (
      <center>
        <h1>Wordle AI</h1>
        {rows}
        {this.state.done && this.state.isCorrect && <h3>Yay you got the word</h3>}
        {this.state.done && !this.state.isCorrect && <h3>Aww dang the word was <i>{this.state.answer}</i></h3>}
      </center>
    );
  }
}
ReactDOM.render(<App onKeyPress={() => console.log('key')} />, document.querySelector('#root'));