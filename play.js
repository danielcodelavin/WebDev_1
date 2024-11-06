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

    const ufoImage = new Image();
    ufoImage.src = 'UFO_fresh_pixel.png';
    
    const ufoHitImage = new Image();
    ufoHitImage.src = 'explosion.png';

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

    const numUfos = parseInt(localStorage.getItem('numUfos')) || 3;
    const gameTime = parseInt(localStorage.getItem('playTime')) || 60;
    let score = 0;
    let timeRemaining = gameTime;
    let gameActive = true;
    let imagesLoaded = 0;
    const requiredImages = 5;

    // UFO class
    class UFO {
        constructor() {
            this.width = 100;
            this.height = 60;
            this.x = Math.random() * (canvas.width - this.width);
            this.y = canvas.height * 0.2 + Math.random() * (canvas.height * 0.25);
            this.speed = 2 + (Math.random() * 3);
            this.direction = 1;
            this.hit = false;
            this.hitTimer = 0;
            this.image = ufoImage;
        }

        update() {
            this.x += this.speed * this.direction;
            
            if (this.x <= 0 || this.x + this.width >= canvas.width) {
                this.direction *= -1;
            }
            
            if (this.hit && this.hitTimer <= 0) {
                this.hit = false;
                this.image = ufoImage;
            } else if (this.hit) {
                this.hitTimer--;
            }
        }

        draw() {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }

        activateHitEffect() {
            if (!this.hit) {
                this.hit = true;
                this.hitTimer = 60;
                this.image = ufoHitImage;
            }
        }
    }

    const ufos = Array(numUfos).fill(null).map(() => new UFO());

    const keys = {
        left: false,
        right: false,
        space: false
    };

    function handleImageLoad() {
        imagesLoaded++;
        if (imagesLoaded === requiredImages) {
            startGame();
        }
    }

    backgroundImage.onload = handleImageLoad;
    player.image.onload = handleImageLoad;
    missileProps.image.onload = handleImageLoad;
    ufoImage.onload = handleImageLoad;
    ufoHitImage.onload = handleImageLoad;

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
                score = Math.max(0, score - 25);
                document.getElementById('score').textContent = score;
                continue;
            }

            for (const ufo of ufos) {
                if (checkCollision(missiles[i], ufo) && !ufo.hit) {
                    missiles.splice(i, 1);
                    ufo.activateHitEffect();
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
        
        const selectedTime = gameTime / 60; 
        score = Math.floor(score / selectedTime);
        score -= (numUfos - 1) * 50;
        score = Math.max(0, score); 

        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
        ctx.font = '24px Arial';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 50);
        ctx.fillText('Press any key to return to menu', canvas.width / 2, canvas.height / 2 + 100);
    
        document.addEventListener('keydown', function returnToMenu() {
            document.removeEventListener('keydown', returnToMenu);
            document.querySelector('[data-page="home"]').click();
        }, { once: true });
    }

    function updateTime() {
        const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
        timeRemaining = gameTime - elapsed;
    
        if (timeRemaining <= 0 && gameActive) {
            timeRemaining = 0;
            endGame();
        }
    
        document.getElementById('time').textContent = timeRemaining;
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
        timeRemaining = gameTime;
        document.getElementById('time').textContent = timeRemaining;
    
        gameLoop = setInterval(gameUpdate, 1000 / 60); 
    }
}
