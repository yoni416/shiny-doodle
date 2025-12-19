import { useState } from 'react';
import { Button } from './Button';

export function SetupScreen({ onStartGame, hasExistingGame, onResumeGame }) {
  const [playerCount, setPlayerCount] = useState(5);
  const [playerNames, setPlayerNames] = useState(Array(5).fill(''));
  const [showInfo, setShowInfo] = useState(true);

  const updatePlayerCount = (count) => {
    setPlayerCount(count);
    setPlayerNames(Array(count).fill(''));
  };

  const updatePlayerName = (index, name) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    const filledNames = playerNames.filter(name => name.trim() !== '');
    if (filledNames.length === playerCount) {
      onStartGame(filledNames);
    }
  };

  const allNamesFilled = playerNames.every(name => name.trim() !== '');

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-red-500">
          Secret Hitler<br />
          <span className="text-2xl text-gray-400">Table Companion</span>
        </h1>

        {showInfo && (
          <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-100 mb-2">
              This app replaces the board and cards. Pass the device when instructed.
              Keep your screen hidden during secret actions. Voting results are public,
              but casting the vote is secret.
            </p>
            <button
              onClick={() => setShowInfo(false)}
              className="text-yellow-400 text-sm underline"
            >
              Got it
            </button>
          </div>
        )}

        {hasExistingGame && (
          <div className="mb-6">
            <Button onClick={onResumeGame} variant="success" className="w-full">
              Resume Game
            </Button>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">New Game Setup</h2>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Number of Players</label>
            <div className="grid grid-cols-6 gap-2">
              {[5, 6, 7, 8, 9, 10].map(count => (
                <button
                  key={count}
                  onClick={() => updatePlayerCount(count)}
                  className={`py-3 px-4 rounded-lg font-bold transition-all ${
                    playerCount === count
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Player Names</label>
            <div className="space-y-3">
              {playerNames.map((name, index) => (
                <input
                  key={index}
                  type="text"
                  value={name}
                  onChange={(e) => updatePlayerName(index, e.target.value)}
                  placeholder={`Player ${index + 1}`}
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
          </div>

          <Button
            onClick={handleStart}
            disabled={!allNamesFilled}
            variant="primary"
            className="w-full"
          >
            Start Game
          </Button>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 text-sm text-gray-400">
          <h3 className="font-bold mb-2">Role Distribution</h3>
          <ul className="space-y-1">
            <li>5 Players: 3 Liberals, 1 Fascist, 1 Hitler</li>
            <li>6 Players: 4 Liberals, 1 Fascist, 1 Hitler</li>
            <li>7 Players: 4 Liberals, 2 Fascists, 1 Hitler</li>
            <li>8 Players: 5 Liberals, 2 Fascists, 1 Hitler</li>
            <li>9 Players: 5 Liberals, 3 Fascists, 1 Hitler</li>
            <li>10 Players: 6 Liberals, 3 Fascists, 1 Hitler</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
