function Game(height, width) {
  if (height < 1 || width < 1) throw 'invalid dimensions for game board';
  this.board = (new Array(height)).fill().map(() => (new Array(width)).fill().map(() => ({
    mine: false,
    clicked: false,
    adjacentMines: 0,
    flag: false
  })));

  const numMines = Math.floor(height*width*.25); // a quarter of the spaces are mines
  this.clicksToWin = height*width - numMines;

  this.plantMines(numMines);
}

Game.prototype.drawBoard = function(reveal) {
  return this.board.map(row => row.map(x => {
    if (x.clicked) return x.adjacentMines;
    if (reveal && x.mine) return '!';
    if (x.flag) return 'F';
    return 'X';
  }).join(' ')).join('\n');
};

Game.prototype.inBounds = function(row, col) {
  return row >= 0 && row < this.board.length && col >= 0 && col < this.board[0].length;
};

Game.prototype.click = function(row, col) {
  if (!this.inBounds(row, col)) throw 'out of bounds move';
  if (this.board[row][col].mine) throw 'You lose!';

  if (this.board[row][col].clicked) return;

  this.board[row][col].clicked = true;
  this.clicksToWin--;
  if (this.clicksToWin === 0) throw 'You win!';

  if (this.board[row][col].adjacentMines === 0) {
    // auto click neighbors
    for(let xdif = -1; xdif < 2; xdif ++) {
      for (let ydif = -1; ydif < 2; ydif++) {
        // don't care about
        if (this.inBounds(row + ydif, col + xdif)) this.click(row + ydif, col + xdif);
      }
    }
  }
};

Game.prototype.flag = function(row, col) {
  if (!this.inBounds(row, col)) throw 'out of bounds flag';

  this.board[row][col].flag = !this.board[row][col].flag;
};

Game.prototype.plantMines = function(mineCount) {
  for (let i = 0; i < mineCount; i++) {
    let row, col;
    do {
      row = Math.floor(Math.random()*this.board.length);
      col =  Math.floor(Math.random()*this.board[0].length);
    } while (this.board[row][col].mine);

    this.board[row][col].mine = true;
    for(let xdif = -1; xdif < 2; xdif ++) {
      for (let ydif = -1; ydif < 2; ydif++) {
        this.incrAdj(row + ydif, col + xdif); // dont care about adjacency of ydif = xdif = 0
      }
    }
  }
};

Game.prototype.incrAdj = function(row, col) {
  if (this.inBounds(row, col)) {
    this.board[row][col].adjacentMines += 1;
  }
};

module.exports = Game;
