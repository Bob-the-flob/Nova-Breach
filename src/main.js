// src/main.js
import { GameState, state, triggerShake } from './state.js';
import { sound } from './audio.js';
import { SHIP_SKINS, STYLE_UPGRADE, RANDOM_UPGRADE_POOL } from './config.js';
import PlayerShip from './entities/Player.js';
import Invader from './entities/Invader.js';
import PowerUp from './entities/PowerUp.js';
import Particle from './fx/Particle.js';
import Shockwave from './fx/Shockwave.js';
import { startBossFight, updateBossFight, drawBoss, startBossVictoryCutscene } from './bosses/Destrier.js';

/* ==============================================================
   INITIALISATION ET CONTRÔLES HORIZONTAUX
   ============================================================== */
state.canvas = document.getElementById('gameCanvas');
state.ctx = state.canvas.getContext('2d');
const breachFlash = document.getElementById('breach-flash');
const touchNovaBtn = document.getElementById('touch-nova-btn');

export function resize() {
    state.dpr = window.devicePixelRatio || 1;
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    state.canvas.width = Math.floor(state.width * state.dpr);
    state.canvas.height = Math.floor(state.height * state.dpr);
    state.canvas.style.width = state.width + 'px';
    state.canvas.style.height = state.height + 'px';
}
window.addEventListener('resize', resize);
resize();

export function togglePause() {
    if ([GameState.PLAYING, GameState.BOSS_FIGHT, GameState.BOSS_CUTSCENE].includes(state.current)) {
        state.pausedFromState = state.current;
        state.current = GameState.PAUSED;

        const pauseScreen = document.getElementById('pause-screen');
        if (pauseScreen) pauseScreen.classList.remove('hidden');

        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) pauseBtn.textContent = 'REPRENDRE';
    } else if (state.current === GameState.PAUSED) {
        state.current = state.pausedFromState || GameState.PLAYING;
        state.pausedFromState = null;

        const pauseScreen = document.getElementById('pause-screen');
        if (pauseScreen) pauseScreen.classList.add('hidden');

        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) pauseBtn.textContent = 'PAUSE';
    }
}

export function returnToMainMenu() {
    state.current = GameState.MENU;
    state.pausedFromState = null;
    state.bossActive = false;
    state.boss = null;
    state.bullets = [];
    state.enemyBullets = [];
    state.invaders = [];
    state.powerups = [];
    state.particles = [];
    state.shockwaves = [];

    const pauseScreen = document.getElementById('pause-screen');
    if (pauseScreen) pauseScreen.classList.add('hidden');

    const bossHealth = document.getElementById('boss-health');
    if (bossHealth) bossHealth.classList.add('hidden');

    const lvlScreen = document.getElementById('levelup-screen');
    if (lvlScreen) lvlScreen.classList.add('hidden');

    const victoryScreen = document.getElementById('victory-screen');
    if (victoryScreen) victoryScreen.classList.add('hidden');

    const goScreen = document.getElementById('gameover-screen');
    if (goScreen) goScreen.classList.add('hidden');

    const startScreen = document.getElementById('start-screen');
    if (startScreen) startScreen.classList.remove('hidden');

    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) pauseBtn.textContent = 'PAUSE';

    updateHud();
}

// Input Listeners
window.addEventListener('keydown', (e) => {
    sound.init();
    if (e.code === 'KeyP' || e.code === 'Escape') {
        togglePause();
        return;
    }
    if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'KeyQ') state.keys.left = true;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') state.keys.right = true;
    if (e.code === 'Space' || e.key === ' ' || e.key.toLowerCase() === 'e') {
        e.preventDefault();
        if (state.current === GameState.PLAYING || state.current === GameState.BOSS_FIGHT) {
            triggerNova();
        }
    }
});
window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'KeyQ') state.keys.left = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') state.keys.right = false;
});
window.addEventListener('touchstart', (e) => {
    sound.init();
    if (e.touches.length > 0) {
        state.isTouching = true;
        state.targetX = e.touches[0].clientX;
    }
}, { passive: true });
window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        state.targetX = e.touches[0].clientX;
    }
}, { passive: true });
window.addEventListener('touchend', () => {
    state.isTouching = false;
});
window.addEventListener('mousemove', (e) => {
    if (!state.keys.left && !state.keys.right) {
        state.targetX = e.clientX;
    }
});
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (state.current === GameState.PLAYING || state.current === GameState.BOSS_FIGHT) triggerNova();
});

