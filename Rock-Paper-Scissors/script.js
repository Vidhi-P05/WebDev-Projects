class RockPaperScissorsGame {
    constructor() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.gamesPlayed = 0;
        this.playerWins = 0;
        
        this.choices = {
            rock: { emoji: '🪨', name: 'Rock' },
            paper: { emoji: '📄', name: 'Paper' },
            scissors: { emoji: '✂️', name: 'Scissors' }
        };
        
        this.gameRules = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };
        
        this.isPlaying = false;
        this.initializeGame();
    }
    
    initializeGame() {
        this.bindEventListeners();
        this.updateDisplay();
    }
    
    bindEventListeners() {
        // Choice buttons
        const choiceButtons = document.querySelectorAll('.choice-btn');
        choiceButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (!this.isPlaying) {
                    const choice = button.dataset.choice;
                    this.playRound(choice);
                }
            });
        });
        
        // Reset button
        const resetButton = document.getElementById('resetBtn');
        resetButton.addEventListener('click', () => {
            this.resetGame();
        });
        
        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            if (this.isPlaying) return;
            
            switch(e.key.toLowerCase()) {
                case 'r':
                    this.playRound('rock');
                    break;
                case 'p':
                    this.playRound('paper');
                    break;
                case 's':
                    this.playRound('scissors');
                    break;
                case ' ':
                    e.preventDefault();
                    this.resetGame();
                    break;
            }
        });
    }
    
    async playRound(playerChoice) {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.highlightSelectedChoice(playerChoice);
        
        // Show player choice immediately
        this.updatePlayerChoice(playerChoice);
        
        // Add suspense with computer "thinking"
        await this.showComputerThinking();
        
        // Generate computer choice
        const computerChoice = this.getRandomChoice();
        this.updateComputerChoice(computerChoice);
        
        // Determine winner after a short delay
        setTimeout(() => {
            const result = this.determineWinner(playerChoice, computerChoice);
            this.updateScore(result);
            this.showResult(result, playerChoice, computerChoice);
            this.updateStats();
            this.isPlaying = false;
            this.clearChoiceHighlight();
        }, 500);
    }
    
    highlightSelectedChoice(choice) {
        // Remove previous highlights
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Highlight selected choice
        const selectedBtn = document.querySelector(`[data-choice="${choice}"]`);
        selectedBtn.classList.add('selected');
    }
    
    clearChoiceHighlight() {
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    }
    
    updatePlayerChoice(choice) {
        const playerChoiceContainer = document.getElementById('playerChoice');
        const choiceData = this.choices[choice];
        
        playerChoiceContainer.innerHTML = `<div class="choice-emoji">${choiceData.emoji}</div>`;
        playerChoiceContainer.classList.add('active');
        
        setTimeout(() => {
            playerChoiceContainer.classList.remove('active');
        }, 600);
    }
    
    async showComputerThinking() {
        const computerChoiceContainer = document.getElementById('computerChoice');
        const thinkingEmojis = ['🤔', '💭', '⚡', '🎯'];
        let thinkingIndex = 0;
        
        return new Promise(resolve => {
            const thinkingInterval = setInterval(() => {
                computerChoiceContainer.innerHTML = `<div class="choice-emoji">${thinkingEmojis[thinkingIndex]}</div>`;
                thinkingIndex = (thinkingIndex + 1) % thinkingEmojis.length;
            }, 200);
            
            setTimeout(() => {
                clearInterval(thinkingInterval);
                resolve();
            }, 1200);
        });
    }
    
    updateComputerChoice(choice) {
        const computerChoiceContainer = document.getElementById('computerChoice');
        const choiceData = this.choices[choice];
        
        computerChoiceContainer.innerHTML = `<div class="choice-emoji">${choiceData.emoji}</div>`;
        computerChoiceContainer.classList.add('active');
        
        setTimeout(() => {
            computerChoiceContainer.classList.remove('active');
        }, 600);
    }
    
    getRandomChoice() {
        const choices = Object.keys(this.choices);
        return choices[Math.floor(Math.random() * choices.length)];
    }
    
    determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            return 'tie';
        }
        
        if (this.gameRules[playerChoice] === computerChoice) {
            return 'win';
        }
        
        return 'lose';
    }
    
    updateScore(result) {
        if (result === 'win') {
            this.playerScore++;
            this.playerWins++;
            this.animateScoreUpdate('playerScore');
        } else if (result === 'lose') {
            this.computerScore++;
            this.animateScoreUpdate('computerScore');
        }
        
        this.gamesPlayed++;
        this.updateScoreDisplay();
    }
    
    animateScoreUpdate(scoreId) {
        const scoreElement = document.getElementById(scoreId);
        scoreElement.classList.add('updated');
        
        setTimeout(() => {
            scoreElement.classList.remove('updated');
        }, 600);
    }
    
    updateScoreDisplay() {
        document.getElementById('playerScore').textContent = this.playerScore;
        document.getElementById('computerScore').textContent = this.computerScore;
    }
    
    showResult(result, playerChoice, computerChoice) {
        const resultText = document.getElementById('resultText');
        const playerChoiceData = this.choices[playerChoice];
        const computerChoiceData = this.choices[computerChoice];
        
        let message = '';
        let className = '';
        
        switch (result) {
            case 'win':
                message = `🎉 You Win! ${playerChoiceData.name} beats ${computerChoiceData.name}!`;
                className = 'win';
                break;
            case 'lose':
                message = `💔 You Lose! ${computerChoiceData.name} beats ${playerChoiceData.name}!`;
                className = 'lose';
                break;
            case 'tie':
                message = `🤝 It's a Tie! Both chose ${playerChoiceData.name}!`;
                className = 'tie';
                break;
        }
        
        // Clear previous classes
        resultText.classList.remove('win', 'lose', 'tie');
        
        // Add new class and message
        resultText.textContent = message;
        resultText.classList.add(className);
        
        // Add celebration effects for wins
        if (result === 'win') {
            this.createCelebrationEffect();
        }
    }
    
    createCelebrationEffect() {
        const celebrationEmojis = ['🎉', '🎊', '⭐', '✨', '🎈'];
        const container = document.querySelector('.container');
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const emoji = document.createElement('div');
                emoji.textContent = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
                emoji.style.cssText = `
                    position: absolute;
                    font-size: 2rem;
                    pointer-events: none;
                    z-index: 1000;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: celebrate 2s ease-out forwards;
                `;
                
                container.appendChild(emoji);
                
                setTimeout(() => {
                    emoji.remove();
                }, 2000);
            }, i * 100);
        }
        
        // Add CSS for celebration animation if not exists
        if (!document.querySelector('#celebration-style')) {
            const style = document.createElement('style');
            style.id = 'celebration-style';
            style.textContent = `
                @keyframes celebrate {
                    0% {
                        transform: translateY(0) scale(0) rotate(0deg);
                        opacity: 1;
                    }
                    50% {
                        transform: translateY(-50px) scale(1) rotate(180deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100px) scale(0) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    updateStats() {
        document.getElementById('gamesPlayed').textContent = this.gamesPlayed;
        
        const winRate = this.gamesPlayed > 0 ? Math.round((this.playerWins / this.gamesPlayed) * 100) : 0;
        document.getElementById('winRate').textContent = `${winRate}%`;
    }
    
    resetGame() {
        // Confirm reset if games have been played
        if (this.gamesPlayed > 0) {
            if (!confirm('Are you sure you want to reset the game? This will clear all scores and statistics.')) {
                return;
            }
        }
        
        this.playerScore = 0;
        this.computerScore = 0;
        this.gamesPlayed = 0;
        this.playerWins = 0;
        this.isPlaying = false;
        
        // Reset display
        this.updateScoreDisplay();
        this.updateStats();
        
        // Reset choices
        document.getElementById('playerChoice').innerHTML = '<div class="choice-placeholder">?</div>';
        document.getElementById('computerChoice').innerHTML = '<div class="choice-placeholder">?</div>';
        
        // Reset result
        const resultText = document.getElementById('resultText');
        resultText.textContent = 'Make your move!';
        resultText.classList.remove('win', 'lose', 'tie');
        
        // Clear choice highlights
        this.clearChoiceHighlight();
        
        // Add reset animation
        this.animateReset();
    }
    
    animateReset() {
        const gameArea = document.querySelector('.game-area');
        gameArea.style.transform = 'scale(0.95)';
        gameArea.style.opacity = '0.7';
        
        setTimeout(() => {
            gameArea.style.transform = 'scale(1)';
            gameArea.style.opacity = '1';
        }, 200);
    }
    
    updateDisplay() {
        this.updateScoreDisplay();
        this.updateStats();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new RockPaperScissorsGame();
    
    // Add some additional interactive features
    addInteractiveEffects();
    addSoundEffects();
});

// Additional interactive effects
function addInteractiveEffects() {
    // Add hover effects to choice containers
    const choiceContainers = document.querySelectorAll('.choice-container');
    choiceContainers.forEach(container => {
        container.addEventListener('mouseenter', () => {
            container.style.transform = 'scale(1.05)';
        });
        
        container.addEventListener('mouseleave', () => {
            container.style.transform = 'scale(1)';
        });
    });
    
    // Add floating particles effect
    createFloatingParticles();
    
    // Add title animation on click
    const gameTitle = document.querySelector('.game-title');
    gameTitle.addEventListener('click', () => {
        gameTitle.style.animation = 'none';
        setTimeout(() => {
            gameTitle.style.animation = 'titlePulse 2s ease-in-out infinite';
        }, 100);
    });
}

// Create floating particles in background
function createFloatingParticles() {
    const particleCount = 50;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
        `;
        
        document.body.appendChild(particle);
        particles.push({
            element: particle,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            opacity: Math.random() * 0.5 + 0.1
        });
    }
    
    function animateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = window.innerWidth;
            if (particle.x > window.innerWidth) particle.x = 0;
            if (particle.y < 0) particle.y = window.innerHeight;
            if (particle.y > window.innerHeight) particle.y = 0;
            
            // Update position
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
            particle.element.style.opacity = particle.opacity;
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// Add sound effects (using Web Audio API)
function addSoundEffects() {
    // Create audio context
    let audioContext;
    
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    // Play sound effect
    function playSound(frequency, duration, type = 'sine') {
        initAudio();
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }
    
    // Add sound effects to buttons
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            playSound(440, 0.1, 'square');
        });
    });
    
    // Add different sounds for results
    const originalShowResult = RockPaperScissorsGame.prototype.showResult;
    RockPaperScissorsGame.prototype.showResult = function(result, playerChoice, computerChoice) {
        // Call original method
        originalShowResult.call(this, result, playerChoice, computerChoice);
        
        // Play appropriate sound
        setTimeout(() => {
            switch (result) {
                case 'win':
                    playSound(523, 0.2, 'sine'); // C note
                    setTimeout(() => playSound(659, 0.2, 'sine'), 100); // E note
                    setTimeout(() => playSound(784, 0.3, 'sine'), 200); // G note
                    break;
                case 'lose':
                    playSound(220, 0.5, 'sawtooth'); // Low A note
                    break;
                case 'tie':
                    playSound(330, 0.3, 'triangle'); // E note
                    break;
            }
        }, 500);
    };
}

// Add keyboard shortcuts info
document.addEventListener('DOMContentLoaded', () => {
    // Create keyboard shortcuts tooltip
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.innerHTML = `
        <div style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-size: 0.8rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        " id="shortcuts-tooltip">
            <strong>Keyboard Shortcuts:</strong><br>
            R - Rock | P - Paper | S - Scissors<br>
            Space - Reset Game
        </div>
    `;
    
    document.body.appendChild(shortcutsInfo);
    
    // Show tooltip on first interaction
    let hasShownShortcuts = false;
    document.addEventListener('click', () => {
        if (!hasShownShortcuts) {
            const tooltip = document.getElementById('shortcuts-tooltip');
            tooltip.style.opacity = '1';
            
            setTimeout(() => {
                tooltip.style.opacity = '0';
            }, 4000);
            
            hasShownShortcuts = true;
        }
    });
});