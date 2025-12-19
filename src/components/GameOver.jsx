import { Button } from './Button';

export function GameOver({ gameState, onNewGame }) {
  const isLiberalWin = gameState.winner === 'liberal';

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className={`rounded-lg p-8 mb-6 text-center ${
          isLiberalWin
            ? 'bg-blue-900/50 border-4 border-blue-500'
            : 'bg-red-900/50 border-4 border-red-500'
        }`}>
          <div className="text-6xl mb-4">
            {isLiberalWin ? '🔵' : '🔴'}
          </div>
          <h1 className={`text-5xl font-bold mb-4 ${
            isLiberalWin ? 'text-blue-400' : 'text-red-400'
          }`}>
            {gameState.winner.toUpperCase()}S WIN!
          </h1>
          <p className="text-2xl text-gray-300">
            {gameState.winReason}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Final Roles</h2>
          <div className="space-y-3">
            {gameState.players.map(player => {
              const roleColor = player.role === 'liberal' ? 'text-blue-400' :
                               player.role === 'hitler' ? 'text-red-600' :
                               'text-red-500';
              const roleText = player.role === 'liberal' ? 'Liberal' :
                              player.role === 'hitler' ? 'Hitler' :
                              'Fascist';

              return (
                <div key={player.id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    {player.name}
                    {!player.isAlive && <span className="text-red-400 ml-2">💀</span>}
                  </span>
                  <span className={`text-lg font-bold ${roleColor}`}>
                    {roleText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-2">Final Score</h2>
          <div className="flex justify-around text-center">
            <div>
              <p className="text-4xl font-bold text-blue-400">{gameState.liberalPolicies}</p>
              <p className="text-sm text-gray-400">Liberal Policies</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-red-400">{gameState.fascistPolicies}</p>
              <p className="text-sm text-gray-400">Fascist Policies</p>
            </div>
          </div>
        </div>

        <Button onClick={onNewGame} variant="primary" className="w-full">
          New Game
        </Button>
      </div>
    </div>
  );
}
