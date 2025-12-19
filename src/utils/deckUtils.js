import { DECK_CONFIG, MIN_CARDS_BEFORE_RESHUFFLE } from '../constants/gameConfig';

// Shuffle an array using Fisher-Yates algorithm
export function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Create a new deck
export function createDeck() {
  const deck = [];
  for (let i = 0; i < DECK_CONFIG.liberal; i++) {
    deck.push('liberal');
  }
  for (let i = 0; i < DECK_CONFIG.fascist; i++) {
    deck.push('fascist');
  }
  return shuffle(deck);
}

// Check if deck needs reshuffling
export function needsReshuffle(drawPile) {
  return drawPile.length < MIN_CARDS_BEFORE_RESHUFFLE;
}

// Reshuffle discard into draw pile
export function reshuffleDeck(drawPile, discardPile) {
  const combined = [...drawPile, ...discardPile];
  return {
    drawPile: shuffle(combined),
    discardPile: [],
  };
}

// Draw cards from the deck
export function drawCards(drawPile, count) {
  return {
    drawnCards: drawPile.slice(0, count),
    remainingDeck: drawPile.slice(count),
  };
}
