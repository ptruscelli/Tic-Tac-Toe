


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
        };

        if (board[row][col] !== "*") {
            return false;
        };

        board[row][col] = token;
        return true;
    };


    const winCheck = () => {

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
        
        return false;
    };


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




const GameController = (() => {
    
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
        if (Gameboard.placeToken(row, col, getActivePlayer().token)) {

            if (Gameboard.winCheck()) {
                console.log(`${getActivePlayer().name} has won the game! Well played.`)
                Gameboard.printBoard();
                return true;
            }

            switchPlayerTurn();
            roundAnnounce();
            return true;

        } else {

            console.log(`Invalid move, please try again ${getActivePlayer().name}`);
            return false;

        };
    };


    roundAnnounce();


    return {
        playRound,
        getActivePlayer
    }
    
})();

