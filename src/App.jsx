import { useGameState } from './hooks/useGameState';
import { PHASES } from './constants/gameConfig';
import { SetupScreen } from './components/SetupScreen';
import { NightPhase } from './components/NightPhase';
import { ElectionPhase } from './components/ElectionPhase';
import { LegislativePhase } from './components/LegislativePhase';
import { ExecutivePhase } from './components/ExecutivePhase';
import { TableView } from './components/TableView';
import { GameOver } from './components/GameOver';
import { Button } from './components/Button';

function App() {
  const {
    gameState,
    startNewGame,
    resetGame,
    startElectionPhase,
    nominateChancellor,
    castVote,
    resolveElection,
    presidentDiscardPolicy,
    chancellorEnactPolicy,
    executeExecutivePower,
    undo,
    canUndo,
  } = useGameState();

  const hasExistingGame = gameState.phase !== PHASES.SETUP;

  const handleResumeGame = () => {
    // Game state is already loaded from localStorage
    // Just need to ensure we're not in setup phase
    if (gameState.phase === PHASES.SETUP) {
      alert('No game to resume');
    }
  };

  const handleNewGame = () => {
    resetGame();
  };

  // Setup Phase
  if (gameState.phase === PHASES.SETUP) {
    return (
      <SetupScreen
        onStartGame={startNewGame}
        hasExistingGame={hasExistingGame}
        onResumeGame={handleResumeGame}
      />
    );
  }

  // Game Over
  if (gameState.phase === PHASES.GAME_OVER) {
    return <GameOver gameState={gameState} onNewGame={handleNewGame} />;
  }

  // Night Phase (Role Reveal)
  if (gameState.phase === PHASES.NIGHT) {
    return (
      <NightPhase
        gameState={gameState}
        onComplete={startElectionPhase}
      />
    );
  }

  // Active game phases with table view
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Admin controls */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Secret Hitler</h1>
          <div className="flex gap-2">
            {canUndo && (
              <Button onClick={undo} variant="secondary" className="text-sm py-2 px-4">
                ↶ Undo
              </Button>
            )}
            <Button
              onClick={() => {
                if (confirm('Are you sure you want to quit this game?')) {
                  handleNewGame();
                }
              }}
              variant="danger"
              className="text-sm py-2 px-4"
            >
              Quit Game
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Table View - Always visible during active game */}
        <TableView gameState={gameState} onUndo={undo} canUndo={canUndo} />

        {/* Current Phase */}
        <div className="mt-6">
          {gameState.phase === PHASES.ELECTION && (
            <ElectionPhase
              gameState={gameState}
              onNominateChancellor={nominateChancellor}
              onCastVote={castVote}
              onResolveElection={resolveElection}
            />
          )}

          {gameState.phase === PHASES.LEGISLATIVE && (
            <LegislativePhase
              gameState={gameState}
              onPresidentDiscard={presidentDiscardPolicy}
              onChancellorEnact={chancellorEnactPolicy}
            />
          )}

          {gameState.phase === PHASES.EXECUTIVE && (
            <ExecutivePhase
              gameState={gameState}
              onExecutePower={executeExecutivePower}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
