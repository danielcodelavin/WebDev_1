function playPage() {
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="game-container">
            <div class="score-time-display p-3 bg-dark text-white">
                <h3>Score: <span id="score">0</span> | Time: <span id="time">0</span>s</h3>
            </div>
            <canvas id="gameCanvas" width="1200" height="600" style="border:1px solid #000; display: block; margin: 0 auto;"></canvas>
        </div>
    `;

    // Game variables
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let gameLoop = null;
    let gameStartTime = null;
    
    // Load images
    const backgroundImage = new Image();
    backgroundImage.src = 'space_pixel.jpeg'; 

    // Get preferences or use defaults
    const numUfos = parseInt(localStorage.getItem('numUfos')) || 3;
    const gameTime = parseInt(localStorage.getItem('playTime')) || 60;
    
    // Game state
    let score = 0;
    let timeRemaining = gameTime;
    let gameActive = true;
    let imagesLoaded = 0;
    const requiredImages = 4;

    const player = {
        x: canvas.width / 2,
        y: canvas.height - 100,  
        width: 80,              
        height: 80,             
        speed: 3,
        image: new Image()
    };
    player.image.src = 'spaceship_pixel.png'; 

    const missiles = [];
    const missileProps = {
        width: 30,              
        height: 40,             
        speed: 4,
        image: new Image()
    };
    missileProps.image.src = 'misslejp_pixel.png'; 

    // UFO image
    const ufoImage = new Image();
    ufoImage.src = 'UFO_fresh_pixel.png'; 

    // UFO class 
    class UFO {
        constructor() {
            this.width = 100;    
            this.height = 60;   
            this.x = Math.random() * (canvas.width - this.width);
            this.y = Math.random() * (canvas.height / 2) + 50;
            this.speed = 2;
            this.direction = 1;
            this.active = true;
            this.respawnTimer = 0;
        }

        update() {
            if (!this.active) {
                if (this.respawnTimer > 0) {
                    this.respawnTimer--;
                } else {
                    this.respawn();
                }
                return;
            }

            this.x += this.speed * this.direction;
            
            if (this.x <= 0 || this.x + this.width >= canvas.width) {
                this.direction *= -1;
            }
        }

        respawn() {
            this.x = Math.random() * (canvas.width - this.width);
            this.y = Math.random() * (canvas.height / 2) + 50;
            this.active = true;
        }

        draw() {
            if (!this.active) return;
            ctx.drawImage(ufoImage, this.x, this.y, this.width, this.height);
        }
    }

    // Create UFOs
    const ufos = Array(numUfos).fill(null).map(() => new UFO());

    // Input handling
    const keys = {
        left: false,
        right: false,
        space: false
    };

    // Image loading handler
    function handleImageLoad() {
        imagesLoaded++;
        if (imagesLoaded === requiredImages) {
            startGame();
        }
    }

    // Add load event listeners to all images
    backgroundImage.onload = handleImageLoad;
    player.image.onload = handleImageLoad;
    missileProps.image.onload = handleImageLoad;
    ufoImage.onload = handleImageLoad;

    function handleKeyDown(e) {
        if (e.key === 'ArrowLeft') keys.left = true;
        if (e.key === 'ArrowRight') keys.right = true;
        if (e.key === ' ') {
            e.preventDefault();
            if (!keys.space) fireMissile();
            keys.space = true;
        }
    }

    function handleKeyUp(e) {
        if (e.key === 'ArrowLeft') keys.left = false;
        if (e.key === 'ArrowRight') keys.right = false;
        if (e.key === ' ') keys.space = false;
    }

    function fireMissile() {
        // Only fire if there are no active missiles
        if (missiles.length === 0) {
            missiles.push({
                x: player.x + player.width / 2 - missileProps.width / 2,
                y: player.y,
                width: missileProps.width,
                height: missileProps.height
            });
        }
    }

    function updatePlayer() {
        if (keys.left) player.x = Math.max(0, player.x - player.speed);
        if (keys.right) player.x = Math.min(canvas.width - player.width, player.x + player.speed);
    }

    function updateMissiles() {
        for (let i = missiles.length - 1; i >= 0; i--) {
            missiles[i].y -= missileProps.speed;
            
            if (missiles[i].y + missiles[i].height < 0) {
                missiles.splice(i, 1);
                continue;
            }

            for (const ufo of ufos) {
                if (!ufo.active) continue;
                
                if (checkCollision(missiles[i], ufo)) {
                    missiles.splice(i, 1);
                    ufo.active = false;
                    ufo.respawnTimer = 60;
                    score += 100;
                    document.getElementById('score').textContent = score;
                    break;
                }
            }
        }
    }

    function checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    function draw() {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
        
        missiles.forEach(missile => {
            ctx.drawImage(missileProps.image, missile.x, missile.y, missile.width, missile.height);
        });
        
        ufos.forEach(ufo => ufo.draw());
    }

    function endGame() {
        gameActive = false;
        clearInterval(gameLoop);
        
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);

        // Save high score to local storage
        const highScores = JSON.parse(localStorage.getItem('highScores') || '[]');
        highScores.push({
            score: score,
            date: new Date().toISOString()
        });
        highScores.sort((a, b) => b.score - a.score);
        localStorage.setItem('highScores', JSON.stringify(highScores.slice(0, 10))); 

        // Show game over screen
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
        ctx.font = '24px Arial';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 50);
        ctx.fillText('Press any key to return to menu', canvas.width / 2, canvas.height / 2 + 100);

        // Add one-time listener for returning to menu
        document.addEventListener('keydown', function returnToMenu() {
            document.removeEventListener('keydown', returnToMenu);
            document.querySelector('[data-page="home"]').click();
        }, { once: true });
    }

    function updateTime() {
        const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
        timeRemaining = Math.max(0, gameTime - elapsed);
        document.getElementById('time').textContent = timeRemaining;
        
        if (timeRemaining <= 0 && gameActive) {
            endGame();
        }
    }

    function gameUpdate() {
        if (!gameActive) return;
        
        updatePlayer();
        updateMissiles();
        ufos.forEach(ufo => ufo.update());
        updateTime();
        draw();
    }

    function startGame() {
    
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        
       
        gameStartTime = Date.now();
        document.getElementById('time').textContent = timeRemaining;
        gameLoop = setInterval(gameUpdate, 1000 / 60); 
    }
}