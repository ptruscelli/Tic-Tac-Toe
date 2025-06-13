

/* ======================================================================== */

// Gameboard handles logic for the gameboard itself
// initializing board, checking token placements, checking token alignments for wins

const Gameboard = (() => {

    const rows = 3;
    const cols = 3;
    const board = [];

    const initializeBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < cols; j++) {
                board[i][j] = "*";
            };
        };
    };

    const printBoard = () => {
        for (let i = 0; i < 3; i++) {
            console.log(board[i].join(' | '));
        }
    }

    const placeToken = (row, col, token) => {

        if (row < 0 || col < 0 || row >= 3 || col >= 3) {
            return false;

        } else if (board[row][col] !== "*") {
            return false;

        } else {
            board[row][col] = token;
            return true;
        };
        
    };


    const winCheck = () => {
    // return true for wins, null for draw, and false to keep going
    
        for (let i = 0; i < 3; i++) {
            // check rows
            if ((board[i][0] === board[i][1] && 
                board[i][1] === board[i][2] &&
                board[i][0] !== "*") || 
            // check columns
                (board[0][i] === board[1][i] && 
                board[1][i] === board[2][i] &&
                board[0][i] !== "*")) {
                    return true;
                };
        };

        // check diagonals
        if ((board[0][0] === board[1][1] &&
            board[1][1] === board[2][2] &&
            board[2][2] !== "*") || 
            (board[0][2] === board[1][1] &&
            board[1][1] === board[2][0] &&
            board[2][0] !== "*")) {
                return true;
            };

        // check for a draw (board is full = no "*" left)
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "*") {
                    return false            
                };
            };
        } return null; 
        
    };

    // for first page load
    initializeBoard();

    return {
        initializeBoard,
        printBoard,
        placeToken,
        winCheck
    };

})();




function createPlayer(name, token) {
    return {name, token};
};



/* =================================================================================== */

// GameController controls flow of the game

// creating players, tracking the currently active player, switching players each turn
// playing each round, making annoucements (console version)
// contains reset function 

const GameController = (() => {
    
    // initialize players and their tokens
    const players = [createPlayer("Player 1", "X"), createPlayer("Player 2", "O")];
    let activePlayer = players[0];


    const getActivePlayer = () => activePlayer;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const roundAnnounce = () => {
        Gameboard.printBoard();
        console.log(`${getActivePlayer().name}'s turn! Please place a token`);
    };


    const playRound = (row, col) => {
    // returns true for valid player move, false for invalid move (in which case same player plays again)

        if (Gameboard.placeToken(row, col, getActivePlayer().token)) {

            let result = Gameboard.winCheck();

            if (result === true) {
                console.log(`${getActivePlayer().name} has won the game! Well played.`);
                Gameboard.printBoard();
                return true;

            } else if (result === null) {
                console.log(`It's a draw! Game over`);
                Gameboard.printBoard();
                return true;

            } else {

                switchPlayerTurn();
                roundAnnounce();
                return true;
            };

        } else {

            console.log(`Invalid move, please try again ${getActivePlayer().name}`);
            return false;

        };
    };

    const resetBoard = () => {
        Gameboard.initializeBoard();
        activePlayer = players[0]; // reset to player 1
        console.log("New game started");
        roundAnnounce();
    };


    roundAnnounce(); // start first game when page first loads


    return {
        playRound,
        getActivePlayer,
        resetBoard
    }
    
})();


/* ========================================================================== */

// SreenController handles UI interface and user interactions

// creating DOM game board grid, handles click events, update player display
// resetting visual board, displaying restart button
// coordinates between user action and game logic from GameController

const ScreenController = (() => {

    const boardContainer = document.querySelector(".boardContainer");
    const playerDiv = document.querySelector(".player");


    const createBoard = () => {
        // create 3x3 grid of clickable buttons

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const button = document.createElement("button");
                button.classList.add("boardCell");
                button.dataset.row = row;
                button.dataset.col = col;

                boardContainer.appendChild(button);
            };
        };
    };

    
    // handle board cell click logic
    const clickHandler = (event) => {
        let gameState = Gameboard.winCheck();

        if (gameState === true || gameState === null) {
            return;

        // make sure a board cell is clicked, not the gaps in between
        } else if (event.target.classList.contains("boardCell")) {
            
            // get position from clicked button's data attributes
            const row = parseInt(event.target.dataset.row);
            const col = parseInt(event.target.dataset.col);

            // update UI board if valid move
            activePlayer = GameController.getActivePlayer();
            if (GameController.playRound(row, col)) {
                event.target.textContent = activePlayer.token;
                updateScreen(activePlayer);
            };
        };

        
    };

    boardContainer.addEventListener("click", clickHandler);



    function clearBoard() {
        const buttons = document.querySelectorAll(".boardCell");
        buttons.forEach(element => {
            element.textContent = "";
        });
    };



    const restartHandler = (event) => {
        GameController.resetBoard();
        clearBoard();
        updateScreen(GameController.getActivePlayer());
        event.target.remove(); // remove restart button when new game begins
    };

    // restart button
    const showRestart = () => {
        const restartDiv = document.querySelector(".restart");
        const restartBtn = document.createElement("button");
        restartBtn.classList.add("restartBtn");
        restartBtn.addEventListener("click", restartHandler);
        restartBtn.textContent = `New Game`;

        restartDiv.appendChild(restartBtn);
    };


    // update player displays, announcements and game-end button display
    function updateScreen(activePlayer) {

        let gameState = Gameboard.winCheck();

        // game won
        if (gameState === true) {
            playerDiv.textContent = `${activePlayer.name} has won the game !`;
            showRestart();
            return;
        
        // game draw
        } else if (gameState === null) {
            playerDiv.textContent = `It's a draw. Game over`;
            showRestart();
            return;
        
        // game continues
        } else {
            playerDiv.textContent = `${GameController.getActivePlayer().name}'s turn`;
        };
    };

    // initialize game display upon page load
    createBoard();
    updateScreen();


})();
