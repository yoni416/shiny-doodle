class TicTacToe {
    constructor() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.difficulty = 'hard';
        this.scores = {
            player: 0,
            ai: 0,
            draw: 0
        };

        this.winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        this.cells = document.querySelectorAll('.cell');
        this.statusDisplay = document.querySelector('.status');
        this.resetBtn = document.getElementById('resetBtn');
        this.difficultySelect = document.getElementById('difficultySelect');
        this.playerScoreDisplay = document.getElementById('playerScore');
        this.aiScoreDisplay = document.getElementById('aiScore');
        this.drawScoreDisplay = document.getElementById('drawScore');

        this.init();
    }

    init() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });

        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.difficultySelect.addEventListener('change', (e) => {
            this.difficulty = e.target.value;
        });

        this.updateScoreDisplay();
    }

    handleCellClick(event) {
        const cell = event.target;
        const index = parseInt(cell.getAttribute('data-index'));

        if (this.board[index] !== '' || !this.gameActive || this.currentPlayer === 'O') {
            return;
        }

        this.makeMove(index, 'X');

        if (this.gameActive) {
            setTimeout(() => this.aiMove(), 500);
        }
    }

    makeMove(index, player) {
        this.board[index] = player;
        this.cells[index].textContent = player;
        this.cells[index].classList.add(player.toLowerCase());
        this.cells[index].classList.add('taken');

        this.checkResult();
    }

    checkResult() {
        let roundWon = false;
        let winningCombination = null;

        for (let i = 0; i < this.winningConditions.length; i++) {
            const [a, b, c] = this.winningConditions[i];
            if (this.board[a] === '' || this.board[b] === '' || this.board[c] === '') {
                continue;
            }
            if (this.board[a] === this.board[b] && this.board[b] === this.board[c]) {
                roundWon = true;
                winningCombination = [a, b, c];
                break;
            }
        }

        if (roundWon) {
            const winner = this.board[winningCombination[0]];
            this.statusDisplay.textContent = winner === 'X' ? 'You win! 🎉' : 'AI wins!';
            this.gameActive = false;

            winningCombination.forEach(index => {
                this.cells[index].classList.add('winner');
            });

            if (winner === 'X') {
                this.scores.player++;
            } else {
                this.scores.ai++;
            }
            this.updateScoreDisplay();
            return;
        }

        if (!this.board.includes('')) {
            this.statusDisplay.textContent = "It's a draw!";
            this.gameActive = false;
            this.scores.draw++;
            this.updateScoreDisplay();
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.statusDisplay.textContent = this.currentPlayer === 'X' ? 'Your turn!' : 'AI is thinking...';
    }

    aiMove() {
        if (!this.gameActive) return;

        let move;

        switch(this.difficulty) {
            case 'easy':
                move = this.getRandomMove();
                break;
            case 'medium':
                move = Math.random() < 0.5 ? this.getBestMove() : this.getRandomMove();
                break;
            case 'hard':
                move = this.getBestMove();
                break;
            default:
                move = this.getBestMove();
        }

        this.makeMove(move, 'O');
    }

    getRandomMove() {
        const availableMoves = this.board
            .map((cell, index) => cell === '' ? index : null)
            .filter(val => val !== null);

        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    getBestMove() {
        let bestScore = -Infinity;
        let bestMove = 0;

        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'O';
                let score = this.minimax(this.board, 0, false);
                this.board[i] = '';

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    }

    minimax(board, depth, isMaximizing) {
        const result = this.checkWinner();

        if (result !== null) {
            if (result === 'O') return 10 - depth;
            if (result === 'X') return depth - 10;
            return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = this.minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = this.minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    checkWinner() {
        for (let i = 0; i < this.winningConditions.length; i++) {
            const [a, b, c] = this.winningConditions[i];
            if (this.board[a] === '' || this.board[b] === '' || this.board[c] === '') {
                continue;
            }
            if (this.board[a] === this.board[b] && this.board[b] === this.board[c]) {
                return this.board[a];
            }
        }

        if (!this.board.includes('')) {
            return 'draw';
        }

        return null;
    }

    resetGame() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.statusDisplay.textContent = 'Your turn!';

        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'taken', 'winner');
        });
    }

    updateScoreDisplay() {
        this.playerScoreDisplay.textContent = this.scores.player;
        this.aiScoreDisplay.textContent = this.scores.ai;
        this.drawScoreDisplay.textContent = this.scores.draw;
    }
}

const game = new TicTacToe();
