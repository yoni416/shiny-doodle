import { useState, useEffect, useCallback } from 'react';
import { PHASES } from '../constants/gameConfig';
import { assignRoles, getNextPresident, checkWinCondition, getCurrentExecutivePower } from '../utils/gameLogic';
import { createDeck, needsReshuffle, reshuffleDeck, drawCards } from '../utils/deckUtils';

const STORAGE_KEY = 'secret_hitler_game_state';
const HISTORY_KEY = 'secret_hitler_game_history';

const initialState = {
  phase: PHASES.SETUP,
  players: [],
  currentPresident: null,
  currentChancellor: null,
  lastElectedPresident: null,
  lastElectedChancellor: null,
  specialElectionPresident: null, // Temporary president from special election
  nominatedChancellor: null,
  votes: [],
  liberalPolicies: 0,
  fascistPolicies: 0,
  electionTracker: 0,
  drawPile: [],
  discardPile: [],
  presidentHand: [],
  chancellorHand: [],
  gameLog: [],
  winner: null,
  winReason: null,
  currentExecutivePower: null,
  vetoUnlocked: false,
  // For pass-and-play
  currentViewingPlayer: null,
  showPrivacyScreen: true,
};

export function useGameState() {
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  // Save state to history for undo functionality
  const saveToHistory = useCallback(() => {
    setHistory(prev => [...prev, JSON.stringify(gameState)]);
  }, [gameState]);

  // Undo last action
  const undo = useCallback(() => {
    if (history.length > 0) {
      const previousState = JSON.parse(history[history.length - 1]);
      setGameState(previousState);
      setHistory(prev => prev.slice(0, -1));
    }
  }, [history]);

  // Add log entry
  const addLog = useCallback((message, isPublic = true) => {
    setGameState(prev => ({
      ...prev,
      gameLog: [...prev.gameLog, { message, timestamp: Date.now(), isPublic }],
    }));
  }, []);

  // Start new game
  const startNewGame = useCallback((playerNames) => {
    const players = assignRoles(playerNames);
    const deck = createDeck();

    const newState = {
      ...initialState,
      phase: PHASES.NIGHT,
      players,
      currentPresident: players[0].id,
      drawPile: deck,
      currentViewingPlayer: 0,
      showPrivacyScreen: false,
    };

    setGameState(newState);
    setHistory([]);
    addLog('Game started');
  }, [addLog]);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState(initialState);
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  // Phase transitions
  const startElectionPhase = useCallback(() => {
    saveToHistory();
    setGameState(prev => ({
      ...prev,
      phase: PHASES.ELECTION,
      nominatedChancellor: null,
      votes: [],
      showPrivacyScreen: true,
    }));
  }, [saveToHistory]);

  const nominateChancellor = useCallback((chancellorId) => {
    saveToHistory();
    setGameState(prev => ({
      ...prev,
      nominatedChancellor: chancellorId,
    }));
    addLog(`${gameState.players.find(p => p.id === gameState.currentPresident).name} nominated ${gameState.players.find(p => p.id === chancellorId).name} for Chancellor`);
  }, [saveToHistory, addLog, gameState.players, gameState.currentPresident]);

  const castVote = useCallback((playerId, vote) => {
    saveToHistory();
    setGameState(prev => ({
      ...prev,
      votes: [...prev.votes, { playerId, vote }],
    }));
  }, [saveToHistory]);

  const resolveElection = useCallback(() => {
    saveToHistory();
    const jaVotes = gameState.votes.filter(v => v.vote === 'ja').length;
    const neinVotes = gameState.votes.filter(v => v.vote === 'nein').length;
    const passed = jaVotes > neinVotes;

    const voteDetails = gameState.votes.map(v => {
      const player = gameState.players.find(p => p.id === v.playerId);
      return `${player.name}: ${v.vote.toUpperCase()}`;
    }).join(', ');

    addLog(`Vote: ${voteDetails}. Result: ${passed ? 'PASSED' : 'FAILED'}`);

    if (passed) {
      // Check Hitler win condition
      if (gameState.fascistPolicies >= 3) {
        const nominatedPlayer = gameState.players.find(p => p.id === gameState.nominatedChancellor);
        if (nominatedPlayer.role === 'hitler') {
          setGameState(prev => ({
            ...prev,
            phase: PHASES.GAME_OVER,
            winner: 'fascist',
            winReason: 'Hitler was elected Chancellor',
            currentChancellor: gameState.nominatedChancellor,
          }));
          addLog('Hitler was elected Chancellor! Fascists win!');
          return;
        }
      }

      // Election passed - start legislative phase
      let { drawPile, discardPile } = gameState;

      // Check if reshuffle needed
      if (needsReshuffle(drawPile)) {
        const reshuffled = reshuffleDeck(drawPile, discardPile);
        drawPile = reshuffled.drawPile;
        discardPile = reshuffled.discardPile;
        addLog('Deck reshuffled');
      }

      // Draw 3 cards for president
      const { drawnCards, remainingDeck } = drawCards(drawPile, 3);

      setGameState(prev => ({
        ...prev,
        phase: PHASES.LEGISLATIVE,
        currentChancellor: gameState.nominatedChancellor,
        lastElectedPresident: gameState.currentPresident,
        lastElectedChancellor: gameState.nominatedChancellor,
        electionTracker: 0,
        drawPile: remainingDeck,
        discardPile,
        presidentHand: drawnCards,
        showPrivacyScreen: true,
      }));
    } else {
      // Election failed
      const newTracker = gameState.electionTracker + 1;

      if (newTracker >= 3) {
        // Chaos - enact top policy
        let { drawPile, discardPile } = gameState;

        if (needsReshuffle(drawPile)) {
          const reshuffled = reshuffleDeck(drawPile, discardPile);
          drawPile = reshuffled.drawPile;
          discardPile = reshuffled.discardPile;
          addLog('Deck reshuffled');
        }

        const topPolicy = drawPile[0];
        const newDrawPile = drawPile.slice(1);

        addLog(`CHAOS! Top policy enacted: ${topPolicy.toUpperCase()}`);

        const newState = {
          ...gameState,
          drawPile: newDrawPile,
          electionTracker: 0,
          lastElectedPresident: null,
          lastElectedChancellor: null,
        };

        if (topPolicy === 'liberal') {
          newState.liberalPolicies = gameState.liberalPolicies + 1;
        } else {
          newState.fascistPolicies = gameState.fascistPolicies + 1;
        }

        // Check win condition
        const winCondition = checkWinCondition(newState);
        if (winCondition) {
          setGameState({
            ...newState,
            phase: PHASES.GAME_OVER,
            winner: winCondition.winner,
            winReason: winCondition.reason,
          });
          addLog(`Game Over! ${winCondition.winner}s win: ${winCondition.reason}`);
          return;
        }

        // Move to next president
        const nextPres = getNextPresident(newState);
        setGameState({
          ...newState,
          currentPresident: nextPres,
          phase: PHASES.ELECTION,
          nominatedChancellor: null,
          votes: [],
        });
      } else {
        // Move to next president, increment tracker
        const nextPres = getNextPresident(gameState);
        setGameState(prev => ({
          ...prev,
          currentPresident: nextPres,
          electionTracker: newTracker,
          nominatedChancellor: null,
          votes: [],
        }));
      }
    }
  }, [saveToHistory, gameState, addLog]);

  const presidentDiscardPolicy = useCallback((policyIndex) => {
    saveToHistory();
    const discardedPolicy = gameState.presidentHand[policyIndex];
    const remainingCards = gameState.presidentHand.filter((_, i) => i !== policyIndex);

    setGameState(prev => ({
      ...prev,
      presidentHand: [],
      chancellorHand: remainingCards,
      discardPile: [...prev.discardPile, discardedPolicy],
      showPrivacyScreen: true,
    }));
  }, [saveToHistory, gameState.presidentHand]);

  const chancellorEnactPolicy = useCallback((policyIndex) => {
    saveToHistory();
    const enactedPolicy = gameState.chancellorHand[policyIndex];
    const discardedPolicy = gameState.chancellorHand.filter((_, i) => i !== policyIndex)[0];

    addLog(`${enactedPolicy.toUpperCase()} policy enacted`);

    const newState = {
      ...gameState,
      chancellorHand: [],
      discardPile: [...gameState.discardPile, discardedPolicy],
    };

    if (enactedPolicy === 'liberal') {
      newState.liberalPolicies = gameState.liberalPolicies + 1;
    } else {
      newState.fascistPolicies = gameState.fascistPolicies + 1;

      // Check for veto unlock
      if (newState.fascistPolicies === 5) {
        newState.vetoUnlocked = true;
        addLog('Veto power unlocked');
      }

      // Check for executive power
      const power = getCurrentExecutivePower(newState);
      if (power) {
        newState.currentExecutivePower = power;
        newState.phase = PHASES.EXECUTIVE;
        setGameState(newState);
        return;
      }
    }

    // Check win condition
    const winCondition = checkWinCondition(newState);
    if (winCondition) {
      setGameState({
        ...newState,
        phase: PHASES.GAME_OVER,
        winner: winCondition.winner,
        winReason: winCondition.reason,
      });
      addLog(`Game Over! ${winCondition.winner}s win: ${winCondition.reason}`);
      return;
    }

    // Move to next round
    const nextPres = gameState.specialElectionPresident
      ? gameState.specialElectionPresident
      : getNextPresident(newState);

    setGameState({
      ...newState,
      currentPresident: nextPres,
      specialElectionPresident: null,
      phase: PHASES.ELECTION,
      nominatedChancellor: null,
      votes: [],
    });
  }, [saveToHistory, gameState, addLog]);

  const executeExecutivePower = useCallback((targetPlayerId, data) => {
    saveToHistory();

    switch (gameState.currentExecutivePower) {
      case 'investigate': {
        const target = gameState.players.find(p => p.id === targetPlayerId);
        addLog(`${gameState.players.find(p => p.id === gameState.currentPresident).name} investigated ${target.name}`);
        break;
      }
      case 'special_election': {
        const target = gameState.players.find(p => p.id === targetPlayerId);
        addLog(`${gameState.players.find(p => p.id === gameState.currentPresident).name} called special election, ${target.name} is temporary President`);
        setGameState(prev => ({
          ...prev,
          specialElectionPresident: gameState.currentPresident,
          currentPresident: targetPlayerId,
          currentExecutivePower: null,
          phase: PHASES.ELECTION,
        }));
        return;
      }
      case 'policy_peek':
        addLog(`${gameState.players.find(p => p.id === gameState.currentPresident).name} peeked at top 3 policies`);
        break;
      case 'execution':
      case 'execution_veto': {
        const target = gameState.players.find(p => p.id === targetPlayerId);
        const updatedPlayers = gameState.players.map(p =>
          p.id === targetPlayerId ? { ...p, isAlive: false } : p
        );
        addLog(`${gameState.players.find(p => p.id === gameState.currentPresident).name} executed ${target.name}`);

        const newState = {
          ...gameState,
          players: updatedPlayers,
          currentExecutivePower: null,
        };

        // Check win condition (Hitler killed)
        const winCondition = checkWinCondition(newState);
        if (winCondition) {
          setGameState({
            ...newState,
            phase: PHASES.GAME_OVER,
            winner: winCondition.winner,
            winReason: winCondition.reason,
          });
          addLog(`Game Over! ${winCondition.winner}s win: ${winCondition.reason}`);
          return;
        }

        setGameState({
          ...newState,
          phase: PHASES.ELECTION,
        });
        return;
      }
    }

    // Move to next round
    const nextPres = gameState.specialElectionPresident
      ? gameState.specialElectionPresident
      : getNextPresident(gameState);

    setGameState(prev => ({
      ...prev,
      currentPresident: nextPres,
      specialElectionPresident: null,
      currentExecutivePower: null,
      phase: PHASES.ELECTION,
    }));
  }, [saveToHistory, gameState, addLog]);

  return {
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
    canUndo: history.length > 0,
    setGameState,
    addLog,
  };
}
