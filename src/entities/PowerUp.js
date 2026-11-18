// src/entities/PowerUp.js
import { state } from '../state.js';

export default class PowerUp {
    constructor(x, y, forcedType = null) {
        this.x = x;
        this.y = y;
        this.radius = 16;
        this.vy = 1.2;
        this.life = 600;
        this.pulse = 0;

        if (forcedType === 'battery') {
            this.type = 'battery';
            this.color = '#b042ff';
            this.label = '⚡';
        } else {
            const roll = Math.random();
            if (roll < 0.42) {
                this.type = 'triple';
                this.color = '#00ffea';
                this.label = '3X';
            } else if (roll < 0.72) {
                this.type = 'rapid';
                this.color = '#ffea00';
                this.label = '⚡';
            } else {
                this.type = 'shield';
                this.color = '#00f0ff';
                this.label = '🛡';
            }
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
        
        if (this.type === 'battery') {
            state.ctx.strokeStyle = '#e082ff';
            state.ctx.fillStyle = 'rgba(176, 66, 255, 0.85)';
            state.ctx.shadowColor = '#b042ff';
            state.ctx.shadowBlur = 16;
            state.ctx.lineWidth = 2;

            // Battery terminal cap
            state.ctx.fillRect(-4, -13, 8, 3);
            // Pulsing purple rectangle body
            state.ctx.beginPath();
            state.ctx.rect(-8, -10, 16, 20);
            state.ctx.fill();
            state.ctx.stroke();

            // Inner energy core bars
            state.ctx.fillStyle = '#ffffff';
            state.ctx.fillRect(-5, -6, 10, 3);
            state.ctx.fillRect(-5, -1, 10, 3);
            state.ctx.fillRect(-5, 4, 10, 3);
        } else {
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
        }
        
        state.ctx.restore();
    }
}