if (touchNovaBtn) {
    touchNovaBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        sound.init();
        if ((state.current === GameState.PLAYING || state.current === GameState.BOSS_FIGHT) && !state.bossActive) {
            triggerNova();
        }
    }, { passive: false });
    touchNovaBtn.addEventListener('click', () => {
        sound.init();
        if ((state.current === GameState.PLAYING || state.current === GameState.BOSS_FIGHT) && !state.bossActive) {
            triggerNova();
        }
    });
}

/* ==============================================================
   GAME LOGIC & HELPERS
   ============================================================== */
export function triggerBreachWarning() {
    if (breachFlash) {
        breachFlash.style.opacity = '1';
        setTimeout(() => {
            breachFlash.style.opacity = '0';
        }, 250);
    }
}

export function createParticles(x, y, color, count = 20) {
    if (state.particles.length > 120) count = Math.min(count, 5);
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 4.5 + 1.2;
        state.particles.push(new Particle(
            x, y,
            Math.cos(angle) * spd,
            Math.sin(angle) * spd,
            Math.random() * 2.5 + 1.2,
            color,
            Math.floor(Math.random() * 16 + 12)
        ));
    }
}

export function triggerNova() {
    if (state.current === GameState.BOSS_FIGHT && state.boss) return;
    
    if (state.player && state.player.novaCharge >= 98) {
        state.player.novaCharge = 0;
        sound.playNova();
        triggerShake(20);
        state.shockwaves.push(new Shockwave(state.player.x, state.player.y, Math.max(state.width, state.height)));
        
        for (let eb of state.enemyBullets) {
            createParticles(eb.x, eb.y, '#ff0055', 6);
        }
        state.enemyBullets = [];
        
        for (let i = state.invaders.length - 1; i >= 0; i--) {
            const inv = state.invaders[i];
            inv.hp -= (5 + state.player.damageLevel);
            if (inv.hp <= 0) {
                sound.playExplosion(inv.type === 'tank');
                createParticles(inv.x, inv.y, inv.color, 24);
                addScore(inv.points);
                state.invaders.splice(i, 1);
                state.kills++;
            }
        }
    }
}

export function addScore(pts) {
    state.score += Math.round(pts * state.combo);
    state.combo = Math.min(4.0, +(state.combo + 0.1).toFixed(1));
    state.comboTimer = 160 + (state.player ? state.player.comboBonusTime : 0);
    updateHud();
}

/* ==============================================================
   UI, HUD, AND SCREENS
   ============================================================== */
const hudScore = document.getElementById('hud-score');
const hudCombo = document.getElementById('hud-combo');
const hudWave = document.getElementById('hud-wave');
const hudNovaFill = document.getElementById('hud-nova-fill');
const hudHearts = document.getElementById('hud-hearts');
const hudStatus = document.getElementById('hud-status');

export function updateHud() {
    if (hudScore) hudScore.textContent = state.score.toLocaleString();
    if (hudCombo) hudCombo.textContent = `x${state.combo.toFixed(1)} Combo`;
    if (hudWave) {
        hudWave.textContent = state.bossActive ? 'Le noble Destrier' : state.wave;
    }
    if (hudStatus) {
        if (state.player && state.player.empTimer > 0) hudStatus.classList.remove('hidden');
        else hudStatus.classList.add('hidden');
    }
    if (hudNovaFill) {
        if (state.bossActive && state.boss) {
            hudNovaFill.style.width = `${Math.max(0, Math.min(100, (1 - state.boss.hp / state.boss.maxHp) * 100))}%`;
        } else {
            hudNovaFill.style.width = `${state.player ? state.player.novaCharge : 0}%`;
        }
    }
    if (touchNovaBtn) {
        if (state.bossActive) {
            touchNovaBtn.classList.add('boss-disabled');
            touchNovaBtn.classList.remove('ready');
        } else if (state.player && state.player.novaCharge >= 98) {
            touchNovaBtn.classList.add('ready');
            touchNovaBtn.classList.remove('boss-disabled');
        } else {
            touchNovaBtn.classList.remove('ready');
            touchNovaBtn.classList.remove('boss-disabled');
        }
    }
}

