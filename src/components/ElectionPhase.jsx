import { useState } from 'react';
import { Button } from './Button';
import { PrivacyScreen } from './PrivacyScreen';
import { isEligibleChancellor } from '../utils/gameLogic';

export function ElectionPhase({ gameState, onNominateChancellor, onCastVote, onResolveElection }) {
  const [votingPlayerIndex, setVotingPlayerIndex] = useState(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const president = gameState.players.find(p => p.id === gameState.currentPresident);
  const alivePlayers = gameState.players.filter(p => p.isAlive);
  const hasVoted = (playerId) => gameState.votes.some(v => v.playerId === playerId);

  // Nomination phase
  if (!gameState.nominatedChancellor) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">
            Chancellor Nomination
          </h1>

          <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4 mb-6">
            <p className="text-lg">
              <span className="font-bold text-blue-400">{president.name}</span> is President
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Select a Chancellor candidate
            </p>
          </div>

          <div className="space-y-3">
            {gameState.players.map(player => {
              const eligible = isEligibleChancellor(player.id, gameState);
              const isPresident = player.id === gameState.currentPresident;

              return (
                <button
                  key={player.id}
                  onClick={() => eligible && onNominateChancellor(player.id)}
                  disabled={!eligible}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    eligible
                      ? 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
                      : 'bg-gray-800 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{player.name}</span>
                    <div className="text-sm text-gray-400">
                      {isPresident && '(President)'}
                      {!player.isAlive && '(Dead)'}
                      {player.id === gameState.lastElectedChancellor && '(Last Chancellor)'}
                      {player.id === gameState.lastElectedPresident &&
                        alivePlayers.length > 5 &&
                        '(Term Limited)'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const nominee = gameState.players.find(p => p.id === gameState.nominatedChancellor);

  // Voting phase
  if (votingPlayerIndex === null) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">
            Vote on Government
          </h1>

          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <p className="text-lg mb-2">
              <span className="font-bold text-blue-400">{president.name}</span> (President)
            </p>
            <p className="text-lg">
              <span className="font-bold text-green-400">{nominee.name}</span> (Chancellor)
            </p>
          </div>

          <Button
            onClick={() => {
              setVotingPlayerIndex(0);
              setShowPrivacy(true);
            }}
            variant="primary"
            className="w-full"
          >
            Begin Voting
          </Button>
        </div>
      </div>
    );
  }

  // Individual voting
  const votingPlayer = alivePlayers[votingPlayerIndex];

  if (showPrivacy) {
    return (
      <PrivacyScreen
        playerName={votingPlayer.name}
        onContinue={() => setShowPrivacy(false)}
      />
    );
  }

  if (!hasVoted(votingPlayer.id)) {
    const handleVote = (vote) => {
      onCastVote(votingPlayer.id, vote);

      if (votingPlayerIndex < alivePlayers.length - 1) {
        setVotingPlayerIndex(votingPlayerIndex + 1);
        setShowPrivacy(true);
      } else {
        setShowResults(true);
      }
    };

    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-6">
            {votingPlayer.name}
          </h1>

          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <p className="text-center text-lg mb-4">
              Vote for this government?
            </p>
            <p className="text-center text-gray-400">
              President: <span className="font-bold">{president.name}</span><br />
              Chancellor: <span className="font-bold">{nominee.name}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => handleVote('ja')} variant="success" className="text-2xl py-8">
              JA!
            </Button>
            <Button onClick={() => handleVote('nein')} variant="danger" className="text-2xl py-8">
              NEIN
            </Button>
          </div>

          <p className="text-center text-gray-500 mt-4">
            Vote {votingPlayerIndex + 1} of {alivePlayers.length}
          </p>
        </div>
      </div>
    );
  }

  // Show results
  if (showResults) {
    const jaVotes = gameState.votes.filter(v => v.vote === 'ja').length;
    const neinVotes = gameState.votes.filter(v => v.vote === 'nein').length;
    const passed = jaVotes > neinVotes;

    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">
            Vote Results
          </h1>

          <div className={`rounded-lg p-6 mb-6 ${passed ? 'bg-green-900/30 border border-green-600' : 'bg-red-900/30 border border-red-600'}`}>
            <p className="text-2xl font-bold text-center mb-4">
              {passed ? '✓ PASSED' : '✗ FAILED'}
            </p>
            <div className="text-center text-xl mb-4">
              <span className="text-green-400">{jaVotes} Ja!</span>
              {' - '}
              <span className="text-red-400">{neinVotes} Nein</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="font-bold mb-3">Individual Votes:</h2>
            <div className="space-y-2">
              {gameState.votes.map(vote => {
                const player = gameState.players.find(p => p.id === vote.playerId);
                return (
                  <div key={vote.playerId} className="flex justify-between">
                    <span>{player.name}</span>
                    <span className={vote.vote === 'ja' ? 'text-green-400' : 'text-red-400'}>
                      {vote.vote.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {!passed && gameState.electionTracker === 2 && (
            <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 mb-6">
              <p className="text-yellow-100">
                ⚠️ Warning: One more failed election will cause CHAOS (top policy enacted)
              </p>
            </div>
          )}

          <Button onClick={onResolveElection} variant="primary" className="w-full">
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
