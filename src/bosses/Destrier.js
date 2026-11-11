// src/bosses/Destrier.js
import Boss from './Boss.js';
import { state, GameState, triggerShake } from '../state.js';
import { sound } from '../audio.js';
import Bullet from '../entities/Bullet.js';
import Shockwave from '../fx/Shockwave.js';
import { createParticles, updateHearts, updateHud } from '../main.js';

// Helper to retrieve developer mode modifiers for Destrier
function getBossDevModifier() {
    if (!state.devSettings || !state.devSettings.active) {
        return { hp: 1.0, speed: 1.0, dmg: 1.0, aimChance: 1.0 };
    }
    if (state.devSettings.mode === 'specific' && state.devSettings.specific && state.devSettings.specific.boss_destrier) {
        return state.devSettings.specific.boss_destrier;
    }
    return state.devSettings.global || { hp: 1.0, speed: 1.0, dmg: 1.0, aimChance: 1.0 };
}

// --- Math Helpers for Boss Hitboxes & Lasers ---
function pointInPolygon(x, y, points) {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        let xi = points[i][0], yi = points[i][1];
        let xj = points[j][0], yj = points[j][1];
        let intersects = ((yi > y) !== (yj > y)) &&
            (x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1e-9) + xi);
        if (intersects) inside = !inside;
    }
    return inside;
}

function pointNearSegment(px, py, ax, ay, bx, by, radius) {
    const dx = bx - ax;
    const dy = by - ay;
    const lengthSq = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSq));
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy)) <= radius;
}

// --- Boss Data ---
const DESTRIER_PROJECT = {
    shapes: [
       { type: 'circle', cx: 256, cy: 256, r: 121, color: '#ff007f', stroke: 2 },
       { type: 'poly', pts: [[160,192],[160,320],[0,320],[0,192]], color: '#ff007f', stroke: 2 },
       { type: 'poly', pts: [[352,192],[352,320],[512,320],[512,192]], color: '#ff007f', stroke: 2 },
       { type: 'poly', pts: [[320,336],[352,336],[352,384],[320,384]], color: '#ff2a2a', stroke: 2 },
       { type: 'poly', pts: [[192,336],[160,336],[160,384],[192,384]], color: '#ff2a2a', stroke: 2 },
       { type: 'poly', pts: [[32,320],[64,320],[64,352],[32,352]], color: '#ff2a2a', stroke: 2 },
       { type: 'poly', pts: [[480,320],[448,320],[448,352],[480,352]], color: '#ff2a2a', stroke: 2 },
       { type: 'circle', cx: 256, cy: 256, r: 24, color: '#00ff66', stroke: 2 }
    ],
    hitbox: [
       [0,320],[32,320],[32,352],[64,352],[64,320],[160,320],[160,384],[192,384],
       [192,368],[208,368],[224,368],[224,384],[272,384],[272,368],[320,368],[320,384],
       [352,384],[352,320],[448,320],[448,352],[480,352],[480,320],[512,320],[512,192],
       [352,192],[352,128],[160,128],[160,192],[0,192]
    ],
    muzzles: [
       { id: 1, x: 48, y: 352 },
       { id: 2, x: 464, y: 352 },
       { id: 3, x: 176, y: 384 },
       { id: 4, x: 336, y: 384 }
    ],
    pivot: { x: 256, y: 256 }
};

class Destrier extends Boss {
    constructor() {
        const mod = getBossDevModifier();
        const baseHp = Math.max(1, Math.round(420 * (mod.hp || 1.0)));
        const baseSpeed = 2.2 * (mod.speed || 1.0);

        super(state.width / 2, Math.max(140, state.height * 0.28), baseHp, baseSpeed);
        
        const dmgFactor = mod.dmg || 1.0;
        this.shotCooldown = Math.max(15, Math.floor(40 / dmgFactor));
        this.laserCooldown = Math.max(60, Math.floor(330 / dmgFactor));
        this.laserWarning = 0;
        this.laserActive = 0;
        this.lasers = [];
        this.shields = [
            { x: state.width * 0.35, y: state.height * 0.62, radius: 18, phase: 0 },
            { x: state.width * 0.65, y: state.height * 0.62, radius: 18, phase: Math.PI }
        ];
    }

    localPoint(localX, localY) {
        const scale = Math.max(0.42, Math.min(0.52, (state.width - 80) / 512));
        return {
            x: this.x + (localX - DESTRIER_PROJECT.pivot.x) * scale,
            y: this.y + (localY - DESTRIER_PROJECT.pivot.y) * scale
        };
    }