export function updateHearts() {
    if (!hudHearts || !state.player) return;
    if (state.bossActive) {
        hudHearts.innerHTML = `
            <div class="player-health-bar">
                <div class="player-health-fill" style="width:${Math.max(0, Math.min(100, (state.player.health / state.player.maxHealth) * 100))}%"></div>
            </div>
        `;
        return;
    }
    hudHearts.innerHTML = '';
    for (let i = 0; i < state.player.maxHealth; i++) {
        const h = document.createElement('span');
        h.className = 'heart' + (i >= state.player.health ? ' lost' : '');
        h.textContent = '♥';
        hudHearts.appendChild(h);
    }
}

/* --- Level Up & Rewards --- */
export function presentLevelUpChoices() {
    state.current = GameState.UPGRADING;
    sound.playLevelUp();
    const container = document.getElementById('upgrades-container');
    if (!container) return;
    container.innerHTML = '';
    
    const currentSkinIdx = state.player ? state.player.skinIndex : 0;
    const isMaxed = currentSkinIdx >= SHIP_SKINS.length - 1;
    
    const styleCard = document.createElement('div');
    styleCard.className = 'upgrade-card style-card' + (isMaxed ? ' maxed' : '');
    styleCard.innerHTML = `
       <div class="upgrade-icon" style="background: rgba(255, 234, 0, 0.15); border-color: #ffea00;">${STYLE_UPGRADE.icon}</div>
       <div class="upgrade-info">
          <div class="upgrade-title">
             <span>${STYLE_UPGRADE.name}</span>
             <span class="upgrade-level-badge">${isMaxed ? 'MAX' : `Châssis ${currentSkinIdx + 2}/10`}</span>
          </div>
          <div class="upgrade-desc" style="color: #f1f5f9;">${STYLE_UPGRADE.getDesc(currentSkinIdx)}</div>
       </div>
    `;
    if (!isMaxed) {
        styleCard.onclick = () => {
            STYLE_UPGRADE.apply(state.player);
            closeUpgradeScreen();
        };
    }
    container.appendChild(styleCard);
 
    const shuffled = [...RANDOM_UPGRADE_POOL].sort(() => Math.random() - 0.5);
    const choices = shuffled.slice(0, 3);
    choices.forEach(upg => {
        const currentLvl = (state.player && state.player.upgrades[upg.id]) || 0;
        const nextLvl = currentLvl + 1;
        const card = document.createElement('div');
        card.className = 'upgrade-card';
        card.innerHTML = `
           <div class="upgrade-icon">${upg.icon}</div>
           <div class="upgrade-info">
              <div class="upgrade-title">
                 <span>${upg.name}</span>
                 <span class="upgrade-level-badge">Niv. ${nextLvl}</span>
              </div>
              <div class="upgrade-desc">${upg.getDesc(nextLvl)}</div>
           </div>
        `;
        card.onclick = () => {
            selectRandomUpgrade(upg);
        };
        container.appendChild(card);
    });
 
    const subTitle = document.getElementById('levelup-subtitle');
    if (subTitle) subTitle.textContent = `FIN DE LA VAGUE ${state.wave} — AMÉLIORATION DISPONIBLE`;
    const lvlScreen = document.getElementById('levelup-screen');
    if (lvlScreen) lvlScreen.classList.remove('hidden');
}
 
export function selectRandomUpgrade(upg) {
    if (!state.player) return;
    state.player.upgrades[upg.id] = (state.player.upgrades[upg.id] || 0) + 1;
    upg.apply(state.player, state.player.upgrades[upg.id]);
    sound.playPowerup();
    closeUpgradeScreen();
}
 
