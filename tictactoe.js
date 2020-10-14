const playerFactory = (name, mark) => {
  const playersTurn = (board, cell) => {
    const indexCell = board.cells.findIndex((position) => position === cell);

    if (board.boardArray[indexCell] === "") {
      board.render();
      return indexCell;
    }
    return null;
  };
  return { name, mark, playersTurn };
};

const openFormBtn = document.querySelector(".openFormBtn")
openFormBtn.addEventListener('click', (event) => {
  return document.getElementById("popup-form").style.display = "block";
})



const boardModule = (() => {
  // boardArray to hold the nine positions in the game
  let boardArray = ["", "", "", "", "", "", "", "", ""];
  const gameBoard = document.querySelector("#board");
  const cells = Array.from(document.querySelectorAll(".cell"));
  let winner = null;

  // to make the value of the html cells similar to the boardArray
  const render = () => {
    boardArray.forEach((mark, indexCell) => {
      cells[indexCell].textContent = boardArray[indexCell];
    });
  };

  // the reset function to reset the array to empty after each round
  const reset = () => {
    boardArray = ["", "", "", "", "", "", "", "", ""];
    };
    

  // to check the wining positions in the game
  const checkWin = () => {
    const winArrays = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    // to map around each element in the array and check winner or tie

    winArrays.forEach((combo) => {
      if (
        boardArray[combo[0]] &&
        boardArray[combo[0]] === boardArray[combo[1]] &&
        boardArray[combo[0]] === boardArray[combo[2]]
      ) {
        winner = "current";
      }
    });
    return winner || (boardArray.includes("") ? null : "Tie");
  };
  return {
    render,
    gameBoard,
    reset,
    cells,
    boardArray,
    checkWin,
  };
})();

// module for getting the player info from the DOM
const gamePlay = (() => {
  const playerOneName = document.querySelector("#player1");
  const playerTwoName = document.querySelector("#player2");
  const form = document.querySelector(".player-input");
 

    const resetBtn = document.querySelector("#reset");
   

  let currentPLayer;
  let playerOne;
  let playerTwo;

  // the swtchTurn method is to switch the turns of the players as the play;

  const switchTurn = () => {
    currentPLayer = currentPLayer === playerOne ? playerTwo : playerOne;
  };

  // the game round mthd controls the games rounds & checks if there is a winner or a tie

  const gameRound = () => {
    const board = boardModule;
    const gameStatus = document.querySelector(".gameStatus");
    if (currentPLayer.name !== "") {
      gameStatus.textContent = "Board: ";
    }
    board.gameBoard.addEventListener("click", (event) => {
      event.preventDefault();
      const play = currentPLayer.playersTurn(board, event.target);
      if (play !== null) {
        board.boardArray[play] = `${currentPLayer.mark}`;
        board.render();
        const winStatus = board.checkWin();
        if (winStatus === "Tie!") {
          gameStatus.textContent = "Tie!";
        } else if (winStatus === null) {
          switchTurn();
          gameStatus.textContent = `${currentPLayer.name}'s Turn`;
        } else {
          gameStatus.textContent = `Winneer is ${currentPLayer.name}`;
          board.reset();
          board.render();
        }
      }
    });
      
    };
  
  // gameInit method initializes the game;
  const gameInit = () => {
    if ((playerOneName.value !== "") & (playerTwoName.value !== "")) {
      playerOne = playerFactory(playerOneName.value, "X");
      playerTwo = playerFactory(playerTwoName.value, "O");
      currentPLayer = playerOne;
      gameRound();
    }
  };

  
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (playerOneName.value !== "" && playerTwoName.value !== "") {
      gameInit();
      form.classList.add("hidden");
      document.querySelector(".place").classList.remove("hidden");
    } else {
      window.location.reload();
    }
  });
    
  resetBtn.addEventListener('click', () => {
    document.querySelector('.gameStatus').textContent = 'Board: ';
    document.querySelector('#player1').value = '';
    document.querySelector('#player2').value = '';
    window.location.reload();
  });
    
  return {
    gameInit, 
  };
})();

gamePlay.gameInit();
