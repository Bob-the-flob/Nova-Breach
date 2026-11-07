// src/entities/Invader.js
import { state } from '../state.js';
import { sound } from '../audio.js';
import Bullet from './Bullet.js';
import { createParticles } from '../main.js';

export default class Invader {
    constructor(x, y, type, wave) {
        this.baseX = x;
        this.x = x;
        this.y = y;
        this.type = type;
        this.wave = wave;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.025 + Math.random() * 0.015;
        const baseDrop = 0.42 + Math.min(wave * 0.025, 0.65);
        
        switch (this.type) {
            case 'dart':
                this.radius = 12;
                this.maxHp = 1 + Math.floor(wave * 0.15);
                this.speedY = baseDrop * 1.35;
                this.color = '#00ffea';
                this.points = 120;
                this.dashTimer = Math.floor(Math.random() * 120) + 180;
                this.isDashing = false;
                this.dashDuration = 0;
                break;
            case 'tank':
                this.radius = 23;
                this.maxHp = 4 + Math.floor(wave * 0.35);
                this.speedY = baseDrop * 0.65;
                this.color = '#ff9900';
                this.points = 320;
                this.shieldActive = false;
                this.shieldCooldown = 220;
                this.shieldDuration = 0;
                break;
            case 'splitter':
                this.radius = 17;
                this.maxHp = 2 + Math.floor(wave * 0.22);
                this.speedY = baseDrop * 0.9;
                this.color = '#33ff55';
                this.points = 210;
                break;
            case 'mini_drone':
                this.radius = 9;
                this.maxHp = 1;
                this.speedY = baseDrop * 3.4;
                this.wobbleSpeed = 0.09;
                this.color = '#76ff03';
                this.points = 80;
                break;
            case 'disruptor':
                this.radius = 16;
                this.maxHp = 2 + Math.floor(wave * 0.25);
                this.speedY = baseDrop * 0.8;
                this.color = '#ff00aa';
                this.points = 240;
                break;
            case 'phantom':
                this.radius = 15;
                this.maxHp = 2 + Math.floor(wave * 0.2);
                this.speedY = baseDrop * 0.85;
                this.color = '#b042ff';
                this.points = 260;
                this.teleportCooldown = Math.floor(Math.random() * 90) + 190;
                break;
            case 'healer':
                this.radius = 16;
                this.maxHp = 2 + Math.floor(wave * 0.22);
                this.speedY = baseDrop * 0.75;
                this.color = '#ffff33';
                this.points = 270;
                this.healCooldown = 180;
                break;
            default:
                this.radius = 14;
                this.maxHp = 1 + Math.floor(wave * 0.2);
                this.speedY = baseDrop;
                this.color = '#00e5ff';
                this.points = 100;
                break;
        }
        this.hp = this.maxHp;
        const baseCooldown = Math.max(90, 220 - wave * 4);
        this.shootCooldown = Math.floor(Math.random() * baseCooldown) + baseCooldown;
    }

    update() {
        const slowFactor = state.player ? (1 - state.player.slowAura) : 1;
        const effectiveSpeedY = this.speedY * slowFactor;

        if (this.type === 'dart') {
            if (this.isDashing) {
                this.y += effectiveSpeedY * 3.0;
                this.dashDuration--;
                if (this.dashDuration <= 0) {
                    this.isDashing = false;
                    this.dashTimer = Math.floor(Math.random() * 140) + 200;
                }
            } else {
                this.y += effectiveSpeedY;
                this.dashTimer--;
                if (this.dashTimer <= 0 && this.y > 40 && this.y < state.height - 200) {
                    this.isDashing = true;
                    this.dashDuration = 22;
                    createParticles(this.x, this.y, '#00ffea', 8);
                }
            }
        } else if (this.type === 'tank') {
            this.y += effectiveSpeedY;
            if (this.shieldActive) {
                this.shieldDuration--;
                if (this.shieldDuration <= 0) {
                    this.shieldActive = false;
                    this.shieldCooldown = 260;
                }
            } else {
                this.shieldCooldown--;
                if (this.shieldCooldown <= 0) {
                    this.shieldActive = true;
                    this.shieldDuration = 120;
                    sound.playAbility();
                }
            }
        } else if (this.type === 'phantom') {
            this.y += effectiveSpeedY;
            this.teleportCooldown--;
            if (this.teleportCooldown <= 0 && this.y > 50 && this.y < state.height - 120) {
                createParticles(this.x, this.y, '#b042ff', 12);
                const shift = (Math.random() - 0.5) * 160;
                this.baseX = Math.max(this.radius + 15, Math.min(state.width - this.radius - 15, this.baseX + shift));
                createParticles(this.baseX, this.y, '#ffffff', 12);
                this.teleportCooldown = Math.floor(Math.random() * 100) + 200;
                sound.playAbility();
            }
        } else if (this.type === 'healer') {
            this.y += effectiveSpeedY;
            this.healCooldown--;
            if (this.healCooldown <= 0) {
                this.healCooldown = 200;
                let healedAny = false;
                for (let other of state.invaders) {
                    if (other !== this && Math.hypot(other.x - this.x, other.y - this.y) < 140) {
                        if (other.hp < other.maxHp) {
                            other.hp = Math.min(other.maxHp, other.hp + 1);
                            createParticles(other.x, other.y, '#ffff33', 6);
                            healedAny = true;
                        }
                    }
                }
                if (healedAny) sound.playAbility();
            }
        } else {
            this.y += effectiveSpeedY;
        }

        this.wobble += this.wobbleSpeed;
        const amp = (this.type === 'mini_drone' ? 36 : 18);
        this.x = this.baseX + Math.sin(this.wobble) * amp;

        const minX = this.radius + 6;
        const maxX = state.width - this.radius - 6;
        if (this.x < minX) {
            this.x = minX;
            this.baseX = minX + amp;
        } else if (this.x > maxX) {
            this.x = maxX;
            this.baseX = maxX - amp;
        }

        if (this.type !== 'mini_drone') {
            this.shootCooldown--;
            if (this.shootCooldown <= 0 && this.y > 60 && this.y < state.height - 100) {
                const aimChance = {
                    disruptor: 1.0,
                    healer: 0.0,
                    scout: 0.15,
                    tank: 0.25,
                    splitter: 0.20,
                    dart: 0.45,
                    phantom: 0.50
                }[this.type] || 0;
                const angle = Math.random() < aimChance
                    ? Math.atan2((state.height - 52) - this.y, state.player.x - this.x)
                    : Math.PI / 2;

                if (this.type === 'disruptor') {
                    state.enemyBullets.push(new Bullet(this.x, this.y, angle, '#ff00aa', true, true));
                } else {
                    state.enemyBullets.push(new Bullet(this.x, this.y, angle, '#ff0055', true, false));
                }
                const baseCooldown = Math.max(90, 220 - this.wave * 4);
                this.shootCooldown = Math.floor(Math.random() * baseCooldown) + baseCooldown;
            }
        }
    }

