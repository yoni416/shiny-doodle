import { useState } from 'react';
import { Button } from './Button';
import { PrivacyScreen } from './PrivacyScreen';
import { getPartyMembership } from '../utils/gameLogic';
import { drawCards } from '../utils/deckUtils';

export function ExecutivePhase({ gameState, onExecutePower }) {
  const [showPrivacy, setShowPrivacy] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [investigationResult, setInvestigationResult] = useState(null);
  const [peekedPolicies, setPeekedPolicies] = useState(null);

  const president = gameState.players.find(p => p.id === gameState.currentPresident);
  const power = gameState.currentExecutivePower;

  const handleSelectPlayer = (playerId) => {
    setSelectedPlayer(playerId);

    if (power === 'investigate') {
      const target = gameState.players.find(p => p.id === playerId);
      const party = getPartyMembership(target.role);
      setInvestigationResult({ player: target, party });
    }
  };

  const handlePolicyPeek = () => {
    const { drawnCards } = drawCards(gameState.drawPile, 3);
    setPeekedPolicies(drawnCards);
  };

  const handleConfirm = () => {
    onExecutePower(selectedPlayer, {
      investigationResult,
      peekedPolicies,
    });
  };

  if (showPrivacy) {
    return (
      <PrivacyScreen
        playerName={president.name}
        onContinue={() => {
          setShowPrivacy(false);
          if (power === 'policy_peek') {
            handlePolicyPeek();
          }
        }}
      />
    );
  }

  const PowerTitle = () => {
    switch (power) {
      case 'investigate':
        return 'Investigate Loyalty';
      case 'special_election':
        return 'Call Special Election';
      case 'policy_peek':
        return 'Policy Peek';
      case 'execution':
      case 'execution_veto':
        return 'Execution';
      default:
        return 'Executive Action';
    }
  };

  // Investigation
  if (power === 'investigate' && !investigationResult) {
    const eligiblePlayers = gameState.players.filter(
      p => p.isAlive && p.id !== gameState.currentPresident && !p.hasBeenInvestigated
    );

    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">
            <PowerTitle />
          </h1>

          <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-4 mb-6">
            <p className="text-lg">
              <span className="font-bold">{president.name}</span>, select a player to investigate.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              You will see their Party Membership (Liberal or Fascist), not their specific role.
            </p>
          </div>

          <div className="space-y-3">
            {eligiblePlayers.map(player => (
              <button
                key={player.id}
                onClick={() => handleSelectPlayer(player.id)}
                className="w-full p-4 rounded-lg text-left bg-gray-700 hover:bg-gray-600 transition-all"
              >
                <span className="text-lg font-semibold">{player.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Investigation Result
  if (power === 'investigate' && investigationResult) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-6">
            Investigation Result
          </h1>

          <div className={`rounded-lg p-8 mb-6 text-center ${
            investigationResult.party === 'liberal'
              ? 'bg-blue-900/50 border-2 border-blue-500'
              : 'bg-red-900/50 border-2 border-red-500'
          }`}>
            <p className="text-xl mb-4">
              <span className="font-bold">{investigationResult.player.name}</span> is a
            </p>
            <p className={`text-4xl font-bold uppercase ${
              investigationResult.party === 'liberal' ? 'text-blue-400' : 'text-red-400'
            }`}>
              {investigationResult.party}
            </p>
          </div>

          <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-100">
              ℹ️ You may share this information publicly, but you're not required to tell the truth.
            </p>
          </div>

          <Button onClick={handleConfirm} variant="primary" className="w-full">
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // Special Election
  if (power === 'special_election') {
    const eligiblePlayers = gameState.players.filter(
      p => p.isAlive && p.id !== gameState.currentPresident
    );

    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">
            <PowerTitle />
          </h1>

          <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-4 mb-6">
            <p className="text-lg">
              <span className="font-bold">{president.name}</span>, choose the next Presidential Candidate.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              After their turn, the Presidency returns to the normal rotation.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {eligiblePlayers.map(player => (
              <button
                key={player.id}
                onClick={() => setSelectedPlayer(player.id)}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  selectedPlayer === player.id
                    ? 'bg-purple-600 ring-2 ring-purple-400'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <span className="text-lg font-semibold">{player.name}</span>
              </button>
            ))}
          </div>

          <Button
            onClick={handleConfirm}
            disabled={!selectedPlayer}
            variant="primary"
            className="w-full"
          >
            Confirm Selection
          </Button>
        </div>
      </div>
    );
  }

  // Policy Peek
  if (power === 'policy_peek' || power === 'execution_veto') {
    if (power === 'policy_peek' && peekedPolicies) {
      return (
        <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
          <div className="max-w-md w-full">
            <h1 className="text-3xl font-bold text-center mb-6">
              Policy Peek
            </h1>

            <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-4 mb-6">
              <p className="text-center">Top 3 policies in the deck:</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {peekedPolicies.map((policy, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl text-center ${
                    policy === 'liberal'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-700'
                      : 'bg-gradient-to-br from-red-700 to-red-900'
                  }`}
                >
                  <div className="text-3xl mb-2">
                    {policy === 'liberal' ? '🔵' : '🔴'}
                  </div>
                  <div className="text-sm font-bold text-white uppercase">
                    {policy}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-100">
                ℹ️ You may share this information, but you're not required to tell the truth.
              </p>
            </div>

            <Button onClick={handleConfirm} variant="primary" className="w-full">
              Continue
            </Button>
          </div>
        </div>
      );
    }
  }

  // Execution
  if (power === 'execution' || (power === 'execution_veto' && !peekedPolicies)) {
    const eligiblePlayers = gameState.players.filter(
      p => p.isAlive && p.id !== gameState.currentPresident
    );

    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6 text-red-500">
            Execution
          </h1>

          <div className="bg-red-900/30 border border-red-600 rounded-lg p-4 mb-6">
            <p className="text-lg">
              <span className="font-bold">{president.name}</span>, choose a player to execute.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              ⚠️ This action is permanent. Dead players cannot vote or hold office.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {eligiblePlayers.map(player => (
              <button
                key={player.id}
                onClick={() => setSelectedPlayer(player.id)}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  selectedPlayer === player.id
                    ? 'bg-red-600 ring-2 ring-red-400'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <span className="text-lg font-semibold">{player.name}</span>
              </button>
            ))}
          </div>

          <Button
            onClick={handleConfirm}
            disabled={!selectedPlayer}
            variant="danger"
            className="w-full"
          >
            Execute Selected Player
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
