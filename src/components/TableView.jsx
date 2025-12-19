import { Button } from './Button';
import { getBoardConfig } from '../constants/gameConfig';

export function TableView({ gameState, onUndo, canUndo }) {
  const president = gameState.players.find(p => p.id === gameState.currentPresident);
  const chancellor = gameState.players.find(p => p.id === gameState.currentChancellor);
  const boardConfig = getBoardConfig(gameState.players.length);

  const PolicyTrack = ({ type, count, max }) => {
    const isLiberal = type === 'liberal';
    const color = isLiberal ? 'bg-blue-500' : 'bg-red-700';
    const emptyColor = isLiberal ? 'bg-blue-900/30' : 'bg-red-900/30';

    return (
      <div className="mb-6">
        <h3 className={`text-lg font-bold mb-2 ${isLiberal ? 'text-blue-400' : 'text-red-400'}`}>
          {isLiberal ? 'Liberal' : 'Fascist'} Policies: {count}/{max}
        </h3>
        <div className="flex gap-2">
          {Array.from({ length: max }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-16 rounded-lg ${i < count ? color : emptyColor} border-2 ${
                isLiberal ? 'border-blue-600' : 'border-red-800'
              } flex items-center justify-center`}
            >
              {i < count && <span className="text-2xl">{isLiberal ? '🔵' : '🔴'}</span>}
              {!isLiberal && boardConfig[i] && i >= count && (
                <span className="text-xs text-gray-500 text-center px-1">
                  {boardConfig[i].replace('_', ' ').toUpperCase()}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ElectionTracker = () => (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-2 text-yellow-400">
        Election Tracker: {gameState.electionTracker}/3
      </h3>
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-12 rounded-lg ${
              i < gameState.electionTracker ? 'bg-yellow-600' : 'bg-yellow-900/30'
            } border-2 border-yellow-800 flex items-center justify-center`}
          >
            {i === 2 && (
              <span className="text-xs text-gray-400">CHAOS</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-white">Table View</h2>
        {canUndo && (
          <Button onClick={onUndo} variant="secondary" className="text-sm py-2 px-4">
            ↶ Undo
          </Button>
        )}
      </div>

      <PolicyTrack type="liberal" count={gameState.liberalPolicies} max={5} />
      <PolicyTrack type="fascist" count={gameState.fascistPolicies} max={6} />
      <ElectionTracker />

      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-gray-300">Current Government</h3>
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="mb-1">
            <span className="text-blue-400 font-bold">President:</span>{' '}
            {president ? president.name : 'None'}
          </p>
          {chancellor && (
            <p>
              <span className="text-green-400 font-bold">Chancellor:</span> {chancellor.name}
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-gray-300">Players</h3>
        <div className="grid grid-cols-2 gap-2">
          {gameState.players.map(player => (
            <div
              key={player.id}
              className={`p-3 rounded-lg ${
                player.isAlive ? 'bg-gray-700' : 'bg-gray-900 opacity-60'
              }`}
            >
              <span className={!player.isAlive ? 'line-through' : ''}>
                {player.name}
              </span>
              {player.id === gameState.currentPresident && (
                <span className="ml-2 text-blue-400 text-xs">★</span>
              )}
              {!player.isAlive && (
                <span className="ml-2 text-red-400 text-xs">💀</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-2 text-gray-300">Game Log</h3>
        <div className="bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto">
          {gameState.gameLog.length === 0 ? (
            <p className="text-gray-500 text-sm">No events yet</p>
          ) : (
            <div className="space-y-2">
              {[...gameState.gameLog].reverse().map((log, index) => (
                <div key={index} className="text-sm text-gray-300 border-b border-gray-800 pb-2">
                  {log.message}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