export function closeUpgradeScreen() {
    const lvlScreen = document.getElementById('levelup-screen');
    if (lvlScreen) lvlScreen.classList.add('hidden');
    if (state.current === GameState.BOSS_REWARDS) return;
    if (state.wave === 15 && state.bossActive) return;
    
    startWave(state.wave + 1);
    state.current = GameState.PLAYING;
}

/* --- Victory Logic --- */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function showVictoryScreen() {
    state.current = GameState.BOSS_REWARDS;
    const el = document.getElementById('victory-screen');
    const timeEl = document.getElementById('victory-time');
    if (el) el.classList.remove('hidden');
    if (timeEl) timeEl.textContent = formatTime(state.totalPlaySeconds);
}

export function continueFromVictory() {
    const victoryScreen = document.getElementById('victory-screen');
    if (victoryScreen) victoryScreen.classList.add('hidden');
    state.bossRewardStage = 0;
    openBossRewards();
}

export function applyBossReward(upgrade) {
    if (!state.player) return;
    state.player.upgrades[upgrade.id] = (state.player.upgrades[upgrade.id] || 0) + 1;
    upgrade.apply(state.player, state.player.upgrades[upgrade.id]);
    sound.playPowerup();
    state.bossRewardStage++;
    
    if (state.bossRewardStage < 2) {
       openBossRewards();
    } else {
       openStyleReward();
    }
}

export function openBossRewards() {
    const screen = document.getElementById('levelup-screen');
    const container = document.getElementById('upgrades-container');
    const subtitle = document.getElementById('levelup-subtitle');
    if (!screen || !container || !subtitle) return;
 
    container.innerHTML = '';
    subtitle.textContent = state.bossRewardStage === 0
        ? 'RÉCOMPENSE BOSS — CHOISISSEZ VOTRE 1ER AMÉLIORATION'
        : 'RÉCOMPENSE BOSS — CHOISISSEZ VOTRE 2E AMÉLIORATION';
 
    RANDOM_UPGRADE_POOL.forEach(upg => {
        const currentLvl = (state.player && state.player.upgrades[upg.id]) || 0;
        const nextLvl = currentLvl + 1;
        const card = document.createElement('div');
        card.className = 'upgrade-card';
        card.innerHTML = `
           <div class="upgrade-icon">${upg.icon}</div>
           <div class="upgrade-info">
               <div class="upgrade-title">
                   <span>${upg.name}</span>
                   <span class="upgrade-level-badge">Niv. ${nextLvl}</span>
               </div>
               <div class="upgrade-desc">${upg.getDesc(nextLvl)}</div>
           </div>`;
        card.onclick = () => {
            applyBossReward(upg);
        };
        container.appendChild(card);
    });
 
    screen.classList.remove('hidden');
}

export function openStyleReward() {
    const screen = document.getElementById('levelup-screen');
    const container = document.getElementById('upgrades-container');
    const subtitle = document.getElementById('levelup-subtitle');
    if (!screen || !container || !subtitle) return;
 
    container.innerHTML = '';
    subtitle.textContent = 'RÉCOMPENSE BOSS — CHOISISSEZ VOTRE STYLE GRATUIT';
    const maxed = state.player.skinIndex >= SHIP_SKINS.length - 1;
 
    const card = document.createElement('div');
    card.className = 'upgrade-card style-card' + (maxed ? ' maxed' : '');
    card.innerHTML = `
       <div class="upgrade-icon" style="background: rgba(255, 234, 0, 0.15); border-color: #ffea00;">${STYLE_UPGRADE.icon}</div>
       <div class="upgrade-info">
           <div class="upgrade-title">
              <span>${STYLE_UPGRADE.name}</span>
              <span class="upgrade-level-badge">${maxed ? 'MAX' : `Châssis ${state.player.skinIndex + 2}/10`}</span>
           </div>
           <div class="upgrade-desc">${STYLE_UPGRADE.getDesc(state.player.skinIndex)}</div>
       </div>`;
    card.onclick = () => {
        if (!maxed) STYLE_UPGRADE.apply(state.player);
        const lvlScreen = document.getElementById('levelup-screen');
        if (lvlScreen) lvlScreen.classList.add('hidden');
        state.bossRewardStage = 0;
        
        if (state.player) {
            state.player.maxHealth = Math.max(3, state.player.maxHealth);
            if (state.player.health < 3) state.player.health = 3;
            updateHearts();
        }
        
        const banner = document.getElementById('wave-banner');
        if (banner) {
            banner.textContent = 'COMBAT TERMINÉ';
            banner.classList.add('active');
        }
        state.current = GameState.PLAYING;
        startWave(16);
    };
    container.appendChild(card);
    screen.classList.remove('hidden');
}

