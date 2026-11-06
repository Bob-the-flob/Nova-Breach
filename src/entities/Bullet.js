// src/entities/Bullet.js
import { state } from '../state.js';

export default class Bullet {
    constructor(x, y, angle, color = '#00f0ff', isEnemy = false, isEmp = false, damage = 1, pierce = 0) {
        this.x = x;
        this.y = y;
        this.radius = isEmp ? 6 : (isEnemy ? 4.5 : (damage > 1.2 ? 4.5 : 3.5));
        this.speed = isEnemy ? (isEmp ? 3.6 : 4.0) : 13;
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.color = color;
        this.isEnemy = isEnemy;
        this.isEmp = isEmp;
        this.damage = damage;
        this.pierce = pierce;
        this.life = 200;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
    }
    
    draw() {
        state.ctx.save();
        state.ctx.fillStyle = this.color;
        state.ctx.beginPath();
        state.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        state.ctx.fill();
        if (this.isEmp) {
            state.ctx.strokeStyle = '#ffffff';
            state.ctx.lineWidth = 1.5;
            state.ctx.stroke();
        }
        state.ctx.restore();
    }
}
