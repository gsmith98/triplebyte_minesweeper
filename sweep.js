const Game = require('./game');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function getHeight() {
  return new Promise((resolve, reject) => {
    rl.question('What height? ', h => {
      h = parseInt(h);
      if (isNaN(h)) return reject('invalid height');
      resolve(h);
    });
  });
}

function getwidth() {
  return new Promise((resolve, reject) => {
    rl.question('What width? ', w => {
      w = parseInt(w);
      if (isNaN(w)) return reject('invalid width');
      resolve(w);
    });
  });
}

function getDimensions() {
  let height, width;
  return getHeight()
    .then(h => {
      height = h;
      return getwidth();
    })
    .then(w => {
      width = w;
      return { height, width};
    })
    .catch(e => {
      console.log(e, 'try again');
      return getDimensions();
    });
}

function getMove() {
  return new Promise((resolve, reject) => {
    rl.question('Will you (1) click or (2) toggle flag? ', input => {
      const command = input.split(' ').map(x => parseInt(x));
      if (command.length !== 3 || command.some(isNaN)) return reject('command should be 3 integers <action> <row> <col>');
      resolve(command);
    });
  }).catch(e => {
    console.log(e, 'try again');
    return getMove();
  });
}

function handleMove(game) {
  console.log(game.drawBoard(false));
  return getMove()
    .then(move => {

      if (move[0] === 1) {
        game.click(move[1], move[2]);
      } else if (move[0] === 2) {
        game.flag(move[1], move[2]);
      }

      return handleMove(game);
    })
    .catch(e => {
      if (e === 'You lose!' || e === 'You win!') {
        game.drawBoard(true);
        return e;
      }
      console.log(e, 'try again');
      return handleMove(game);
    });
}

function main() {
  getDimensions()
    .then(dim => {
      console.log('found dim', dim);
      return handleMove(new Game(dim.height, dim.width));
    })
    .then((message) => {
      console.log(message);
      rl.close();
    });
}

main();
