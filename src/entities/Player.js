// src/entities/Player.js
import { state, GameState, triggerShake } from '../state.js';
import { sound } from '../audio.js';
import Bullet from './Bullet.js';
import { createParticles, updateHearts, endGame } from '../main.js';
import { SHIP_SKINS } from '../config.js';

export default class PlayerShip {
    constructor() {
        this.x = state.width / 2;
        this.y = state.height - 52;
        this.radius = 22;
        this.speed = 10;
        this.health = 3;
        this.maxHealth = 3;
        this.invulnerableTimer = 0;
        this.fireTimer = 0;
        this.baseFireInterval = 11;
        this.tripleShotTimer = 0;
        this.rapidFireTimer = 0;
        this.shieldTimer = 0;
        this.empTimer = 0;
        this.skinIndex = 0;
        this.upgrades = {};
        this.damageLevel = 1;
        this.pierceLevel = 0;
        this.tripleChance = 0;
        this.novaChargeRate = 0.05;
        this.slowAura = 0;
        this.passiveShieldInterval = 0;
        this.passiveShieldTimer = 0;
        this.comboBonusTime = 0;
        this.novaCharge = 0;
    }
    
    update() {
        this.y = state.height - 52;
        const currentSpeed = this.empTimer > 0 ? this.speed * 0.45 : this.speed;
        
        if (state.keys.left || state.keys.right) {
            if (state.keys.left) this.x -= currentSpeed;
            if (state.keys.right) this.x += currentSpeed;
            state.targetX = this.x;
        } else {
            const smoothFactor = this.empTimer > 0 ? 0.12 : 0.28;
            this.x += (state.targetX - this.x) * smoothFactor;
        }
        
        this.x = Math.max(this.radius + 8, Math.min(state.width - this.radius - 8, this.x));
        state.targetX = Math.max(this.radius + 8, Math.min(state.width - this.radius - 8, state.targetX));
        
        if (this.invulnerableTimer > 0) this.invulnerableTimer--;
        if (this.tripleShotTimer > 0) this.tripleShotTimer--;
        if (this.rapidFireTimer > 0) this.rapidFireTimer--;
        if (this.shieldTimer > 0) this.shieldTimer--;
        if (this.empTimer > 0) this.empTimer--;
        
        if (this.passiveShieldInterval > 0) {
            this.passiveShieldTimer++;
            if (this.passiveShieldTimer >= this.passiveShieldInterval) {
                this.passiveShieldTimer = 0;
                this.shieldTimer = Math.max(this.shieldTimer, 300);
                sound.playAbility();
                createParticles(this.x, this.y, '#00f0ff', 12);
            }
        }
        
        if (this.novaCharge < 100 && state.current !== GameState.BOSS_FIGHT) {
            this.novaCharge += this.novaChargeRate;
        }
        
        this.fireTimer++;
        let effectiveInterval = this.baseFireInterval;
        if (this.rapidFireTimer > 0) effectiveInterval = Math.max(3, Math.floor(effectiveInterval * 0.5));
        if (this.empTimer > 0) effectiveInterval = Math.floor(effectiveInterval * 1.7);
        
        if (this.fireTimer >= effectiveInterval) {
            this.fireTimer = 0;
            this.autoShoot();
        }
    }
    
    autoShoot() {
        sound.playShoot();
        triggerShake(1.2);
        const topY = this.y - 18;
        const isTriple = (this.tripleShotTimer > 0) || (Math.random() < this.tripleChance);
        const bulletColor = this.damageLevel > 2 ? '#ff00bb' : (this.damageLevel > 1.4 ? '#00ffea' : '#00f0ff');
        
        if (isTriple) {
            state.bullets.push(new Bullet(this.x, topY, -Math.PI / 2, bulletColor, false, false, this.damageLevel, this.pierceLevel));
            state.bullets.push(new Bullet(this.x - 14, topY, -Math.PI / 2 - 0.12, bulletColor, false, false, this.damageLevel, this.pierceLevel));
            state.bullets.push(new Bullet(this.x + 14, topY, -Math.PI / 2 + 0.12, bulletColor, false, false, this.damageLevel, this.pierceLevel));
        } else {
            state.bullets.push(new Bullet(this.x, topY, -Math.PI / 2, bulletColor, false, false, this.damageLevel, this.pierceLevel));
        }
    }
    