    draw() {
        state.ctx.save();
        state.ctx.translate(this.x, this.y);
        state.ctx.strokeStyle = this.color;
        state.ctx.fillStyle = 'rgba(15, 8, 28, 0.85)';
        state.ctx.lineWidth = 2.2;
        
        if (this.type === 'tank' && this.shieldActive) {
            state.ctx.save();
            state.ctx.strokeStyle = '#00f0ff';
            state.ctx.lineWidth = 3;
            state.ctx.beginPath();
            state.ctx.arc(0, 0, this.radius + 9, 0, Math.PI * 2);
            state.ctx.stroke();
            state.ctx.restore();
        }
        if (this.type === 'healer') {
            state.ctx.save();
            state.ctx.strokeStyle = 'rgba(255, 255, 100, 0.35)';
            state.ctx.setLineDash([4, 4]);
            state.ctx.beginPath();
            state.ctx.arc(0, 0, 36, 0, Math.PI * 2);
            state.ctx.stroke();
            state.ctx.restore();
        }
        
        state.ctx.beginPath();
        if (this.type === 'dart') {
            state.ctx.moveTo(0, this.radius * 1.3);
            state.ctx.lineTo(-this.radius * 0.7, -this.radius);
            state.ctx.lineTo(0, -this.radius * 0.3);
            state.ctx.lineTo(this.radius * 0.7, -this.radius);
        } else if (this.type === 'tank') {
            const r = this.radius;
            state.ctx.rect(-r, -r * 0.8, r * 2, r * 1.6);
        } else if (this.type === 'splitter') {
            state.ctx.moveTo(0, this.radius);
            state.ctx.lineTo(this.radius, 0);
            state.ctx.lineTo(0, -this.radius);
            state.ctx.lineTo(-this.radius, 0);
        } else if (this.type === 'mini_drone') {
            state.ctx.moveTo(0, this.radius);
            state.ctx.lineTo(-this.radius, -this.radius * 0.8);
            state.ctx.lineTo(this.radius, -this.radius * 0.8);
        } else if (this.type === 'disruptor') {
            const r = this.radius;
            state.ctx.moveTo(-r * 0.5, -r);
            state.ctx.lineTo(r * 0.5, -r);
            state.ctx.lineTo(r, -r * 0.3);
            state.ctx.lineTo(r * 0.5, r);
            state.ctx.lineTo(-r * 0.5, r);
            state.ctx.lineTo(-r, -r * 0.3);
        } else if (this.type === 'phantom') {
            const r = this.radius;
            state.ctx.arc(0, -r * 0.2, r * 0.8, Math.PI, 0, false);
            state.ctx.lineTo(r * 0.8, r);
            state.ctx.lineTo(0, r * 0.5);
            state.ctx.lineTo(-r * 0.8, r);
        } else if (this.type === 'healer') {
            const r = this.radius;
            const w = r * 0.6;
            // Draw a full 12-point plus/cross polygon
            state.ctx.moveTo(-w / 2, -r);
            state.ctx.lineTo(w / 2, -r);
            state.ctx.lineTo(w / 2, -w / 2);
            state.ctx.lineTo(r, -w / 2);
            state.ctx.lineTo(r, w / 2);
            state.ctx.lineTo(w / 2, w / 2);
            state.ctx.lineTo(w / 2, r);
            state.ctx.lineTo(-w / 2, r);
            state.ctx.lineTo(-w / 2, w / 2);
            state.ctx.lineTo(-r, w / 2);
            state.ctx.lineTo(-r, -w / 2);
            state.ctx.lineTo(-w / 2, -w / 2);
        } else {
            state.ctx.moveTo(0, this.radius);
            state.ctx.lineTo(-this.radius, -this.radius);
            state.ctx.lineTo(0, -this.radius * 0.4);
            state.ctx.lineTo(this.radius, -this.radius);
        }
        state.ctx.closePath();
        state.ctx.fill();
        state.ctx.stroke();
        
        if (this.maxHp > 1) {
            const barW = this.radius * 2 + 4;
            const barH = 4;
            const barY = -this.radius - 9;
            state.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            state.ctx.fillRect(-barW / 2, barY, barW, barH);
            const hpRatio = Math.max(0, this.hp / this.maxHp);
            state.ctx.fillStyle = hpRatio > 0.5 ? '#00ffaa' : (hpRatio > 0.25 ? '#ffea00' : '#ff0055');
            state.ctx.fillRect(-barW / 2, barY, barW * hpRatio, barH);
        }
        state.ctx.restore();
    }
}
