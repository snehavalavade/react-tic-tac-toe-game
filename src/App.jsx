import { useState } from "react";
import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./WINNING_COMBINATIONS.JS";
import GameOver from "./components/GameOver";

const initialGameBoard = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
];

//Deriving currentPlayer state
function deriveCurrentPlayer(gameTurns) {
    let currentPlayer = "X";

    if (gameTurns.length > 0 && gameTurns[0].player === "X") {
        currentPlayer = "O";
    }

    return currentPlayer;
}

function deriveGameBoard(gameTurns) {
    //Deriving board state
    let gameBoard = initialGameBoard.map((row) => [...row]);
    // we extract:
    // turn → square, turn → player, square → row, square → col
    for (const turn of gameTurns) {
        const { square, player } = turn;
        const { row, col } = square;

        gameBoard[row][col] = player;
    }
    return gameBoard;
}

function deriveWinner(gameBoard, players) {
    //Deriving winner
    let winner = null;
    for (const combination of WINNING_COMBINATIONS) {
        const firstSquareSymbol =
            gameBoard[combination[0].row][combination[0].column];
        const secondSquareSymbol =
            gameBoard[combination[1].row][combination[1].column];
        const thirdSquareSymbol =
            gameBoard[combination[2].row][combination[2].column];

        if (
            firstSquareSymbol &&
            firstSquareSymbol === secondSquareSymbol &&
            firstSquareSymbol === thirdSquareSymbol
        ) {
            winner = players[firstSquareSymbol];
            break;
        }
    }
    return winner;
}

function App() {
    const [gameTurns, setGameTurns] = useState([]);
    const [players, setPlayers] = useState({
        X: "player1",
        O: "player2",
    });

    //const [activePlayer, setActivePlayer] = useState("X");
    //const [hasWinner, setHasWinner] = useState(false);
    //Draw condition
    const activePlayer = deriveCurrentPlayer(gameTurns);
    const gameBoard = deriveGameBoard(gameTurns);
    const winner = deriveWinner(gameBoard, players);
    const hasDraw = gameTurns.length === 9 && !winner;

    function handleSelectSquare(rowIndex, colIndex) {
        setGameTurns((prevTurns) => {
            const currentPlayer = deriveCurrentPlayer(prevTurns);

            const updatedTurns = [
                {
                    square: { row: rowIndex, col: colIndex },
                    player: currentPlayer,
                },
                ...prevTurns,
            ];
            return updatedTurns;
        });
    }

    function handleRestart() {
        setGameTurns([]);
    }

    function handlePlayerName(symbol, newName) {
        setPlayers((prevPlayers) => {
            return {
                ...prevPlayers,
                [symbol]: newName,
            };
        });
    }

    return (
        <main>
            <div id="game-container">
                <ol id="players" className="highlight-player">
                    <Player
                        initialName="Player1"
                        symbol="X"
                        isActive={activePlayer === "X"}
                        onChangeName={handlePlayerName}
                    />
                    <Player
                        initialName="Player2"
                        symbol="O"
                        isActive={activePlayer === "O"}
                        onChangeName={handlePlayerName}
                    />
                </ol>
                {(winner || hasDraw) && (
                    <GameOver winner={winner} onRestart={handleRestart} />
                )}
                <GameBoard
                    onSelectSquare={handleSelectSquare}
                    board={gameBoard}
                />
            </div>
            <Log turns={gameTurns} />
        </main>
    );
}

export default App;