    beginLaserPattern() {
        const phaseTwo = this.hp < this.maxHp * 0.5;
        this.stopped = true;
        this.laserWarning = 90;
        this.laserActive = 0;
        this.lasers = [];

        const left = this.localPoint(DESTRIER_PROJECT.muzzles[2].x, DESTRIER_PROJECT.muzzles[2].y);
        const right = this.localPoint(DESTRIER_PROJECT.muzzles[3].x, DESTRIER_PROJECT.muzzles[3].y);
        
        this.lasers.push({
            x1: left.x, y1: left.y, x2: left.x, y2: state.height + 100,
            width: 34, color: '#ff2a2a', isDiagonal: false
        });
        this.lasers.push({
            x1: right.x, y1: right.y, x2: right.x, y2: state.height + 100,
            width: 34, color: '#ff2a2a', isDiagonal: false
        });

        if (phaseTwo) {
            for (let i = 0; i < 2; i++) {
                const muzzle = DESTRIER_PROJECT.muzzles[i];
                const start = this.localPoint(muzzle.x, muzzle.y);
                const targetX = 50 + Math.random() * (state.width - 100);
                const targetY = state.player.y;
                const angle = Math.atan2(targetY - start.y, targetX - start.x);
                const laserLength = 3000;
                this.lasers.push({
                    x1: start.x, y1: start.y, x2: start.x + Math.cos(angle) * laserLength, y2: start.y + Math.sin(angle) * laserLength,
                    width: 30, color: '#ff2a2a', isDiagonal: true
                });
            }
        }
        sound.playAbility();
    }
}

// --- Exported Control Methods ---

export function startBossFight() {
    state.bossActive = true;
    state.boss = new Destrier();
    state.current = GameState.BOSS_FIGHT;
    state.invaders = [];
    state.enemyBullets = [];
    state.bullets = [];
    state.powerups = [];
    state.player.novaCharge = 0;
    updateHearts();
    updateHud();
    
    const banner = document.getElementById('wave-banner');
    if (banner) {
        banner.textContent = 'Le noble Destrier';
        banner.classList.add('active');
        setTimeout(() => banner.classList.remove('active'), 2100);
    }
}

