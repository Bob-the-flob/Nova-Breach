// src/fx/Shockwave.js
import { state } from '../state.js';

export default class Shockwave {
    constructor(x, y, maxRadius = 450) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.maxRadius = maxRadius;
        this.finished = false;
    }
    
    update() {
        this.radius += 22;
        if (this.radius >= this.maxRadius) {
            this.finished = true;
        }
    }
    
    draw() {
        const alpha = 1 - (this.radius / this.maxRadius);
        state.ctx.save();
        state.ctx.strokeStyle = '#ff00bb';
        state.ctx.shadowColor = '#00f0ff';
        state.ctx.shadowBlur = 22;
        state.ctx.lineWidth = 6 * alpha;
        state.ctx.globalAlpha = alpha;
        
        state.ctx.beginPath();
        state.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        state.ctx.stroke();
        
        state.ctx.restore();
    }
}
