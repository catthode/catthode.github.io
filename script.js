document.addEventListener('DOMContentLoaded', () => {
    const repoGrid = document.getElementById('repo-grid');
    const username = 'catthode';
    
    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(async repos => {
            // Clear loading text
            repoGrid.innerHTML = '';

            // Fetch metadata for all repos in parallel
            const repoDataPromises = repos.map(async repo => {
                const metaUrl = `https://raw.githubusercontent.com/${username}/${repo.name}/${repo.default_branch}/.catthode.json`;
                let config = {};
                
                try {
                    const metaResponse = await fetch(metaUrl);
                    if (metaResponse.ok) {
                        config = await metaResponse.json();
                    }
                } catch (e) {
                    // Ignore errors, use defaults
                }
                
                return { repo, config };
            });

            const results = await Promise.all(repoDataPromises);

            // Filter and sort
            results
                .filter(item => {
                    // Hide if config says so, or if it's the website repo itself (unless config overrides)
                    if (item.config.hidden) return false;
                    if (item.repo.name === 'catthode.github.io' && item.config.hidden === undefined) return false;
                    return true;
                })
                .sort((a, b) => b.repo.stargazers_count - a.repo.stargazers_count)
                .forEach(({ repo, config }) => {
                    // Default values
                    const displayName = config.name || repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    const iconClass = config.icon || 'fa-solid fa-cube';
                    const description = config.description || repo.description || 'No description provided.';

                    const card = document.createElement('a');
                    card.href = repo.html_url;
                    card.className = 'card';
                    card.target = '_blank';
                    card.innerHTML = `
                        <div class="card-icon"><i class="${iconClass}"></i></div>
                        <h3>${displayName}</h3>
                        <p>${description}</p>
                    `;

                    repoGrid.appendChild(card);
                });
        })
        .catch(error => {
            console.error('Error fetching repos:', error);
            repoGrid.innerHTML = '<p class="error">Failed to load repositories. Please check GitHub directly.</p>';
        });
});

/* CRT Animation Logic */
(function() {
    const canvas = document.getElementById('crt-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    // Configuration
    const PARTICLE_COUNT = 150;
    const AMBER = 'rgba(255, 158, 59,'; // #ff9e3b
    const GOLD = 'rgba(255, 184, 108,'; // #ffb86c
    const Z_START = 2000; // Starting depth (Deep inside the tube)
    const Z_IMPACT = 100; // Screen plane depth
    const SPEED = 3;
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            // Start far away
            this.z = Z_START + Math.random() * 1000;
            
            // Random target on the screen (x, y)
            const spreadX = width * 0.8; // Wider spread
            const spreadY = height * 0.8;
            
            // Target coordinates relative to center
            this.tx = (Math.random() - 0.5) * spreadX;
            this.ty = (Math.random() - 0.5) * spreadY;
            
            // Curve factors:
            // By raising progress to a power, we keep the particle near 0,0 for longer
            // and then "swoop" it out to the target.
            // Different powers for X and Y create the "random curve" effect.
            this.curveX = 1.5 + Math.random() * 2.5; // 1.5 to 4
            this.curveY = 1.5 + Math.random() * 2.5;
            
            // Starting coordinates (Electron gun source)
            this.x = 0; 
            this.y = 0;
            
            this.speed = SPEED + Math.random() * 2;
            
            this.impacting = false;
            this.impactAlpha = 1;

            this.history = [];
            
            // Pre-calculate explosion debris
            this.debris = [];
            const debrisCount = 4 + Math.random() * 4; 
            for (let i = 0; i < debrisCount; i++) {
                this.debris.push({
                    x: (Math.random() - 0.5) * 10,
                    y: (Math.random() - 0.5) * 10,
                    w: Math.random() * 3 + 1,
                    h: Math.random() * 3 + 1
                });
            }
        }
        
        update() {
            if (this.impacting) {
                this.impactAlpha -= 0.05;
                if (this.impactAlpha <= 0) {
                    this.reset();
                }
                return;
            }
            
            this.z -= this.speed;
            
            // Progress from 0 to 1 based on Z travel
            const progress = 1 - ((this.z - Z_IMPACT) / (Z_START - Z_IMPACT));
            
            if (progress >= 1) {
                this.impacting = true;
                return;
            }
            
            // Calculate Position based on exponential ease (Curves!)
            // At progress = 0 (Start), pow is 0, so x/y are 0.
            // At progress = 1 (End), pow is 1, so x/y are tx/ty.
            // Using different curves for X and Y makes the path curve on screen.
            this.currX = this.tx * Math.pow(progress, this.curveX);
            this.currY = this.ty * Math.pow(progress, this.curveY);
            
            // Perspective projection
            const fov = 300;
            const scale = fov / (fov + this.z);
            
            this.screenX = width / 2 + this.currX; 
            this.screenY = height / 2 + this.currY;
            this.scale = scale;

            // Update history for trails
            this.history.push({ x: this.screenX, y: this.screenY });
            if (this.history.length > 20) {
                this.history.shift();
            }
        }
        
        draw() {
            if (this.impacting) {
                ctx.fillStyle = `${GOLD} ${this.impactAlpha})`;
                for (let d of this.debris) {
                    ctx.fillRect(
                        this.screenX + d.x, 
                        this.screenY + d.y, 
                        d.w, 
                        d.h
                    );
                }
            } else {
                if (this.z < Z_START) {
                    const size = Math.max(1, 4 * this.scale);
                    const alpha = Math.min(1, (1 - (this.z / Z_START)) * 1);
                    
                    // Draw Head
                    ctx.beginPath();
                    ctx.arc(this.screenX, this.screenY, size, 0, Math.PI * 2);
                    ctx.fillStyle = `${AMBER} ${alpha})`;
                    ctx.fill();
                    
                    // Draw Trail
                    if (this.history.length > 1) {
                        ctx.beginPath();
                        ctx.moveTo(this.history[0].x, this.history[0].y);
                        for (let i = 1; i < this.history.length; i++) {
                            ctx.lineTo(this.history[i].x, this.history[i].y);
                        }
                        ctx.lineTo(this.screenX, this.screenY); // Connect to head
                        
                        ctx.strokeStyle = `${AMBER} ${alpha * 0.4})`;
                        ctx.lineWidth = size * 0.5;
                        ctx.lineCap = 'round';
                        ctx.stroke();
                    }
                }
            }
        }
    }
    
    // Init particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = new Particle();
        // Randomize initial z so they don't all start at once
        p.z = Math.random() * Z_START + Z_START; 
        particles.push(p);
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Composite operation for glow effect
        ctx.globalCompositeOperation = 'screen';
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        ctx.globalCompositeOperation = 'source-over';
        
        requestAnimationFrame(animate);
    }
    
    animate();
})();
