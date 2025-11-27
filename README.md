# Tic Tac Toe - Play Against AI

A beautiful, interactive tic-tac-toe game where you play against an AI opponent with adjustable difficulty levels.

## Features

- **Three Difficulty Levels:**
  - **Easy**: AI makes random moves
  - **Medium**: AI alternates between optimal and random moves
  - **Hard**: AI uses minimax algorithm for unbeatable gameplay

- **Score Tracking**: Keep track of wins, losses, and draws
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Visual feedback for moves and wins
- **Clean UI**: Modern, gradient design with intuitive controls

## How to Play

1. Open `index.html` in your web browser
2. You play as **X** and go first
3. Click on any empty cell to make your move
4. The AI will respond automatically
5. First to get three in a row (horizontally, vertically, or diagonally) wins!
6. Use the difficulty selector to adjust AI difficulty
7. Click "New Game" to start over

## Game Rules

- Players alternate turns
- You cannot move on an occupied cell
- The game ends when:
  - A player gets three in a row (win)
  - All cells are filled with no winner (draw)

## Files

- `index.html` - Game structure and layout
- `style.css` - Styling and animations
- `game.js` - Game logic and AI implementation

## AI Implementation

The hard difficulty uses the **Minimax algorithm**, which:
- Evaluates all possible game states
- Chooses the move that maximizes AI's chances of winning
- Makes the AI virtually unbeatable

## Technologies

- Pure HTML5
- CSS3 with animations
- Vanilla JavaScript (no frameworks required)

Enjoy the game! 🎮