export function updateBossFight() {
    const boss = state.boss;
    if (!boss || !state.player) return;

    state.player.update();
    state.player.novaCharge = (1 - boss.hp / boss.maxHp) * 100;

    const phaseTwo = boss.hp < boss.maxHp * 0.5;

    for (let i = 0; i < boss.shields.length; i++) {
        const shield = boss.shields[i];
        shield.phase = (shield.phase || 0) + (phaseTwo ? 0.04 : 0.03);
        shield.x = state.width * 0.5 + Math.sin(shield.phase) * (state.width * 0.28);
        shield.y = Math.min(state.height - 120, Math.max(boss.y + 120, state.height * 0.62));
    }

    boss.updateMove(phaseTwo ? 1.2 : 1);

    if (boss.laserWarning > 0) {
        boss.laserWarning--;
        if (boss.laserWarning === 0) {
            boss.laserActive = 150;
        }
    } else if (boss.laserActive > 0) {
        boss.laserActive--;
        for (let i = 0; i < boss.lasers.length; i++) {
            const laser = boss.lasers[i];
            const hit = pointNearSegment(state.player.x, state.player.y, laser.x1, laser.y1, laser.x2, laser.y2, laser.width / 2 + state.player.radius * 0.6);
            if (hit) {
                state.player.takeDamage();
                if (state.current === GameState.GAMEOVER) return;
            }
        }
        if (boss.laserActive === 0) {
            boss.stopped = false;
            boss.lasers = [];
        }
    } else {
        boss.stopped = false;
        boss.laserCooldown--;
        if (boss.laserCooldown <= 0) {
            const mod = getBossDevModifier();
            boss.beginLaserPattern();
            const dmgFactor = mod.dmg || 1.0;
            boss.laserCooldown = Math.max(60, Math.floor((phaseTwo ? 210 : 350) / dmgFactor));
        }
    }

    if (!boss.stopped) {
        boss.shotCooldown--;
        if (boss.shotCooldown <= 0) {
            const mod = getBossDevModifier();
            const dmgFactor = mod.dmg || 1.0;
            const muzzleOffset = Math.max(15, Math.floor((phaseTwo ? 42 : 62) / dmgFactor));
            const baseAimChance = 1.0;
            const effectiveAimChance = Math.max(0, Math.min(1.0, baseAimChance * (mod.aimChance !== undefined ? mod.aimChance : 1.0)));

            for (let i = 0; i < 2; i++) {
                const muzzle = DESTRIER_PROJECT.muzzles[i];
                const start = boss.localPoint(muzzle.x, muzzle.y);
                const angle = Math.random() < effectiveAimChance
                    ? Math.atan2(state.player.y - start.y, state.player.x - start.x)
                    : Math.PI / 2;

                const bulletDmg = 1 * dmgFactor;
                state.enemyBullets.push(new Bullet(start.x, start.y, angle, '#ff0055', true, false, bulletDmg));
            }
            boss.shotCooldown = muzzleOffset;
        }
    }

    // Bullets collision with shields and boss
    for (let i = state.bullets.length - 1; i >= 0; i--) {
        const bullet = state.bullets[i];
        bullet.update();
        if (bullet.life <= 0 || bullet.y < -20 || bullet.x < 0 || bullet.x > state.width) {
            state.bullets.splice(i, 1);
            continue;
        }
        let blocked = false;
        for (let s = 0; s < boss.shields.length; s++) {
            const shield = boss.shields[s];
            if (Math.hypot(bullet.x - shield.x, bullet.y - shield.y) < bullet.radius + shield.radius) {
                createParticles(bullet.x, bullet.y, '#8ffcff', 4);
                state.bullets.splice(i, 1);
                blocked = true;
                break;
            }
        }
        if (blocked) continue;

        if (boss.laserActive > 0) {
            for (let l = 0; l < boss.lasers.length; l++) {
                const laser = boss.lasers[l];
                if (laser.isDiagonal) {
                    const hit = pointNearSegment(bullet.x, bullet.y, laser.x1, laser.y1, laser.x2, laser.y2, (laser.width / 2) + bullet.radius);
                    if (hit) {
                        createParticles(bullet.x, bullet.y, '#ff2a2a', 6);
                        state.bullets.splice(i, 1);
                        blocked = true;
                        break;
                    }
                }
            }
        }
        if (blocked) continue;

        const scale = Math.max(0.42, Math.min(0.52, (state.width - 80) / 512));
        const localX = (bullet.x - boss.x) / scale + DESTRIER_PROJECT.pivot.x;
        const localY = (bullet.y - boss.y) / scale + DESTRIER_PROJECT.pivot.y;

        if (pointInPolygon(localX, localY, DESTRIER_PROJECT.hitbox)) {
            const center = boss.localPoint(256, 256);
            const weakPointOpen = boss.laserActive > 0 && Math.hypot(bullet.x - center.x, bullet.y - center.y) < 40;
            const damage = weakPointOpen ? bullet.damage * 2 : bullet.damage;
            boss.takeDamage(damage);
            createParticles(bullet.x, bullet.y, weakPointOpen ? '#00ff66' : '#ff007f', 6);
            state.bullets.splice(i, 1);
            updateHearts();
            updateHud();
            if (boss.hp <= 0) {
                startBossVictoryCutscene();
                return;
            }
        }
    }

    // Enemy bullets collision with player
    for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
        const bullet = state.enemyBullets[i];
        bullet.update();
        if (bullet.y > state.height + 30 || bullet.x < -30 || bullet.x > state.width + 30) {
            state.enemyBullets.splice(i, 1);
            continue;
        }
        const dist = Math.hypot(bullet.x - state.player.x, bullet.y - state.player.y);
        if (dist < bullet.radius + state.player.radius) {
            state.enemyBullets.splice(i, 1);
            state.player.takeDamage();
            if (state.current === GameState.GAMEOVER) return;
        }
    }

    // Update particles
    for (let i = state.particles.length - 1; i >= 0; i--) {
        const pt = state.particles[i];
        pt.update();
        if (pt.life <= 0) state.particles.splice(i, 1);
    }
}

