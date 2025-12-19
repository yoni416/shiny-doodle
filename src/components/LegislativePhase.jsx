import { useState } from 'react';
import { Button } from './Button';
import { PrivacyScreen } from './PrivacyScreen';

export function LegislativePhase({ gameState, onPresidentDiscard, onChancellorEnact }) {
  const [showPrivacy, setShowPrivacy] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const president = gameState.players.find(p => p.id === gameState.currentPresident);
  const chancellor = gameState.players.find(p => p.id === gameState.currentChancellor);

  const isPresidentTurn = gameState.presidentHand.length > 0;
  const isChancellorTurn = gameState.chancellorHand.length > 0;

  const PolicyCard = ({ policy, index, onSelect, selected }) => (
    <button
      onClick={() => onSelect(index)}
      className={`relative p-8 rounded-xl transition-all transform ${
        selected === index ? 'scale-105 ring-4 ring-yellow-400' : ''
      } ${
        policy === 'liberal'
          ? 'bg-gradient-to-br from-blue-500 to-blue-700'
          : 'bg-gradient-to-br from-red-700 to-red-900'
      }`}
    >
      <div className="text-4xl mb-2">
        {policy === 'liberal' ? '🔵' : '🔴'}
      </div>
      <div className="text-xl font-bold text-white uppercase">
        {policy}
      </div>
    </button>
  );

  if (isPresidentTurn) {
    const currentPlayer = president;

    if (showPrivacy) {
      return (
        <PrivacyScreen
          playerName={currentPlayer.name}
          onContinue={() => setShowPrivacy(false)}
        />
      );
    }

    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">
            President: Choose Policy to Discard
          </h1>

          <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4 mb-6">
            <p className="text-lg">
              <span className="font-bold">{currentPlayer.name}</span>, you drew 3 policies.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Select ONE to discard. The remaining 2 will be passed to the Chancellor.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {gameState.presidentHand.map((policy, index) => (
              <PolicyCard
                key={index}
                policy={policy}
                index={index}
                onSelect={setSelectedPolicy}
                selected={selectedPolicy}
              />
            ))}
          </div>

          <Button
            onClick={() => {
              onPresidentDiscard(selectedPolicy);
              setShowPrivacy(true);
            }}
            disabled={selectedPolicy === null}
            variant="primary"
            className="w-full"
          >
            Discard Selected & Pass to Chancellor
          </Button>
        </div>
      </div>
    );
  }

  if (isChancellorTurn) {
    const currentPlayer = chancellor;

    if (showPrivacy) {
      return (
        <PrivacyScreen
          playerName={currentPlayer.name}
          onContinue={() => setShowPrivacy(false)}
        />
      );
    }

    const liberalCount = gameState.chancellorHand.filter(p => p === 'liberal').length;
    const fascistCount = gameState.chancellorHand.filter(p => p === 'fascist').length;

    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">
            Chancellor: Choose Policy to Enact
          </h1>

          <div className="bg-green-900/30 border border-green-600 rounded-lg p-4 mb-6">
            <p className="text-lg">
              <span className="font-bold">{currentPlayer.name}</span>, you received 2 policies.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Select ONE to enact. The other will be discarded.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              ({liberalCount} Liberal, {fascistCount} Fascist)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {gameState.chancellorHand.map((policy, index) => (
              <PolicyCard
                key={index}
                policy={policy}
                index={index}
                onSelect={setSelectedPolicy}
                selected={selectedPolicy}
              />
            ))}
          </div>

          {gameState.vetoUnlocked && (
            <div className="mb-4">
              <Button
                onClick={() => {
                  // TODO: Implement veto logic
                  alert('Veto not yet implemented');
                }}
                variant="danger"
                className="w-full"
              >
                Propose Veto
              </Button>
            </div>
          )}

          <Button
            onClick={() => onChancellorEnact(selectedPolicy)}
            disabled={selectedPolicy === null}
            variant="success"
            className="w-full"
          >
            Enact Selected Policy
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