document.addEventListener('click', (event) => {
    if (event.target && event.target.id === 'victory-continue-btn') {
        continueFromVictory();
    }
});

/* ==============================================================
   GAME FLOW
   ============================================================== */
export function endGame() {
    state.current = GameState.GAMEOVER;
    sound.playExplosion(true);
    if (state.score > state.highScore) {
        state.highScore = state.score;
        localStorage.setItem('neon_invaders_high', state.highScore.toString());
    }
    const goScore = document.getElementById('go-score');
    const goBest = document.getElementById('go-best');
    const goWave = document.getElementById('go-wave');
    const goKills = document.getElementById('go-kills');
    if (goScore) goScore.textContent = state.score.toLocaleString();
    if (goBest) goBest.textContent = state.highScore.toLocaleString();
    if (goWave) goWave.textContent = state.wave;
    if (goKills) goKills.textContent = state.kills;
    
    const goScreen = document.getElementById('gameover-screen');
    if (goScreen) goScreen.classList.remove('hidden');
}

export function initGame() {
    resize();
    sound.init();
    state.player = new PlayerShip();
    state.bullets = [];
    state.enemyBullets = [];
    state.invaders = [];
    state.powerups = [];
    state.particles = [];
    state.shockwaves = [];
    state.targetX = state.width / 2;
    state.keys.left = false;
    state.keys.right = false;
    state.isTouching = false;
    state.totalPlaySeconds = 0;
    state.bossActive = false;
    state.boss = null;
    state.bossRewardStage = 0;
    state.victoryCutsceneTimer = 0;
    
    const tierEl = document.getElementById('hud-tier');
    if (tierEl && typeof SHIP_SKINS !== 'undefined' && SHIP_SKINS.length > 0) {
        tierEl.textContent = SHIP_SKINS[0].name;
    }
    state.score = 0;
    state.combo = 1.0;
    state.comboTimer = 0;
    state.kills = 0;
    
    updateHearts();
    startWave(1);
    
    document.getElementById('start-screen')?.classList.add('hidden');
    document.getElementById('levelup-screen')?.classList.add('hidden');
    document.getElementById('gameover-screen')?.classList.add('hidden');
    document.getElementById('pause-screen')?.classList.add('hidden');
    document.getElementById('settings-screen')?.classList.add('hidden');
    
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) pauseBtn.textContent = 'PAUSE';
    
    state.current = GameState.PLAYING;
}

export function startWave(waveNum) {
    state.wave = waveNum;
    state.waveSpawning = true;
    const banner = document.getElementById('wave-banner');
    if (banner) {
        banner.textContent = `VAGUE ${state.wave}`;
        banner.classList.add('active');
        setTimeout(() => banner.classList.remove('active'), 1800);
    }

    if (waveNum === 15) {
        startBossFight();
        return;
    }

    const cols = Math.min(7, Math.max(4, Math.floor(state.width / 80)));
    const rows = Math.min(5, 2 + Math.floor((state.wave - 1) / 3));
    const colSpacing = Math.min(85, (state.width - 70) / cols);
    const startX = (state.width - (cols - 1) * colSpacing) / 2;
    
    const availableTypes = ['scout'];
    if (state.wave >= 2) availableTypes.push('dart');
    if (state.wave >= 3) availableTypes.push('tank');
    if (state.wave >= 4) availableTypes.push('splitter');
    if (state.wave >= 5) availableTypes.push('disruptor');
    if (state.wave >= 6) availableTypes.push('phantom');
    if (state.wave >= 7) availableTypes.push('healer');
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
            if (r === 0 && state.wave >= 3 && Math.random() < 0.4) {
                type = (state.wave >= 5 && Math.random() < 0.5) ? 'disruptor' : 'tank';
            }
            const x = startX + c * colSpacing;
            const y = -60 - r * 55;
            state.invaders.push(new Invader(x, y, type, state.wave));
        }
    }
    state.waveSpawning = false;
    updateHud();
}

