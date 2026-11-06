// src/entities/PowerUp.js
import { state } from '../state.js';

export default class PowerUp {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 16;
        this.vy = 1.2;
        this.life = 600;
        this.pulse = 0;
        const roll = Math.random();
        
        if (roll < 0.35) {
            this.type = 'triple';
            this.color = '#00ffea';
            this.label = '3X';
        } else if (roll < 0.60) {
            this.type = 'rapid';
            this.color = '#ffea00';
            this.label = '⚡';
        } else if (roll < 0.82) {
            this.type = 'shield';
            this.color = '#00f0ff';
            this.label = '🛡';
        } else {
            this.type = 'nuke';
            this.color = '#ff0077';
            this.label = '☣';
        }
    }
    
    update() {
        this.y += this.vy;
        this.life--;
        this.pulse += 0.08;
    }
    
    draw() {
        state.ctx.save();
        state.ctx.translate(this.x, this.y);
        const s = 1 + Math.sin(this.pulse) * 0.15;
        state.ctx.scale(s, s);
        
        state.ctx.strokeStyle = this.color;
        state.ctx.fillStyle = 'rgba(8, 16, 32, 0.85)';
        state.ctx.shadowColor = this.color;
        state.ctx.shadowBlur = 14;
        state.ctx.lineWidth = 2.5;
        
        state.ctx.beginPath();
        state.ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        state.ctx.fill();
        state.ctx.stroke();
        
        state.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        state.ctx.lineWidth = 1;
        state.ctx.beginPath();
        state.ctx.arc(0, 0, this.radius + 4, 0, Math.PI * 2);
        state.ctx.stroke();
        
        state.ctx.fillStyle = '#ffffff';
        state.ctx.font = 'bold 12px sans-serif';
        state.ctx.textAlign = 'center';
        state.ctx.textBaseline = 'middle';
        state.ctx.fillText(this.label, 0, 1);
        
        state.ctx.restore();
    }
}
