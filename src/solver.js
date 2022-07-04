export default function solve(app) {

  //Get the guesses and correctness
  const { validity, words } = app.state;

  app.insertWord('Arkin');

}

//Pick a random item from an array
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}