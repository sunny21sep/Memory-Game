import React, { useEffect, useState } from 'react';

const MemoryGame = () => {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0); // Track the number of moves
  const [maxMoves, setMaxMoves] = useState(0); // Max moves, 0 means unlimited moves
  const [gameOver, setGameOver] = useState(false); // Game over state

  const handleGridSizeChange = (e) => {
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 10) setGridSize(size);
  };

  const handleMaxMovesChange = (e) => {
    const max = parseInt(e.target.value);
    setMaxMoves(max >= 0 ? max : 0); // 0 means unlimited moves
  };

  const initializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairCount = Math.floor(totalCards / 2);
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
    const shuffledCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({ id: index, number }));

    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setMoves(0); // Reset moves
    setGameOver(false); // Reset game over state
    setWon(false); // Reset win state
  };

  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
    }

    if (maxMoves > 0 && moves >= maxMoves) {
      setGameOver(true); // End the game if moves exceed maxMoves
    }
  }, [solved, cards, moves, maxMoves]);

  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].number === cards[secondId].number) {
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };

  const handleClick = (id) => {
    if (disabled || won || gameOver) return;

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    if (flipped.length === 1) {
      setDisabled(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        checkMatch(id);
        setMoves((prev) => prev + 1); // Increment move count
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Memory Game</h1>

      {/* Inputs Row */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
        <div className="flex items-center">
          <label htmlFor="gridSize" className="mr-2 whitespace-nowrap">
            Grid Size: (max 10)
          </label>
          <input
            type="number"
            id="gridSize"
            min="2"
            max="10"
            value={gridSize}
            onChange={handleGridSizeChange}
            className="border-2 border-gray-300 rounded px-2 py-1 w-24"
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="maxMoves" className="mr-2 whitespace-nowrap">
            Max Moves: (0 for unlimited)
          </label>
          <input
            type="number"
            id="maxMoves"
            min="0"
            value={maxMoves}
            onChange={handleMaxMovesChange}
            className="border-2 border-gray-300 rounded px-2 py-1 w-32"
          />
        </div>
      </div>

      {/* Game Board */}
      <div
        className={`grid gap-2 mb-4`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))`,
          width: `min(100%, ${gridSize * 5.5}rem)`,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleClick(card.id)}
            className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300 ${
              isFlipped(card.id)
                ? isSolved(card.id)
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 text-white'
                : 'bg-gray-300 text-gray-400'
            }`}
          >
            {isFlipped(card.id) ? card.number : '?'}
          </div>
        ))}
      </div>

      {/* Moves and Status */}
      <div className="mb-4 text-xl">
        Moves: {moves} / {maxMoves === 0 ? '∞' : maxMoves}
      </div>

      {/* Game Result */}
      {won && (
        <div className="mt-4 text-4xl font-bold text-green-600 animate-bounce">
          You Won!
        </div>
      )}
      {gameOver && !won && (
        <div className="mt-4 text-4xl font-bold text-red-600 animate-bounce">
          Game Over!
        </div>
      )}

      {/* Reset / Play Again Button */}
      <button
        onClick={initializeGame}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        {won || gameOver ? 'Play Again' : 'Reset'}
      </button>
    </div>
  );
};

export default MemoryGame;
