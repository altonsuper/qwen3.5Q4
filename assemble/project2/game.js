<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Interactive Game</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
        }

        .game-container {
            background: rgba(0, 0, 0, 0.8);
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 0 30px rgba(0, 255, 65, 0.2);
            text-align: center;
            max-width: 400px;
            width: 90%;
        }

        h1 {
            color: #00ff41;
            margin-bottom: 20px;
            font-size: 24px;
            text-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
        }

        .score-board {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
            background: rgba(0, 0, 0, 0.5);
            padding: 15px;
            border-radius: 10px;
        }

        .score-item {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .score-label {
            font-size: 12px;
            color: #888;
        }

        .score-value {
            font-size: 28px;
            font-weight: bold;
            color: #fff;
        }

        .game-area {
            margin: 20px 0;
            min-height: 150px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .game-area::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(0, 255, 65, 0.3), rgba(0, 255, 65, 0.1));
            transform: translate(-50%, -50%);
            border-radius: 10px;
            pointer-events: none;
        }

        .game-btn {
            background: linear-gradient(135deg, #00ff41, #00cc33);
            border: none;
            padding: 15px 40px;
            font-size: 20px;
            color: #000;
            font-weight: bold;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(0, 255, 65, 0.3);
        }

        .game-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 255, 65, 0.5);
        }

        .game-btn:active {
            transform: translateY(1px);
        }

        .game-btn:disabled {
            background: #555;
            color: #888;
            cursor: not-allowed;
            box-shadow: none;
        }

        .game-message {
            margin-top: 15px;
            font-size: 14px;
            color: #aaa;
        }
    </style>
</head>
<body>
    <div class="game-container">
        <h1>Click to Play!</h1>
        
        <div class="score-board">
            <div class="score-item">
                <span class="score-label">Score</span>
                <span class="score-value" id="score">0</span>
            </div>
            <div class="score-item">
                <span class="score-label">Level</span>
                <span class="score-value" id="level">1</span>
            </div>
        </div>

        <div class="game-area">
            <button class="game-btn" id="gameBtn">Click Me!</button>
        </div>

        <div class="game-message">
            <p>Click the button to start!</p>
        </div>
    </div>

    <script>
        // JS - Game Logic
        document.addEventListener('DOMContentLoaded', () => {
            const scoreElement = document.getElementById('score');
            const levelElement = document.getElementById('level');
            const gameBtn = document.getElementById('gameBtn');
            const gameArea = document.querySelector('.game-area');
            const gameMessage = document.querySelector('.game-message');

            let score = 0;
            let level = 1;
            let isPlaying = false;
            let gameInterval;

            // Game logic
            function startGame() {
                score = 0;
                level = 1;
                isPlaying = true;
                gameInterval = setInterval(gameLoop, 1000);
                gameBtn.disabled = false;
                gameArea.style.opacity = '0.5';
                gameMessage.textContent = `Level ${level} - Click to play!`;
            }

            function gameLoop() {
                if (!isPlaying) return;

                // Increase score
                score++;
                scoreElement.textContent = score;

                // Level up every 100 points
                if (score % 100 === 0) {
                    level++;
                    levelElement.textContent = level;
                    gameMessage.textContent = `Level ${level} - Click to play!`;
                }

                // Game over condition
                if (score >= 100) {
                    clearInterval(gameInterval);
                    isPlaying = false;
                    gameBtn.textContent = "Game Over!";
                    gameBtn.style.backgroundColor = "#ff4444";
                    gameBtn.style.color = "#fff";
                    gameMessage.textContent = "You reached the goal!";
                }
            }

            // Click handler
            gameBtn.addEventListener('click', () => {
                if (!isPlaying) return;

                // Increase score
                score++;
                scoreElement.textContent = score;

                // Level up every 100 points
                if (score % 100 === 0) {
                    level++;
                    levelElement.textContent = level;
                    gameMessage.textContent = `Level ${level} - Click to play!`;
                }

                // Game over condition
                if (score >= 100) {
                    clearInterval(gameInterval);
                    isPlaying = false;
                    gameBtn.textContent = "Game Over!";
                    gameBtn.style.backgroundColor = "#ff4444";
                    gameBtn.style.color = "#fff";
                    gameMessage.textContent = "You reached the goal!";
                }
            });

            // Start the game when DOM is loaded
            startGame();
        });
    </script>
</body>
</html>