import { ROLE_DISTRIBUTIONS, ROLES, WIN_CONDITIONS, getBoardConfig } from '../constants/gameConfig';
import { shuffle } from './deckUtils';

// Assign roles to players
export function assignRoles(playerNames) {
  const playerCount = playerNames.length;
  const distribution = ROLE_DISTRIBUTIONS[playerCount];

  if (!distribution) {
    throw new Error(`Invalid player count: ${playerCount}`);
  }

  const roles = [];

  // Add liberals
  for (let i = 0; i < distribution.liberals; i++) {
    roles.push(ROLES.LIBERAL);
  }

  // Add fascists
  for (let i = 0; i < distribution.fascists; i++) {
    roles.push(ROLES.FASCIST);
  }

  // Add Hitler
  roles.push(ROLES.HITLER);

  // Shuffle roles
  const shuffledRoles = shuffle(roles);

  // Create player objects
  return playerNames.map((name, index) => ({
    id: index,
    name,
    role: shuffledRoles[index],
    isAlive: true,
    hasBeenInvestigated: false,
  }));
}

// Get party membership from role
export function getPartyMembership(role) {
  return role === ROLES.LIBERAL ? 'liberal' : 'fascist';
}

// Get night information for a player
export function getNightInfo(player, allPlayers, playerCount) {
  const role = player.role;

  if (role === ROLES.LIBERAL) {
    return {
      role: 'Liberal',
      message: 'You are a Liberal. Work to enact 5 Liberal policies or eliminate Hitler.',
      teammates: [],
    };
  }

  // For 5-6 players: Fascists see each other, Hitler knows the Fascist
  if (playerCount <= 6) {
    if (role === ROLES.HITLER) {
      const fascist = allPlayers.find(p => p.role === ROLES.FASCIST);
      return {
        role: 'Hitler',
        message: 'You are Hitler. Remain hidden and get elected Chancellor after 3 Fascist policies.',
        teammates: [fascist],
      };
    } else if (role === ROLES.FASCIST) {
      const hitler = allPlayers.find(p => p.role === ROLES.HITLER);
      return {
        role: 'Fascist',
        message: 'You are a Fascist. Help enact 6 Fascist policies or elect Hitler as Chancellor.',
        teammates: [hitler],
      };
    }
  }

  // For 7-10 players: Fascists see each other and Hitler, but Hitler doesn't know his team
  if (playerCount >= 7) {
    if (role === ROLES.HITLER) {
      return {
        role: 'Hitler',
        message: 'You are Hitler. You do not know who your teammates are. Get elected Chancellor after 3 Fascist policies.',
        teammates: [],
      };
    } else if (role === ROLES.FASCIST) {
      const teammates = allPlayers.filter(p =>
        (p.role === ROLES.FASCIST || p.role === ROLES.HITLER) && p.id !== player.id
      );
      const hitler = allPlayers.find(p => p.role === ROLES.HITLER);
      return {
        role: 'Fascist',
        message: `You are a Fascist. Hitler is ${hitler.name}. Help enact 6 Fascist policies or elect Hitler as Chancellor.`,
        teammates,
      };
    }
  }
}

// Check if a player is eligible to be Chancellor
export function isEligibleChancellor(playerId, gameState) {
  const player = gameState.players.find(p => p.id === playerId);

  if (!player || !player.isAlive) return false;
  if (playerId === gameState.currentPresident) return false;

  // Can't be last elected Chancellor
  if (playerId === gameState.lastElectedChancellor) return false;

  // Can't be last elected President (term limit)
  if (playerId === gameState.lastElectedPresident) {
    // Exception: if 5 or fewer alive, only last Chancellor is ineligible
    const alivePlayers = gameState.players.filter(p => p.isAlive);
    if (alivePlayers.length > 5) {
      return false;
    }
  }

  return true;
}

// Check win conditions
export function checkWinCondition(gameState) {
  // Liberal policy win
  if (gameState.liberalPolicies >= WIN_CONDITIONS.liberalPolicies) {
    return { winner: 'liberal', reason: 'Enacted 5 Liberal policies' };
  }

  // Fascist policy win
  if (gameState.fascistPolicies >= WIN_CONDITIONS.fascistPolicies) {
    return { winner: 'fascist', reason: 'Enacted 6 Fascist policies' };
  }

  // Hitler killed win
  const hitler = gameState.players.find(p => p.role === ROLES.HITLER);
  if (hitler && !hitler.isAlive) {
    return { winner: 'liberal', reason: 'Hitler was executed' };
  }

  return null;
}

// Get the next president in rotation
export function getNextPresident(gameState) {
  const alivePlayers = gameState.players.filter(p => p.isAlive);
  const currentIndex = alivePlayers.findIndex(p => p.id === gameState.currentPresident);
  const nextIndex = (currentIndex + 1) % alivePlayers.length;
  return alivePlayers[nextIndex].id;
}

// Get executive power for current fascist policy count
export function getCurrentExecutivePower(gameState) {
  const boardConfig = getBoardConfig(gameState.players.length);
  const policyIndex = gameState.fascistPolicies - 1;

  if (policyIndex < 0 || policyIndex >= boardConfig.length) {
    return null;
  }

  return boardConfig[policyIndex];
}
