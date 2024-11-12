const statusDisplay = document.querySelector('.gameStatus');
const titleDisplay = document.querySelector('.gameTitle');
let gameActive = true;
let currentPlayer = "X";
let board = ["","","","","","","","",""];
let difficulty = 'Easy';
const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => 'Game ended in a draw!';
const currentPlayerTurn = () => `It's ${currentPlayer}\'s turn!`;
const title = () => `Tic Tac Toe - ${difficulty}`

statusDisplay.innerHTML = currentPlayerTurn();
titleDisplay.innerHTML = title();

function setDifficulty(level) {
    difficulty = level;
    titleDisplay.innerHTML = title();
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    if(!clickedCell) return;
    board[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    console.log("Updated board", board);
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();

    if (currentPlayer === "O" && gameActive) {
        let bestMove;
        if (difficulty === 'Hard') {
            bestMove = findBestMove(board);
        } else {
            bestMove = findRandomMove(board);
        }
        console.log("Computer's Move (", difficulty, "): ", bestMove);
        handleCellPlayed(document.querySelector(`[data-cell-index="${bestMove}"]`), bestMove);
        handleResultValidation();
    }
}

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function handleResultValidation() {
    let roundWon = false;
    let winningCells = [];

    // check each winning condition
    for (let i = 0; i <= 7; i++){
        const winCondition = winningConditions[i];
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            winningCells = winCondition;
            break
        }

    }

    // if won
    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;

        winningCells.forEach(index => {
            const cell = document.querySelector(`[data-cell-index="${index}"]`);
            cell.classList.add('winningCell');
        });
        return;
    }

    // deciding a draw
    let roundDraw = !board.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    // if not filtered game is still going on
    handlePlayerChange();
}

function handleCellCLick(clickedCellEvent) {

    if (currentPlayer !== "X" || !gameActive) return;

    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (board[clickedCellIndex] !== "" ) return;

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    board = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerHTML = "";
        cell.classList.remove('winningCell');
    });
}

function checkWin(player) {
    return winningConditions.some(condition => condition.every(index => board[index] === player));
}

function minimax(board, isMaximizing) {
    // base case:
    if (checkWin("O")) return 1;
    if (checkWin("X")) return -1;
    if (board.every(cell => cell !== "")) return 0;

    // computer's turn (maximizing)
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === ""){
                board[i] = "O";
                let score = minimax(board, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    }

    else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function findBestMove(board) {
    let bestScore = -Infinity;
    let bestMove = -1;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove
}

function findRandomMove(board) {
    const emptyCells = board
        .map((cell,index) => cell === "" ? index : null)
        .filter(index => index !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellCLick));
document.querySelector('.gameRestart').addEventListener('click', handleRestartGame);