/* ==============================================================
   MAIN LOOP
   ============================================================== */
function update() {
    if ([GameState.PLAYING, GameState.BOSS_FIGHT, GameState.BOSS_CUTSCENE].includes(state.current)) {
        state.totalPlaySeconds += 1 / 60;
    }
    if (state.current === GameState.GAMEOVER || state.current === GameState.MENU) return;
    
    if (state.current === GameState.BOSS_FIGHT) {
        updateBossFight();
        return;
    }
    
    if (state.current === GameState.BOSS_CUTSCENE) {
        for (let i = state.shockwaves.length - 1; i >= 0; i--) {
            const sw = state.shockwaves[i];
            sw.update();
            if (sw.finished) state.shockwaves.splice(i, 1);
        }
        state.victoryCutsceneTimer++;
        if (state.boss && state.victoryCutsceneTimer >= 55) {
            state.boss = null;
            state.bossActive = false;
            updateHearts();
            updateHud();
        }
        if (state.victoryCutsceneTimer >= 180) {
            showVictoryScreen();
        }
        return;
    }
    if (state.current === GameState.BOSS_REWARDS) return;
    
    if (state.current === GameState.PLAYING) {
        // Combo Timer
        if (state.comboTimer > 0) state.comboTimer--;
        else if (state.combo > 1.0) {
            state.combo = +(state.combo - 0.05).toFixed(1);
            state.comboTimer = 30;
            updateHud();
        }
        
        state.player.update();
        if (hudNovaFill) hudNovaFill.style.width = `${state.player.novaCharge}%`;
        
        if (touchNovaBtn) {
            if (state.player.novaCharge >= 98) touchNovaBtn.classList.add('ready');
            else touchNovaBtn.classList.remove('ready');
        }
        
        if (!state.waveSpawning && state.invaders.length === 0) {
            if (state.wave % 5 === 0) {
                presentLevelUpChoices();
            } else {
                startWave(state.wave + 1);
            }
            return;
        }

        // Update Bullets
        for (let i = state.bullets.length - 1; i >= 0; i--) {
            const b = state.bullets[i];
            b.update();
            if (b.life <= 0 || b.y < -20 || b.x < 0 || b.x > state.width) {
                state.bullets.splice(i, 1);
                continue;
            }
            
            // Player bullet vs Enemy Bullet
            let bulletRemoved = false;
            for (let ebIdx = state.enemyBullets.length - 1; ebIdx >= 0; ebIdx--) {
                const eb = state.enemyBullets[ebIdx];
                const distEB = Math.hypot(b.x - eb.x, b.y - eb.y);
                if (distEB < b.radius + eb.radius + 4) {
                    sound.playBulletIntercept();
                    createParticles((b.x + eb.x) / 2, (b.y + eb.y) / 2, '#ffffff', 8);
                    createParticles(eb.x, eb.y, '#ff0055', 6);
                    state.enemyBullets.splice(ebIdx, 1);
                    if (b.pierce <= 0) {
                        state.bullets.splice(i, 1);
                        bulletRemoved = true;
                    } else {
                        b.pierce--;
                    }
                    break;
                }
            }
            if (bulletRemoved) continue;
            
            // Player Bullet vs Powerups
            for (let pIdx = state.powerups.length - 1; pIdx >= 0; pIdx--) {
                const p = state.powerups[pIdx];
                const distP = Math.hypot(b.x - p.x, b.y - p.y);
                if (distP < b.radius + p.radius) {
                    sound.playPowerup();
                    createParticles(p.x, p.y, p.color, 20);
                    if (p.type === 'triple') {
                        state.player.tripleShotTimer = 480;
                    } else if (p.type === 'rapid') {
                        state.player.rapidFireTimer = 420;
                    } else if (p.type === 'shield') {
                        state.player.shieldTimer = 550;
                    } else if (p.type === 'nuke') {
                        triggerNova();
                    }
                    state.powerups.splice(pIdx, 1);
                    state.bullets.splice(i, 1);
                    bulletRemoved = true;
                    break;
                }
            }
            if (bulletRemoved) continue;

            // Player bullet vs Invaders
            for (let j = state.invaders.length - 1; j >= 0; j--) {
                const inv = state.invaders[j];
                const dist = Math.hypot(b.x - inv.x, b.y - inv.y);
                if (dist < b.radius + inv.radius) {
                    if (inv.type === 'tank' && inv.shieldActive) {
                        state.bullets.splice(i, 1);
                        createParticles(b.x, b.y, '#00f0ff', 6);
                        sound.playBulletIntercept();
                        break;
                    }
                    inv.hp -= b.damage;
                    createParticles(b.x, b.y, inv.color, 5);
                    if (b.pierce <= 0) state.bullets.splice(i, 1);
                    else b.pierce--;
                    
                    if (inv.hp <= 0) {
                        sound.playExplosion(inv.type === 'tank');
                        createParticles(inv.x, inv.y, inv.color, 22);
                        addScore(inv.points);
                        
                        if (inv.type === 'splitter') {
                            const drone1 = new Invader(inv.x - 16, inv.y, 'mini_drone', state.wave);
                            const drone2 = new Invader(inv.x + 16, inv.y, 'mini_drone', state.wave);
                            drone1.wobble = 0;
                            drone2.wobble = Math.PI;
                            state.invaders.push(drone1, drone2);
                        }
                        if (Math.random() < 0.18) {
                            state.powerups.push(new PowerUp(inv.x, inv.y));
                        }
                        state.invaders.splice(j, 1);
                    }
                    break;
                }
            }
        }

        // Update Enemy Bullets
        for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
            const eb = state.enemyBullets[i];
            eb.update();
            if (eb.y > state.height + 20) {
                state.enemyBullets.splice(i, 1);
                continue;
            }
            const distPlayer = Math.hypot(eb.x - state.player.x, eb.y - state.player.y);
            if (distPlayer < eb.radius + state.player.radius) {
                if (eb.isEmp) {
                    state.player.empTimer = 180;
                    createParticles(state.player.x, state.player.y, '#ff00aa', 15);
                    updateHud();
                }
                state.enemyBullets.splice(i, 1);
                state.player.takeDamage();
            }
        }

        // Update Invaders
        for (let i = state.invaders.length - 1; i >= 0; i--) {
            const inv = state.invaders[i];
            inv.update();
            if (state.height > 100 && inv.y > state.height + inv.radius + 10 && inv.y > 0) {
                sound.playBreach();
                triggerBreachWarning();
                triggerShake(10);
                if (state.player) state.player.takeDamage();
                state.invaders.splice(i, 1);
                continue;
            }
            const distPlayer = Math.hypot(inv.x - state.player.x, inv.y - state.player.y);
            if (distPlayer < inv.radius + state.player.radius) {
                state.player.takeDamage();
                createParticles(inv.x, inv.y, inv.color, 20);
                state.invaders.splice(i, 1);
                continue;
            }
        }
        
        // Effects & Powerups update loop
        for (let i = state.powerups.length - 1; i >= 0; i--) {
            const p = state.powerups[i];
            p.update();
            if (p.life <= 0 || p.y > state.height + 30) state.powerups.splice(i, 1);
        }
        for (let i = state.particles.length - 1; i >= 0; i--) {
            const pt = state.particles[i];
            pt.update();
            if (pt.life <= 0) state.particles.splice(i, 1);
        }
        for (let i = state.shockwaves.length - 1; i >= 0; i--) {
            const sw = state.shockwaves[i];
            sw.update();
            if (sw.finished) state.shockwaves.splice(i, 1);
        }
    }
}

