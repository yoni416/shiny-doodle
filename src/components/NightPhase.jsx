import { useState } from 'react';
import { Button } from './Button';
import { PrivacyScreen } from './PrivacyScreen';
import { getNightInfo } from '../utils/gameLogic';

export function NightPhase({ gameState, onComplete }) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showRole, setShowRole] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(true);

  const currentPlayer = gameState.players[currentPlayerIndex];
  const nightInfo = getNightInfo(currentPlayer, gameState.players, gameState.players.length);

  const handleShowRole = () => {
    setShowPrivacy(false);
    setShowRole(true);
  };

  const handleNext = () => {
    if (currentPlayerIndex < gameState.players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setShowRole(false);
      setShowPrivacy(true);
    } else {
      onComplete();
    }
  };

  if (showPrivacy) {
    return (
      <PrivacyScreen
        playerName={currentPlayer.name}
        onContinue={handleShowRole}
      />
    );
  }

  const getRoleColor = (role) => {
    if (role === 'Liberal') return 'text-blue-400';
    if (role === 'Hitler') return 'text-red-600';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">
            {nightInfo.role === 'Liberal' ? '🔵' : '🔴'}
          </div>
          <h1 className={`text-5xl font-bold mb-4 ${getRoleColor(nightInfo.role)}`}>
            {nightInfo.role}
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            {nightInfo.message}
          </p>
        </div>

        {nightInfo.teammates && nightInfo.teammates.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-bold mb-3">
              {nightInfo.role === 'Hitler' && gameState.players.length <= 6
                ? 'Your Fascist Teammate:'
                : 'Your Teammates:'}
            </h2>
            <ul className="space-y-2">
              {nightInfo.teammates.map(teammate => (
                <li key={teammate.id} className="text-xl">
                  <span className="font-bold">{teammate.name}</span>
                  {nightInfo.role === 'Fascist' && teammate.role === 'hitler' && (
                    <span className="text-red-400 ml-2">(Hitler)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button onClick={handleNext} variant="primary" className="w-full">
          {currentPlayerIndex < gameState.players.length - 1
            ? 'Hide & Pass Device'
            : 'Start Game'}
        </Button>

        <p className="text-center text-gray-500 mt-4 text-sm">
          Player {currentPlayerIndex + 1} of {gameState.players.length}
        </p>
      </div>
    </div>
  );
}