    takeDamage(amount = 1) {
        if (this.invulnerableTimer > 0) return false;
        if (this.shieldTimer > 0) {
            this.shieldTimer = 0;
            this.invulnerableTimer = 35;
            sound.playHit();
            createParticles(this.x, this.y, '#00f0ff', 16);
            return false;
        }
        
        this.health = Math.max(0, this.health - amount);
        this.invulnerableTimer = 65;
        sound.playHit();
        triggerShake(12);
        createParticles(this.x, this.y, '#ff0055', 25);
        updateHearts();
        
        if (this.health <= 0) {
            endGame();
        }
        return true;
    }
    
    draw() {
        state.ctx.save();
        state.ctx.translate(this.x, this.y);
        if (this.invulnerableTimer > 0 && Math.floor(this.invulnerableTimer / 4) % 2 === 0) {
            state.ctx.globalAlpha = 0.4;
        }
        if (this.shieldTimer > 0) {
            state.ctx.strokeStyle = '#00f0ff';
            state.ctx.shadowColor = '#00f0ff';
            state.ctx.shadowBlur = 18;
            state.ctx.lineWidth = 3;
            state.ctx.beginPath();
            state.ctx.arc(0, 0, this.radius + 15, 0, Math.PI * 2);
            state.ctx.stroke();
        }
        
        const currentSkin = SHIP_SKINS[this.skinIndex];
        const flameColor = this.rapidFireTimer > 0 ? '#ffea00' : currentSkin.color;
        const thrusterCount = this.skinIndex >= 6 ? 3 : (this.skinIndex >= 3 ? 2 : 1);
        
        state.ctx.fillStyle = flameColor;
        state.ctx.shadowColor = flameColor;
        state.ctx.shadowBlur = 12;
        
        const fH = 8 + Math.random() * 8;
        if (thrusterCount === 1) {
            state.ctx.beginPath();
            state.ctx.moveTo(-6, 14); state.ctx.lineTo(0, 14 + fH); state.ctx.lineTo(6, 14);
            state.ctx.fill();
        } else if (thrusterCount === 2) {
            state.ctx.beginPath();
            state.ctx.moveTo(-14, 14); state.ctx.lineTo(-10, 14 + fH); state.ctx.lineTo(-6, 14);
            state.ctx.moveTo(6, 14); state.ctx.lineTo(10, 14 + fH); state.ctx.lineTo(14, 14);
            state.ctx.fill();
        } else {
            state.ctx.beginPath();
            state.ctx.moveTo(-16, 14); state.ctx.lineTo(-12, 14 + fH * 0.8); state.ctx.lineTo(-8, 14);
            state.ctx.moveTo(-5, 14); state.ctx.lineTo(0, 14 + fH * 1.3); state.ctx.lineTo(5, 14);
            state.ctx.moveTo(8, 14); state.ctx.lineTo(12, 14 + fH * 0.8); state.ctx.lineTo(16, 14);
            state.ctx.fill();
        }
        
        state.ctx.fillStyle = '#080d24';
        state.ctx.strokeStyle = currentSkin.color;
        state.ctx.shadowColor = currentSkin.color;
        state.ctx.shadowBlur = 16 + this.skinIndex * 1.5;
        state.ctx.lineWidth = 2.5;
        state.ctx.beginPath();
        
        switch (this.skinIndex) {
            case 0:
                state.ctx.moveTo(0, -22);
                state.ctx.lineTo(18, 14);
                state.ctx.lineTo(6, 9);
                state.ctx.lineTo(-6, 9);
                state.ctx.lineTo(-18, 14);
                break;
            case 1:
                state.ctx.moveTo(0, -26);
                state.ctx.lineTo(12, -4);
                state.ctx.lineTo(24, 14);
                state.ctx.lineTo(0, 11);
                state.ctx.lineTo(-24, 14);
                state.ctx.lineTo(-12, -4);
                break;
            case 2:
                state.ctx.moveTo(-8, -25);
                state.ctx.lineTo(-3, -12);
                state.ctx.lineTo(0, -18);
                state.ctx.lineTo(3, -12);
                state.ctx.lineTo(8, -25);
                state.ctx.lineTo(24, 12);
                state.ctx.lineTo(0, 8);
                state.ctx.lineTo(-24, 12);
                break;
            case 3:
                state.ctx.moveTo(0, -27);
                state.ctx.lineTo(26, 2);
                state.ctx.lineTo(16, 15);
                state.ctx.lineTo(0, 9);
                state.ctx.lineTo(-16, 15);
                state.ctx.lineTo(-26, 2);
                break;
            case 4:
                state.ctx.moveTo(-10, -25);
                state.ctx.lineTo(10, -25);
                state.ctx.lineTo(26, -4);
                state.ctx.lineTo(28, 15);
                state.ctx.lineTo(12, 10);
                state.ctx.lineTo(0, 15);
                state.ctx.lineTo(-12, 10);
                state.ctx.lineTo(-28, 15);
                state.ctx.lineTo(-26, -4);
                break;
            case 5:
                state.ctx.moveTo(0, -28);
                state.ctx.lineTo(28, 6);
                state.ctx.lineTo(22, 15);
                state.ctx.lineTo(6, 6);
                state.ctx.lineTo(-6, 6);
                state.ctx.lineTo(-22, 15);
                state.ctx.lineTo(-28, 6);
                break;
            case 6:
                state.ctx.moveTo(0, -30);
                state.ctx.lineTo(12, -10);
                state.ctx.lineTo(32, 4);
                state.ctx.lineTo(22, 16);
                state.ctx.lineTo(6, 11);
                state.ctx.lineTo(-6, 11);
                state.ctx.lineTo(-22, 16);
                state.ctx.lineTo(-32, 4);
                state.ctx.lineTo(-12, -10);
                break;
            case 7:
                state.ctx.moveTo(0, -32);
                state.ctx.lineTo(16, -14);
                state.ctx.lineTo(28, 8);
                state.ctx.lineTo(14, 16);
                state.ctx.lineTo(0, 9);
                state.ctx.lineTo(-14, 16);
                state.ctx.lineTo(-28, 8);
                state.ctx.lineTo(-16, -14);
                break;
            case 8:
                state.ctx.moveTo(0, -34);
                state.ctx.lineTo(10, -14);
                state.ctx.lineTo(34, -4);
                state.ctx.lineTo(20, 16);
                state.ctx.lineTo(0, 10);
                state.ctx.lineTo(-20, 16);
                state.ctx.lineTo(-34, -4);
                state.ctx.lineTo(-10, -14);
                break;
            case 9:
                state.ctx.moveTo(0, -36);
                state.ctx.lineTo(8, -20);
                state.ctx.lineTo(24, -16);
                state.ctx.lineTo(36, 12);
                state.ctx.lineTo(16, 12);
                state.ctx.lineTo(0, 18);
                state.ctx.lineTo(-16, 12);
                state.ctx.lineTo(-36, 12);
                state.ctx.lineTo(-24, -16);
                state.ctx.lineTo(-8, -20);
                break;
        }
        
        state.ctx.closePath();
        state.ctx.fill();
        state.ctx.stroke();
        
        state.ctx.strokeStyle = currentSkin.accent;
        state.ctx.lineWidth = 1.6;
        state.ctx.beginPath();
        if (this.skinIndex >= 2) {
            state.ctx.moveTo(-10, 8); state.ctx.lineTo(0, -12); state.ctx.lineTo(10, 8);
        }
        if (this.skinIndex >= 5) {
            state.ctx.moveTo(-20, 10); state.ctx.lineTo(-8, -4);
            state.ctx.moveTo(20, 10); state.ctx.lineTo(8, -4);
        }
        if (this.skinIndex >= 8) {
            state.ctx.moveTo(-16, -10); state.ctx.lineTo(0, -26); state.ctx.lineTo(16, -10);
        }
        state.ctx.stroke();
        
        state.ctx.beginPath();
        state.ctx.arc(0, -3, 4 + Math.min(this.skinIndex * 0.4, 3), 0, Math.PI * 2);
        state.ctx.fillStyle = currentSkin.color;
        state.ctx.shadowBlur = 12;
        state.ctx.fill();
        
        state.ctx.restore();
    }
}
