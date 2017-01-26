// Business Logic
function Player() {
  this.totalScore;
}

function Game() {
  this.players = [];
  this.currentPlayer;
  this.isBusted;
  this.lastRoll;
  this.roundTotal;
  this.rollCount;
}

Game.prototype.showCurrentPlayerTotal = function() {
  return this.players[this.currentPlayer].totalScore;
}

Game.prototype.rollHandler = function(rollValue) {
  this.rollCount++;
  this.lastRoll = rollValue;
  if (this.lastRoll === 1) {
    this.isBusted = true;
    this.roundTotal = 0;
  } else {
    this.roundTotal += this.lastRoll;
  }
}

Game.prototype.holdHandler = function() {
  this.players[this.currentPlayer].totalScore += this.roundTotal;
}

Game.prototype.turnEnded = function() {
  return this.isBusted;
}

Game.prototype.playResult = function() {
  return {roundTotal: this.roundTotal, rollCount: this.rollCount};
}

Game.prototype.showLastRoll = function() {
  var result;
  if (this.rollCount === 0) {
    result = "";
  } else {
    result = this.lastRoll.toString();
  }
  return result;
}

Game.prototype.startNewTurn = function() {
  this.isBusted = false;
  this.lastRoll = "";
  this.roundTotal = 0;
  this.rollCount = 0;
}

Game.prototype.startNewGame = function() {
  this.players.forEach(function(player) {
    player.totalScore = 0;
  });
  this.startNewTurn();
}

Game.prototype.didCurrentPlayerWin = function() {
  return this.roundTotal + this.players[this.currentPlayer].totalScore >= 100;
}

var pigDice = new Game();
pigDice.players.push(new Player());
pigDice.currentPlayer = 0;


var rollOneDie  = function() {
  return Math.floor((Math.random() * 6) + 1);
}


// Front End Logic
var startNewGame = false;

function setDisplay() {
  $("#rollDice").text(pigDice.showLastRoll());
  $("#playerTotalScore").text(pigDice.showCurrentPlayerTotal());
  var roundStats = pigDice.playResult();
  $("#roundTotal").text(roundStats.roundTotal);
  $("#rollCount").text(roundStats.rollCount);
}

function toggleButtons() {
  if ($("#rollButton").attr("disabled")) {
    $("#rollButton").removeAttr("disabled");
    $("#holdButton").removeAttr("disabled");
  } else {
    $("#rollButton").attr("disabled", "disabled");
    $("#holdButton").attr("disabled", "disabled");
  }

  $("#changePlayerButton").toggle();
}

$(document).ready(function() {
  pigDice.startNewGame();
  setDisplay();

  $("#changePlayerButton").click(function() {
    toggleButtons();
    if (startNewGame) {
      startNewGame = false;
      pigDice.startNewGame();
    }
    setDisplay();
  });

  $("#rollButton").click(function() {
    var rollValue = rollOneDie();
    pigDice.rollHandler(rollValue);
    setDisplay();
    if (pigDice.turnEnded()) {
      pigDice.startNewTurn();
      toggleButtons();
    } else if (pigDice.didCurrentPlayerWin()) {
      $("#congratulations").text("WINNER!");
      startNewGame = true;
      toggleButtons();
    }
  });

  $("#holdButton").click(function() {
    pigDice.holdHandler();
    pigDice.startNewTurn();
    setDisplay();
    toggleButtons();
  });

});
