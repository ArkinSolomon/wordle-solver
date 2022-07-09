# wordle-solver

A replication of Wordle and automatic solver of Wordles of any size. 

## Generating word lists

The code expects a `words.js` in the `src/` folder, which contains the word list of all possilbe words used in the solver. You can generate these words using the `dev/selectWords.js` file. Running this file with Node will generate a new `words.js` file withing the `dev/` folder. You can move this to the `src/` folder to use the new word list. Change the value of the variable `n` within `selectWords.js` to change the length of the words used in the word list.

## Running locally

After cloning the repository and creating a word list, run `npm start` to run the code locally in dev mode. Run `npm run build` in order to build the code, which can be served on a web server.

## License

Licensed under the MIT license. &copy; 2022 Arkin Solomon.

Not affiliated with [Wordle](https://www.nytimes.com/games/wordle/index.html) or the [New York Times](https://www.nytimes.com).

[Word list used](https://github.com/dwyl/english-words)
