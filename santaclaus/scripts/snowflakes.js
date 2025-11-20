// Snowflakes Background Effect - Christmas Theme
(function() {
    const canvas = document.getElementById('snowflakesCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Snowflake class
    class Snowflake {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = Math.random() * 1 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.02 + 0.01;
        }

        update() {
            this.x += this.speedX + Math.sin(this.wobble) * 0.5;
            this.y += this.speedY;
            this.wobble += this.wobbleSpeed;

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y > canvas.height) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            const isLightTheme = document.body.classList.contains('light-theme');
            const color = isLightTheme ? `rgba(0, 100, 200, ${this.opacity})` : `rgba(255, 255, 255, ${this.opacity})`;
            const shadowColor = isLightTheme ? 'rgba(0, 100, 200, 0.8)' : 'rgba(255, 255, 255, 0.8)';
            
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.wobble);
            
            ctx.fillStyle = color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = shadowColor;
            
            // Draw snowflake shape (simple 6-pointed star)
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                ctx.moveTo(0, 0);
                ctx.lineTo(0, -this.size * 2);
                ctx.moveTo(0, 0);
                ctx.lineTo(-this.size * 0.5, -this.size);
                ctx.moveTo(0, 0);
                ctx.lineTo(this.size * 0.5, -this.size);
                ctx.rotate(Math.PI / 3);
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Center dot
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
            ctx.shadowBlur = 0;
        }
    }

    // Create snowflakes
    const snowflakeCount = 100;
    const snowflakes = [];
    
    for (let i = 0; i < snowflakeCount; i++) {
        snowflakes.push(new Snowflake());
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw snowflakes
        snowflakes.forEach(snowflake => {
            snowflake.update();
            snowflake.draw();
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });
})();