export function drawBoss() {
    const boss = state.boss;
    if (!boss || !state.bossActive) return;
    
    const scale = Math.max(0.42, Math.min(0.52, (state.width - 80) / 512));

    if (boss.laserWarning > 0) {
        state.ctx.save();
        state.ctx.strokeStyle = 'rgba(255, 42, 42, 0.28)';
        state.ctx.setLineDash([8, 10]);
        state.ctx.lineWidth = 3;
        for (let i = 0; i < boss.lasers.length; i++) {
            const laser = boss.lasers[i];
            state.ctx.beginPath();
            state.ctx.moveTo(laser.x1, laser.y1);
            state.ctx.lineTo(laser.x2, laser.y2);
            state.ctx.stroke();
        }
        state.ctx.restore();
    }

    if (boss.laserActive > 0) {
        state.ctx.save();
        state.ctx.strokeStyle = '#ff0033';
        state.ctx.shadowColor = '#ff0033';
        state.ctx.shadowBlur = 18;
        state.ctx.lineWidth = 2;
        for (let i = 0; i < boss.lasers.length; i++) {
            const laser = boss.lasers[i];
            state.ctx.beginPath();
            state.ctx.moveTo(laser.x1, laser.y1);
            state.ctx.lineTo(laser.x2, laser.y2);
            state.ctx.stroke();
        }
        state.ctx.restore();
    }

    for (let i = 0; i < boss.shields.length; i++) {
        const shield = boss.shields[i];
        state.ctx.save();
        state.ctx.translate(shield.x, shield.y);
        state.ctx.fillStyle = 'rgba(7, 15, 30, 0.95)';
        state.ctx.strokeStyle = '#8ffcff';
        state.ctx.shadowColor = '#00f0ff';
        state.ctx.shadowBlur = 18;
        state.ctx.lineWidth = 2.5;
        state.ctx.beginPath();
        state.ctx.moveTo(-24, 0);
        state.ctx.lineTo(-12, -12);
        state.ctx.lineTo(12, -12);
        state.ctx.lineTo(24, 0);
        state.ctx.lineTo(12, 12);
        state.ctx.lineTo(-12, 12);
        state.ctx.closePath();
        state.ctx.fill();
        state.ctx.stroke();
        state.ctx.restore();
    }

    state.ctx.save();
    state.ctx.translate(boss.x, boss.y);
    state.ctx.scale(scale, scale);
    state.ctx.translate(-DESTRIER_PROJECT.pivot.x, -DESTRIER_PROJECT.pivot.y);

    for (let i = 0; i < DESTRIER_PROJECT.shapes.length; i++) {
        const shape = DESTRIER_PROJECT.shapes[i];
        state.ctx.beginPath();
        state.ctx.strokeStyle = shape.color;
        state.ctx.fillStyle = shape.type === 'circle'
            ? (shape.r === 24 ? 'rgba(0,255,102,0.9)' : 'rgba(30,5,25,0.92)')
            : 'rgba(30,5,25,0.92)';
        state.ctx.shadowColor = shape.color;
        state.ctx.shadowBlur = shape.r === 24 ? 18 : 12;
        
        if (shape.type === 'circle') {
            state.ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2);
        } else {
            shape.pts.forEach((pt, idx) => {
                if (idx === 0) state.ctx.moveTo(pt[0], pt[1]);
                else state.ctx.lineTo(pt[0], pt[1]);
            });
            state.ctx.closePath();
        }
        state.ctx.fill();
        state.ctx.stroke();
    }

    if (boss.laserActive > 0) {
        state.ctx.beginPath();
        state.ctx.strokeStyle = '#ffffff';
        state.ctx.lineWidth = 3;
        state.ctx.shadowColor = '#00ff66';
        state.ctx.shadowBlur = 20;
        state.ctx.arc(256, 256, 34, 0, Math.PI * 2);
        state.ctx.stroke();
    }
    state.ctx.restore();
}

export function startBossVictoryCutscene() {
    const boss = state.boss;
    if (!boss || !state.player) return;

    boss.hp = 0;
    boss.defeated = true;
    boss.stopped = true;
    boss.lasers = [];
    boss.laserWarning = 0;
    boss.laserActive = 0;

    state.current = GameState.BOSS_CUTSCENE;
    state.victoryCutsceneTimer = 0;
    state.player.novaCharge = 100;
    state.enemyBullets = [];
    state.bullets = [];

    sound.playNova();
    triggerShake(20);
    state.shockwaves.push(new Shockwave(state.player.x, state.player.y, Math.max(state.width, state.height)));

    const banner = document.getElementById('wave-banner');
    if (banner) {
        banner.textContent = 'NOVA — VICTOIRE';
        banner.classList.add('active');
    }
}
