// Role distributions based on player count
export const ROLE_DISTRIBUTIONS = {
  5: { liberals: 3, fascists: 1, hitler: 1 },
  6: { liberals: 4, fascists: 1, hitler: 1 },
  7: { liberals: 4, fascists: 2, hitler: 1 },
  8: { liberals: 5, fascists: 2, hitler: 1 },
  9: { liberals: 5, fascists: 3, hitler: 1 },
  10: { liberals: 6, fascists: 3, hitler: 1 },
};

// Fascist board configurations
// Powers: null, 'investigate', 'special_election', 'policy_peek', 'execution', 'veto_unlock'
export const BOARD_CONFIGURATIONS = {
  '5-6': [null, null, 'policy_peek', 'execution', 'execution_veto'],
  '7-8': [null, 'investigate', 'special_election', 'execution', 'execution_veto'],
  '9-10': ['investigate', 'investigate', 'special_election', 'execution', 'execution_veto'],
};

// Get board configuration based on player count
export function getBoardConfig(playerCount) {
  if (playerCount <= 6) return BOARD_CONFIGURATIONS['5-6'];
  if (playerCount <= 8) return BOARD_CONFIGURATIONS['7-8'];
  return BOARD_CONFIGURATIONS['9-10'];
}

// Deck composition
export const DECK_CONFIG = {
  liberal: 6,
  fascist: 11,
};

// Win conditions
export const WIN_CONDITIONS = {
  liberalPolicies: 5,
  fascistPolicies: 6,
  hitlerElected: 3, // Fascist policies needed before Hitler election wins
};

// Game phases
export const PHASES = {
  SETUP: 'setup',
  NIGHT: 'night',
  ELECTION: 'election',
  LEGISLATIVE: 'legislative',
  EXECUTIVE: 'executive',
  GAME_OVER: 'game_over',
};

// Vote types
export const VOTES = {
  JA: 'ja',
  NEIN: 'nein',
};

// Party memberships
export const PARTIES = {
  LIBERAL: 'liberal',
  FASCIST: 'fascist',
};

// Roles
export const ROLES = {
  LIBERAL: 'liberal',
  FASCIST: 'fascist',
  HITLER: 'hitler',
};

// Executive powers
export const POWERS = {
  INVESTIGATE: 'investigate',
  SPECIAL_ELECTION: 'special_election',
  POLICY_PEEK: 'policy_peek',
  EXECUTION: 'execution',
  EXECUTION_VETO: 'execution_veto',
};

// Minimum cards for reshuffling
export const MIN_CARDS_BEFORE_RESHUFFLE = 3;
