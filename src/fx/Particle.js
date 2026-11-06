// src/fx/Particle.js
import { state } from '../state.js';

export default class Particle {
    constructor(x, y, vx, vy, size, color, maxLife = 28) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.color = color;
        this.life = maxLife;
        this.maxLife = maxLife;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.94;
        this.vy *= 0.94;
        this.life--;
    }
    
    draw() {
        const alpha = Math.max(0, this.life / this.maxLife);
        state.ctx.save();
        state.ctx.globalAlpha = alpha;
        state.ctx.fillStyle = this.color;
        state.ctx.beginPath();
        state.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        state.ctx.fill();
        state.ctx.restore();
    }
}