function draw() {
    state.ctx.save();
    state.ctx.scale(state.dpr, state.dpr);
    
    if (state.shake > 0) {
        const rx = (Math.random() - 0.5) * state.shake;
        const ry = (Math.random() - 0.5) * state.shake;
        state.ctx.translate(rx, ry);
        state.shake *= 0.88;
        if (state.shake < 0.2) state.shake = 0;
    }
    
    state.ctx.fillStyle = '#03030a';
    state.ctx.fillRect(0, 0, state.width, state.height);
    
    state.ctx.save();
    state.ctx.strokeStyle = 'rgba(0, 240, 255, 0.035)';
    state.ctx.lineWidth = 1;
    const step = 55;
    for (let x = 0; x < state.width; x += step) {
        state.ctx.beginPath();
        state.ctx.moveTo(x, 0);
        state.ctx.lineTo(x, state.height);
        state.ctx.stroke();
    }
    for (let y = 0; y < state.height; y += step) {
        state.ctx.beginPath();
        state.ctx.moveTo(0, y);
        state.ctx.lineTo(state.width, y);
        state.ctx.stroke();
    }
    state.ctx.restore();

    state.ctx.save();
    state.ctx.strokeStyle = 'rgba(255, 0, 85, 0.25)';
    state.ctx.setLineDash([8, 8]);
    state.ctx.lineWidth = 2;
    state.ctx.beginPath();
    state.ctx.moveTo(0, state.height - 16);
    state.ctx.lineTo(state.width, state.height - 16);
    state.ctx.stroke();
    state.ctx.restore();

    for (let sw of state.shockwaves) sw.draw();
    for (let pt of state.particles) pt.draw();
    for (let p of state.powerups) p.draw();
    for (let b of state.bullets) b.draw();
    for (let eb of state.enemyBullets) eb.draw();
    for (let inv of state.invaders) inv.draw();
    if (state.bossActive) drawBoss();
    
    if (state.player && (state.current === GameState.PLAYING || state.current === GameState.UPGRADING || state.current === GameState.PAUSED || state.current === GameState.BOSS_FIGHT || state.current === GameState.BOSS_CUTSCENE)) {
        state.player.draw();
    }
    state.ctx.restore();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function bindGameEvents() {
    document.getElementById('start-btn')?.addEventListener('click', initGame);
    document.getElementById('restart-btn')?.addEventListener('click', initGame);
    document.getElementById('pause-btn')?.addEventListener('click', togglePause);
    document.getElementById('resume-btn')?.addEventListener('click', togglePause);
    document.getElementById('quit-menu-btn')?.addEventListener('click', returnToMainMenu);

    // Settings Modal
    const settingsScreen = document.getElementById('settings-screen');
    const openSettingsBtn = document.getElementById('open-settings-btn');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const volumeSlider = document.getElementById('setting-volume');
    const volumeVal = document.getElementById('volume-val');
    const posLeftRadio = document.getElementById('nova-pos-left');
    const posRightRadio = document.getElementById('nova-pos-right');

    openSettingsBtn?.addEventListener('click', () => {
        sound.init();
        settingsScreen?.classList.remove('hidden');
    });

    closeSettingsBtn?.addEventListener('click', () => {
        settingsScreen?.classList.add('hidden');
    });

    volumeSlider?.addEventListener('input', (e) => {
        sound.init();
        const val = parseFloat(e.target.value);
        sound.setVolume(val);
        if (volumeVal) volumeVal.textContent = `${Math.round(val * 100)}%`;
    });

    const updateNovaPos = (pos) => {
        if (!touchNovaBtn) return;
        if (pos === 'left') {
            touchNovaBtn.classList.add('pos-left');
        } else {
            touchNovaBtn.classList.remove('pos-left');
        }
    };

    posLeftRadio?.addEventListener('change', () => {
        if (posLeftRadio.checked) updateNovaPos('left');
    });
    posRightRadio?.addEventListener('change', () => {
        if (posRightRadio.checked) updateNovaPos('right');
    });
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', bindGameEvents);
} else {
    bindGameEvents();
}

window.onload = function() {
    resize();
    gameLoop();
};
