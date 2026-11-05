/* ==============================================================
  1. SYNTHÉTISEUR AUDIO NÉON (Web Audio API)
  ============================================================== */
class RetroAudio {
   constructor() {
       this.ctx = null;
   }
   init() {
       if (!this.ctx) {
           const AudioCtx = window.AudioContext || window.webkitAudioContext;
           if (!AudioCtx) return;
           try {
               this.ctx = new AudioCtx();
           } catch (error) {
               console.warn('Audio is unavailable; continuing without sound.', error);
               return;
           }
       }
       if (this.ctx.state === 'suspended') {
           this.ctx.resume().catch(() => {});
       }
   }
   playShoot() {
       if (!this.ctx) return;
       const now = this.ctx.currentTime;
       const osc = this.ctx.createOscillator();
       const gain = this.ctx.createGain();
       osc.type = 'sawtooth';
       osc.frequency.setValueAtTime(850, now);
       osc.frequency.exponentialRampToValueAtTime(120, now + 0.07);
       gain.gain.setValueAtTime(0.06, now);
       gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
       osc.connect(gain);
       gain.connect(this.ctx.destination);
       osc.start(now);
       osc.stop(now + 0.07);
   }
   playBulletIntercept() {
       if (!this.ctx) return;
       const now = this.ctx.currentTime;
       const osc = this.ctx.createOscillator();
       const gain = this.ctx.createGain();
       osc.type = 'square';
       osc.frequency.setValueAtTime(1400, now);
       osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);
       gain.gain.setValueAtTime(0.09, now);
       gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
       osc.connect(gain);
       gain.connect(this.ctx.destination);
       osc.start(now);
       osc.stop(now + 0.06);
   }
   playExplosion(boss = false) {
       if (!this.ctx) return;
       const now = this.ctx.currentTime;
       const duration = boss ? 0.45 : 0.2;
       const bufferSize = Math.floor(this.ctx.sampleRate * duration);
       const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
       const output = buffer.getChannelData(0);
       for (let i = 0; i < bufferSize; i++) {
           output[i] = (Math.random() * 2) - 1;
       }
       const noise = this.ctx.createBufferSource();
       noise.buffer = buffer;
       const filter = this.ctx.createBiquadFilter();
       filter.type = 'lowpass';
       filter.frequency.setValueAtTime(boss ? 480 : 850, now);
       filter.frequency.exponentialRampToValueAtTime(30, now + duration);
       const gain = this.ctx.createGain();
       gain.gain.setValueAtTime(boss ? 0.35 : 0.16, now);
       gain.gain.exponentialRampToValueAtTime(0.005, now + duration);
       noise.connect(filter);
       filter.connect(gain);
       gain.connect(this.ctx.destination);
       noise.start(now);
   }
   playHit() {
       if (!this.ctx) return;
       const now = this.ctx.currentTime;
       const osc = this.ctx.createOscillator();
       const gain = this.ctx.createGain();
       osc.type = 'triangle';
       osc.frequency.setValueAtTime(200, now);
       osc.frequency.linearRampToValueAtTime(45, now + 0.16);
       gain.gain.setValueAtTime(0.28, now);
       gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
       osc.connect(gain);
       gain.connect(this.ctx.destination);
       osc.start(now);
       osc.stop(now + 0.16);
   }
   playBreach() {
       if (!this.ctx) return;
       const now = this.ctx.currentTime;
       const osc = this.ctx.createOscillator();
       const gain = this.ctx.createGain();
       osc.type = 'sawtooth';
       osc.frequency.setValueAtTime(140, now);
       osc.frequency.exponentialRampToValueAtTime(35, now + 0.3);
       gain.gain.setValueAtTime(0.3, now);
       gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
       osc.connect(gain);
       gain.connect(this.ctx.destination);
       osc.start(now);
       osc.stop(now + 0.3);
   }
   playPowerup() {
       if (!this.ctx) return;
       const now = this.ctx.currentTime;
       const osc = this.ctx.createOscillator();
       const gain = this.ctx.createGain();
       osc.type = 'sine';
       osc.frequency.setValueAtTime(400, now);
       osc.frequency.exponentialRampToValueAtTime(1300, now + 0.24);
       gain.gain.setValueAtTime(0.2, now);
       gain.gain.exponentialRampToValueAtTime(0.01, now + 0.24);
       osc.connect(gain);
       gain.connect(this.ctx.destination);
       osc.start(now);
       osc.stop(now + 0.24);
   }
   playNova() {
       if (!this.ctx) return;
       const now = this.ctx.currentTime;
       const osc = this.ctx.createOscillator();
       const gain = this.ctx.createGain();
       osc.type = 'sawtooth';
       osc.frequency.setValueAtTime(90, now);
       osc.frequency.exponentialRampToValueAtTime(650, now + 0.22);
       osc.frequency.exponentialRampToValueAtTime(25, now + 0.6);
       gain.gain.setValueAtTime(0.35, now);
       gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
       osc.connect(gain);
       gain.connect(this.ctx.destination);
       osc.start(now);
       osc.stop(now + 0.6);
   }
   playLevelUp() {
       if (!this.ctx) return;
       const now = this.ctx.currentTime;
       const osc = this.ctx.createOscillator();
       const gain = this.ctx.createGain();
       osc.type = 'triangle';
       osc.frequency.setValueAtTime(330, now);
       osc.frequency.setValueAtTime(440, now + 0.1);
       osc.frequency.setValueAtTime(660, now + 0.2);
       osc.frequency.setValueAtTime(880, now + 0.3);
       gain.gain.setValueAtTime(0.25, now);
       gain.gain.exponentialRampToValueAtTime(0.005, now + 0.5);
       osc.connect(gain);
       gain.connect(this.ctx.destination);
       osc.start(now);
       osc.stop(now + 0.5);
   }
   playAbility() {
       if (!this.ctx) return;
       const now = this.ctx.currentTime;
       const osc = this.ctx.createOscillator();
       const gain = this.ctx.createGain();
       osc.type = 'sine';
       osc.frequency.setValueAtTime(220, now);
       osc.frequency.linearRampToValueAtTime(700, now + 0.12);
       gain.gain.setValueAtTime(0.12, now);
       gain.gain.exponentialRampToValueAtTime(0.005, now + 0.12);
       osc.connect(gain);
       gain.connect(this.ctx.destination);
       osc.start(now);
       osc.stop(now + 0.12);
   }
}
const sound = new RetroAudio();

/* ==============================================================
  2. INITIALISATION ET CONTRÔLES HORIZONTAUX
  ============================================================== */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const breachFlash = document.getElementById('breach-flash');
let width = window.innerWidth || 800;
let height = window.innerHeight || 600;
let dpr = 1;

function resize() {
   dpr = window.devicePixelRatio || 1;
   width = window.innerWidth;
   height = window.innerHeight;
   canvas.width = Math.floor(width * dpr);
   canvas.height = Math.floor(height * dpr);
   canvas.style.width = width + 'px';
   canvas.style.height = height + 'px';
}
window.addEventListener('resize', resize);
resize();

const GameState = {
   MENU: 0,
   PLAYING: 1,
   UPGRADING: 2,
   GAMEOVER: 3,
   PAUSED: 4,
   BOSS_FIGHT: 5,
   BOSS_CUTSCENE: 6,
   BOSS_REWARDS: 7
};
let state = GameState.MENU;
let pausedFromState = null;

const keys = { left: false, right: false };
let isTouching = false;
let targetX = width / 2;

function togglePause() {
   if ([GameState.PLAYING, GameState.BOSS_FIGHT, GameState.BOSS_CUTSCENE].includes(state)) {
       pausedFromState = state;
       state = GameState.PAUSED;

       const pauseScreen = document.getElementById('pause-screen');
       if (pauseScreen) pauseScreen.classList.remove('hidden');

       const pauseBtn = document.getElementById('pause-btn');
       if (pauseBtn) pauseBtn.textContent = 'REPRENDRE';
   } else if (state === GameState.PAUSED) {
       state = pausedFromState || GameState.PLAYING;
       pausedFromState = null;

       const pauseScreen = document.getElementById('pause-screen');
       if (pauseScreen) pauseScreen.classList.add('hidden');

       const pauseBtn = document.getElementById('pause-btn');
       if (pauseBtn) pauseBtn.textContent = 'PAUSE';
   }
}

window.addEventListener('keydown', (e) => {
   sound.init();
   if (e.code === 'KeyP' || e.code === 'Escape') {
       togglePause();
       return;
   }
   if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'KeyQ') keys.left = true;
   if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
   if (e.code === 'Space' || e.key.toLowerCase() === 'e') {
       if (state === GameState.PLAYING || state === GameState.BOSS_FIGHT) triggerNova();
   }
});
window.addEventListener('keyup', (e) => {
   if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'KeyQ') keys.left = false;
   if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
});
window.addEventListener('touchstart', (e) => {
   sound.init();
   if (e.touches.length > 0) {
       isTouching = true;
       targetX = e.touches[0].clientX;
   }
}, { passive: true });
window.addEventListener('touchmove', (e) => {
   if (e.touches.length > 0) {
       targetX = e.touches[0].clientX;
   }
}, { passive: true });
window.addEventListener('touchend', () => {
   isTouching = false;
});
window.addEventListener('mousemove', (e) => {
   if (!keys.left && !keys.right) {
       targetX = e.clientX;
   }
});
window.addEventListener('contextmenu', (e) => {
   e.preventDefault();
   if (state === GameState.PLAYING || state === GameState.BOSS_FIGHT) triggerNova();
});
const touchNovaBtn = document.getElementById('touch-nova-btn');
if (touchNovaBtn) {
   touchNovaBtn.addEventListener('touchstart', (e) => {
       e.preventDefault();
       sound.init();
       if ((state === GameState.PLAYING || state === GameState.BOSS_FIGHT) && !bossActive) {
           triggerNova();
       }
   }, { passive: false });
   touchNovaBtn.addEventListener('click', () => {
       sound.init();
       if ((state === GameState.PLAYING || state === GameState.BOSS_FIGHT) && !bossActive) {
           triggerNova();
       }
   });
}

/* ==============================================================
  3. STYLE / UPGRADES
  ============================================================== */
const SHIP_SKINS = [
   { name: 'MK-I SCOUT', color: '#00f0ff', accent: '#0088ff' },
   { name: 'MK-II VIPÈRE', color: '#00ffcc', accent: '#00aa77' },
   { name: 'MK-III INTERCEPTEUR', color: '#ff00bb', accent: '#990077' },
   { name: 'MK-IV SPECTRE', color: '#b042ff', accent: '#5c10b0' },
   { name: 'MK-V CUIRASSÉ PHŒNIX', color: '#ffea00', accent: '#ff6600' },
   { name: 'MK-VI STEALTH VALKYRIE', color: '#33ff55', accent: '#009933' },
   { name: 'MK-VII CYBER TITAN', color: '#ff5500', accent: '#ff0033' },
   { name: 'MK-VIII ÉCLIPSE CHRONO', color: '#ffffff', accent: '#00f0ff' },
   { name: 'MK-IX HYPER NOVA', color: '#ff0055', accent: '#ffea00' },
   { name: 'MK-X MONARQUE DIVIN', color: '#ffd700', accent: '#ffffff' }
];

const STYLE_UPGRADE = {
   id: 'ship_skin',
   name: 'Style & Évolution Châssis',
   icon: '✨',
   baseDesc: 'Fait évoluer le châssis, la signature néon et les réacteurs',
   getDesc: (currentLvl) => {
       if (currentLvl >= SHIP_SKINS.length - 1) {
           return `Niveau Max atteint : ${SHIP_SKINS[SHIP_SKINS.length - 1].name} (Suprématie totale)`;
       }
       const next = SHIP_SKINS[currentLvl + 1];
       return `Évolution vers [${next.name}] : Châssis blindé néon + Ailes vectorielles`;
   },
   apply: (player) => {
       if (player && player.skinIndex < SHIP_SKINS.length - 1) {
           player.skinIndex++;
           const tierEl = document.getElementById('hud-tier');
           if (tierEl) tierEl.textContent = SHIP_SKINS[player.skinIndex].name;
           sound.playLevelUp();
           createParticles(player.x, player.y, SHIP_SKINS[player.skinIndex].color, 45);
       }
   }
};

const RANDOM_UPGRADE_POOL = [
   {
       id: 'fire_rate',
       name: 'Cadence Accélérée',
       icon: '⚡',
       baseDesc: 'Réduit le délai entre chaque tir',
       getDesc: (lvl) => `Augmente la cadence de tir de ${(lvl * 8)}%`,
       apply: (player, lvl) => { player.baseFireInterval = Math.max(5, 11 - Math.floor(lvl * 0.7)); }
   },
   {
       id: 'bullet_pierce',
       name: 'Perforation Plasma',
       icon: '🗡️',
       baseDesc: 'Les tirs traversent un ennemi supplémentaire',
       getDesc: (lvl) => `Chaque laser traverse jusqu'à ${lvl + 1} cibles`,
       apply: (player, lvl) => { player.pierceLevel = lvl; }
   },
   {
       id: 'bullet_damage',
       name: 'Lasers Lourds',
       icon: '💥',
       baseDesc: 'Augmente la puissance des tirs',
       getDesc: (lvl) => `Dégâts accrus : ${1 + +(lvl * 0.45).toFixed(2)} dégâts par tir`,
       apply: (player, lvl) => { player.damageLevel = 1 + lvl * 0.45; }
   },
   {
       id: 'thruster_speed',
       name: 'Propulsion Cyber',
       icon: '🚀',
       baseDesc: 'Augmente la vitesse de déplacement',
       getDesc: (lvl) => `Mobilité accrue de +${lvl * 15}%`,
       apply: (player, lvl) => { player.speed = 10 + lvl * 1.5; }
   },
   {
       id: 'hull_repair',
       name: 'Régénération Coque',
       icon: '💖',
       baseDesc: 'Répare 1 PV et augmente la santé max si plein',
       getDesc: (lvl) => `Restaure 1 cœur et renforce le bouclier max (+${lvl})`,
       apply: (player, lvl) => {
           if (player.health < player.maxHealth) {
               player.health++;
           } else {
               player.maxHealth++;
               player.health = player.maxHealth;
           }
           updateHearts();
       }
   },
   {
       id: 'perm_spread',
       name: 'Canon Triple Passif',
       icon: '🔱',
       baseDesc: 'Chance d’activer des canons latéraux à chaque tir',
       getDesc: (lvl) => `${Math.min(75, lvl * 14)}% de chance de tir triple à chaque salve`,
       apply: (player, lvl) => { player.tripleChance = Math.min(0.75, lvl * 0.14); }
   },
   {
       id: 'nova_flow',
       name: 'Recharge Nova',
       icon: '🔮',
       baseDesc: 'La Nova se recharge plus vite passivement',
       getDesc: (lvl) => `Recharge Nova passive accrue de +${lvl * 18}%`,
       apply: (player, lvl) => { player.novaChargeRate = 0.05 * (1 + lvl * 0.18); }
   },
   {
       id: 'emp_aura',
       name: 'Ralentisseur Graviton',
       icon: '🌀',
       baseDesc: 'Ralentit la chute des envahisseurs',
       getDesc: (lvl) => `Vitesse de descente ennemie réduite de ${Math.min(45, lvl * 9)}%`,
       apply: (player, lvl) => { player.slowAura = Math.min(0.45, lvl * 0.09); }
   },
   {
       id: 'energy_shield',
       name: 'Dôme Protecteur',
       icon: '🛡️',
       baseDesc: 'Restaure une barrière d’énergie périodiquement',
       getDesc: (lvl) => `Barrière protectrice restaurée toutes les ${Math.max(10, 24 - lvl * 3)}s`,
       apply: (player, lvl) => { player.passiveShieldInterval = Math.max(600, (24 - lvl * 3) * 60); }
   },
   {
       id: 'hyper_combo',
       name: 'Aimant Cyber-Combo',
       icon: '💎',
       baseDesc: 'Maintient le multiplicateur combo actif plus longtemps',
       getDesc: (lvl) => `Durée du multiplicateur combo augmentée de +${lvl * 40}%`,
       apply: (player, lvl) => { player.comboBonusTime = lvl * 60; }
   }
];

/* ==============================================================
  4. PLAYERSHIP
  ============================================================== */
class PlayerShip {
   constructor() {
       this.x = width / 2;
       this.y = height - 52;
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
       this.y = height - 52;
       const currentSpeed = this.empTimer > 0 ? this.speed * 0.45 : this.speed;
       if (keys.left || keys.right) {
           if (keys.left) this.x -= currentSpeed;
           if (keys.right) this.x += currentSpeed;
           targetX = this.x;
       } else {
           const smoothFactor = this.empTimer > 0 ? 0.12 : 0.28;
           this.x += (targetX - this.x) * smoothFactor;
       }
       this.x = Math.max(this.radius + 8, Math.min(width - this.radius - 8, this.x));
       targetX = Math.max(this.radius + 8, Math.min(width - this.radius - 8, targetX));
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
       if (this.novaCharge < 100 && state !== GameState.BOSS_FIGHT) {
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
           bullets.push(new Bullet(this.x, topY, -Math.PI / 2, bulletColor, false, false, this.damageLevel, this.pierceLevel));
           bullets.push(new Bullet(this.x - 14, topY, -Math.PI / 2 - 0.12, bulletColor, false, false, this.damageLevel, this.pierceLevel));
           bullets.push(new Bullet(this.x + 14, topY, -Math.PI / 2 + 0.12, bulletColor, false, false, this.damageLevel, this.pierceLevel));
       } else {
           bullets.push(new Bullet(this.x, topY, -Math.PI / 2, bulletColor, false, false, this.damageLevel, this.pierceLevel));
       }
   }
   takeDamage() {
       if (this.invulnerableTimer > 0) return false;
       if (this.shieldTimer > 0) {
           this.shieldTimer = 0;
           this.invulnerableTimer = 35;
           sound.playHit();
           createParticles(this.x, this.y, '#00f0ff', 16);
           return false;
       }
       this.health--;
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
       ctx.save();
       ctx.translate(this.x, this.y);
       if (this.invulnerableTimer > 0 && Math.floor(this.invulnerableTimer / 4) % 2 === 0) {
           ctx.globalAlpha = 0.4;
       }
       if (this.shieldTimer > 0) {
           ctx.strokeStyle = '#00f0ff';
           ctx.shadowColor = '#00f0ff';
           ctx.shadowBlur = 18;
           ctx.lineWidth = 3;
           ctx.beginPath();
           ctx.arc(0, 0, this.radius + 15, 0, Math.PI * 2);
           ctx.stroke();
       }
       const currentSkin = SHIP_SKINS[this.skinIndex];
       const flameColor = this.rapidFireTimer > 0 ? '#ffea00' : currentSkin.color;
       const thrusterCount = this.skinIndex >= 6 ? 3 : (this.skinIndex >= 3 ? 2 : 1);
       ctx.fillStyle = flameColor;
       ctx.shadowColor = flameColor;
       ctx.shadowBlur = 12;
       const fH = 8 + Math.random() * 8;
       if (thrusterCount === 1) {
           ctx.beginPath();
           ctx.moveTo(-6, 14); ctx.lineTo(0, 14 + fH); ctx.lineTo(6, 14);
           ctx.fill();
       } else if (thrusterCount === 2) {
           ctx.beginPath();
           ctx.moveTo(-14, 14); ctx.lineTo(-10, 14 + fH); ctx.lineTo(-6, 14);
           ctx.moveTo(6, 14); ctx.lineTo(10, 14 + fH); ctx.lineTo(14, 14);
           ctx.fill();
       } else {
           ctx.beginPath();
           ctx.moveTo(-16, 14); ctx.lineTo(-12, 14 + fH * 0.8); ctx.lineTo(-8, 14);
           ctx.moveTo(-5, 14); ctx.lineTo(0, 14 + fH * 1.3); ctx.lineTo(5, 14);
           ctx.moveTo(8, 14); ctx.lineTo(12, 14 + fH * 0.8); ctx.lineTo(16, 14);
           ctx.fill();
       }
       ctx.fillStyle = '#080d24';
       ctx.strokeStyle = currentSkin.color;
       ctx.shadowColor = currentSkin.color;
       ctx.shadowBlur = 16 + this.skinIndex * 1.5;
       ctx.lineWidth = 2.5;
       ctx.beginPath();
       switch (this.skinIndex) {
           case 0:
               ctx.moveTo(0, -22);
               ctx.lineTo(18, 14);
               ctx.lineTo(6, 9);
               ctx.lineTo(-6, 9);
               ctx.lineTo(-18, 14);
               break;
           case 1:
               ctx.moveTo(0, -26);
               ctx.lineTo(12, -4);
               ctx.lineTo(24, 14);
               ctx.lineTo(0, 11);
               ctx.lineTo(-24, 14);
               ctx.lineTo(-12, -4);
               break;
           case 2:
               ctx.moveTo(-8, -25);
               ctx.lineTo(-3, -12);
               ctx.lineTo(0, -18);
               ctx.lineTo(3, -12);
               ctx.lineTo(8, -25);
               ctx.lineTo(24, 12);
               ctx.lineTo(0, 8);
               ctx.lineTo(-24, 12);
               break;
           case 3:
               ctx.moveTo(0, -27);
               ctx.lineTo(26, 2);
               ctx.lineTo(16, 15);
               ctx.lineTo(0, 9);
               ctx.lineTo(-16, 15);
               ctx.lineTo(-26, 2);
               break;
           case 4:
               ctx.moveTo(-10, -25);
               ctx.lineTo(10, -25);
               ctx.lineTo(26, -4);
               ctx.lineTo(28, 15);
               ctx.lineTo(12, 10);
               ctx.lineTo(0, 15);
               ctx.lineTo(-12, 10);
               ctx.lineTo(-28, 15);
               ctx.lineTo(-26, -4);
               break;
           case 5:
               ctx.moveTo(0, -28);
               ctx.lineTo(28, 6);
               ctx.lineTo(22, 15);
               ctx.lineTo(6, 6);
               ctx.lineTo(-6, 6);
               ctx.lineTo(-22, 15);
               ctx.lineTo(-28, 6);
               break;
           case 6:
               ctx.moveTo(0, -30);
               ctx.lineTo(12, -10);
               ctx.lineTo(32, 4);
               ctx.lineTo(22, 16);
               ctx.lineTo(6, 11);
               ctx.lineTo(-6, 11);
               ctx.lineTo(-22, 16);
               ctx.lineTo(-32, 4);
               ctx.lineTo(-12, -10);
               break;
           case 7:
               ctx.moveTo(0, -32);
               ctx.lineTo(16, -14);
               ctx.lineTo(28, 8);
               ctx.lineTo(14, 16);
               ctx.lineTo(0, 9);
               ctx.lineTo(-14, 16);
               ctx.lineTo(-28, 8);
               ctx.lineTo(-16, -14);
               break;
           case 8:
               ctx.moveTo(0, -34);
               ctx.lineTo(10, -14);
               ctx.lineTo(34, -4);
               ctx.lineTo(20, 16);
               ctx.lineTo(0, 10);
               ctx.lineTo(-20, 16);
               ctx.lineTo(-34, -4);
               ctx.lineTo(-10, -14);
               break;
           case 9:
               ctx.moveTo(0, -36);
               ctx.lineTo(8, -20);
               ctx.lineTo(24, -16);
               ctx.lineTo(36, 12);
               ctx.lineTo(16, 12);
               ctx.lineTo(0, 18);
               ctx.lineTo(-16, 12);
               ctx.lineTo(-36, 12);
               ctx.lineTo(-24, -16);
               ctx.lineTo(-8, -20);
               break;
       }
       ctx.closePath();
       ctx.fill();
       ctx.stroke();
       ctx.strokeStyle = currentSkin.accent;
       ctx.lineWidth = 1.6;
       ctx.beginPath();
       if (this.skinIndex >= 2) {
           ctx.moveTo(-10, 8); ctx.lineTo(0, -12); ctx.lineTo(10, 8);
       }
       if (this.skinIndex >= 5) {
           ctx.moveTo(-20, 10); ctx.lineTo(-8, -4);
           ctx.moveTo(20, 10); ctx.lineTo(8, -4);
       }
       if (this.skinIndex >= 8) {
           ctx.moveTo(-16, -10); ctx.lineTo(0, -26); ctx.lineTo(16, -10);
       }
       ctx.stroke();
       ctx.beginPath();
       ctx.arc(0, -3, 4 + Math.min(this.skinIndex * 0.4, 3), 0, Math.PI * 2);
       ctx.fillStyle = currentSkin.color;
       ctx.shadowBlur = 12;
       ctx.fill();
       ctx.restore();
   }
}

class Bullet {
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
       ctx.save();
       ctx.fillStyle = this.color;
       ctx.beginPath();
       ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
       ctx.fill();
       if (this.isEmp) {
           ctx.strokeStyle = '#ffffff';
           ctx.lineWidth = 1.5;
           ctx.stroke();
       }
       ctx.restore();
   }
}

class Invader {
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
       const slowFactor = player ? (1 - player.slowAura) : 1;
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
               if (this.dashTimer <= 0 && this.y > 40 && this.y < height - 200) {
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
           if (this.teleportCooldown <= 0 && this.y > 50 && this.y < height - 120) {
               createParticles(this.x, this.y, '#b042ff', 12);
               const shift = (Math.random() - 0.5) * 160;
               this.baseX = Math.max(this.radius + 15, Math.min(width - this.radius - 15, this.baseX + shift));
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
               for (let other of invaders) {
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
       const maxX = width - this.radius - 6;
       if (this.x < minX) {
           this.x = minX;
           this.baseX = minX + amp;
       } else if (this.x > maxX) {
           this.x = maxX;
           this.baseX = maxX - amp;
       }

       if (this.type !== 'mini_drone') {
           this.shootCooldown--;
           if (this.shootCooldown <= 0 && this.y > 60 && this.y < height - 100) {
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
                   ? Math.atan2((height - 52) - this.y, player.x - this.x)
                   : Math.PI / 2;

               if (this.type === 'disruptor') {
                   enemyBullets.push(new Bullet(this.x, this.y, angle, '#ff00aa', true, true));
               } else {
                   enemyBullets.push(new Bullet(this.x, this.y, angle, '#ff0055', true, false));
               }
               const baseCooldown = Math.max(90, 220 - this.wave * 4);
               this.shootCooldown = Math.floor(Math.random() * baseCooldown) + baseCooldown;
           }
       }
   }
   draw() {
       ctx.save();
       ctx.translate(this.x, this.y);
       ctx.strokeStyle = this.color;
       ctx.fillStyle = 'rgba(15, 8, 28, 0.85)';
       ctx.lineWidth = 2.2;
       if (this.type === 'tank' && this.shieldActive) {
           ctx.save();
           ctx.strokeStyle = '#00f0ff';
           ctx.lineWidth = 3;
           ctx.beginPath();
           ctx.arc(0, 0, this.radius + 9, 0, Math.PI * 2);
           ctx.stroke();
           ctx.restore();
       }
       if (this.type === 'healer') {
           ctx.save();
           ctx.strokeStyle = 'rgba(255, 255, 100, 0.35)';
           ctx.setLineDash([4, 4]);
           ctx.beginPath();
           ctx.arc(0, 0, 36, 0, Math.PI * 2);
           ctx.stroke();
           ctx.restore();
       }
       ctx.beginPath();
       if (this.type === 'dart') {
           ctx.moveTo(0, this.radius * 1.3);
           ctx.lineTo(-this.radius * 0.7, -this.radius);
           ctx.lineTo(0, -this.radius * 0.3);
           ctx.lineTo(this.radius * 0.7, -this.radius);
       } else if (this.type === 'tank') {
           const r = this.radius;
           ctx.rect(-r, -r * 0.8, r * 2, r * 1.6);
       } else if (this.type === 'splitter') {
           ctx.moveTo(0, this.radius);
           ctx.lineTo(this.radius, 0);
           ctx.lineTo(0, -this.radius);
           ctx.lineTo(-this.radius, 0);
       } else if (this.type === 'mini_drone') {
           ctx.moveTo(0, this.radius);
           ctx.lineTo(-this.radius, -this.radius * 0.8);
           ctx.lineTo(this.radius, -this.radius * 0.8);
       } else if (this.type === 'disruptor') {
           const r = this.radius;
           ctx.moveTo(-r * 0.5, -r);
           ctx.lineTo(r * 0.5, -r);
           ctx.lineTo(r, -r * 0.3);
           ctx.lineTo(r * 0.5, r);
           ctx.lineTo(-r * 0.5, r);
           ctx.lineTo(-r, -r * 0.3);
       } else if (this.type === 'phantom') {
           const r = this.radius;
           ctx.arc(0, -r * 0.2, r * 0.8, Math.PI, 0, false);
           ctx.lineTo(r * 0.8, r);
           ctx.lineTo(0, r * 0.5);
           ctx.lineTo(-r * 0.8, r);
       } else if (this.type === 'healer') {
           const r = this.radius * 0.7;
           ctx.rect(-r * 0.35, -r, r * 0.7, r * 2);
           ctx.rect(-r, -r * 0.35, r * 0.7, r * 0.7);
       } else {
           ctx.moveTo(0, this.radius);
           ctx.lineTo(-this.radius, -this.radius);
           ctx.lineTo(0, -this.radius * 0.4);
           ctx.lineTo(this.radius, -this.radius);
       }
       ctx.closePath();
       ctx.fill();
       ctx.stroke();
       if (this.maxHp > 1) {
           const barW = this.radius * 2 + 4;
           const barH = 4;
           const barY = -this.radius - 9;
           ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
           ctx.fillRect(-barW / 2, barY, barW, barH);
           const hpRatio = Math.max(0, this.hp / this.maxHp);
           ctx.fillStyle = hpRatio > 0.5 ? '#00ffaa' : (hpRatio > 0.25 ? '#ffea00' : '#ff0055');
           ctx.fillRect(-barW / 2, barY, barW * hpRatio, barH);
       }
       ctx.restore();
   }
}

class PowerUp {
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
       ctx.save();
       ctx.translate(this.x, this.y);
       const s = 1 + Math.sin(this.pulse) * 0.15;
       ctx.scale(s, s);
       ctx.strokeStyle = this.color;
       ctx.fillStyle = 'rgba(8, 16, 32, 0.85)';
       ctx.shadowColor = this.color;
       ctx.shadowBlur = 14;
       ctx.lineWidth = 2.5;
       ctx.beginPath();
       ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
       ctx.fill();
       ctx.stroke();
       ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
       ctx.lineWidth = 1;
       ctx.beginPath();
       ctx.arc(0, 0, this.radius + 4, 0, Math.PI * 2);
       ctx.stroke();
       ctx.fillStyle = '#ffffff';
       ctx.font = 'bold 12px sans-serif';
       ctx.textAlign = 'center';
       ctx.textBaseline = 'middle';
       ctx.fillText(this.label, 0, 1);
       ctx.restore();
   }
}

class Particle {
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
       ctx.save();
       ctx.globalAlpha = alpha;
       ctx.fillStyle = this.color;
       ctx.beginPath();
       ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
       ctx.fill();
       ctx.restore();
   }
}

class Shockwave {
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
       ctx.save();
       ctx.strokeStyle = '#ff00bb';
       ctx.shadowColor = '#00f0ff';
       ctx.shadowBlur = 22;
       ctx.lineWidth = 6 * alpha;
       ctx.globalAlpha = alpha;
       ctx.beginPath();
       ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
       ctx.stroke();
       ctx.restore();
   }
}

let player;
let bullets = [];
let enemyBullets = [];
let invaders = [];
let powerups = [];
let particles = [];
let shockwaves = [];
let score = 0;
let combo = 1.0;
let comboTimer = 0;
let wave = 1;
let kills = 0;
let shake = 0;
let waveSpawning = false;
let highScore = parseInt(localStorage.getItem('neon_invaders_high') || '0', 10);

let totalPlaySeconds = 0;
let bossActive = false;
let boss = null;
let bossRewardStage = 0;
let victoryCutsceneTimer = 0;

function triggerShake(amt) {
   shake = Math.max(shake, amt);
}
function triggerBreachWarning() {
   if (breachFlash) {
       breachFlash.style.opacity = '1';
       setTimeout(() => {
           breachFlash.style.opacity = '0';
       }, 250);
   }
}
function createParticles(x, y, color, count = 20) {
   if (particles.length > 120) count = Math.min(count, 5);
   for (let i = 0; i < count; i++) {
       const angle = Math.random() * Math.PI * 2;
       const spd = Math.random() * 4.5 + 1.2;
       particles.push(new Particle(
           x, y,
           Math.cos(angle) * spd,
           Math.sin(angle) * spd,
           Math.random() * 2.5 + 1.2,
           color,
           Math.floor(Math.random() * 16 + 12)
       ));
   }
}
function triggerNova() {
   if (state === GameState.BOSS_FIGHT && boss) {
       return;
   }
   if (player && player.novaCharge >= 98) {
       player.novaCharge = 0;
       sound.playNova();
       triggerShake(20);
       shockwaves.push(new Shockwave(player.x, player.y, Math.max(width, height)));
       for (let eb of enemyBullets) {
           createParticles(eb.x, eb.y, '#ff0055', 6);
       }
       enemyBullets = [];
       for (let i = invaders.length - 1; i >= 0; i--) {
           const inv = invaders[i];
           inv.hp -= (5 + player.damageLevel);
           if (inv.hp <= 0) {
               sound.playExplosion(inv.type === 'tank');
               createParticles(inv.x, inv.y, inv.color, 24);
               addScore(inv.points);
               invaders.splice(i, 1);
               kills++;
           }
       }
   }
}
function addScore(pts) {
   score += Math.round(pts * combo);
   combo = Math.min(4.0, +(combo + 0.1).toFixed(1));
   comboTimer = 160 + (player ? player.comboBonusTime : 0);
   updateHud();
}
function presentLevelUpChoices() {
   state = GameState.UPGRADING;
   sound.playLevelUp();
   const container = document.getElementById('upgrades-container');
   if (!container) return;
   container.innerHTML = '';
   const currentSkinIdx = player ? player.skinIndex : 0;
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
           STYLE_UPGRADE.apply(player);
           closeUpgradeScreen();
       };
   }
   container.appendChild(styleCard);

   const shuffled = [...RANDOM_UPGRADE_POOL].sort(() => Math.random() - 0.5);
   choices = shuffled.slice(0, 3);
   choices.forEach(upg => {
       const currentLvl = (player && player.upgrades[upg.id]) || 0;
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
   if (subTitle) subTitle.textContent = `FIN DE LA VAGUE ${wave} — AMÉLIORATION DISPONIBLE`;
   const lvlScreen = document.getElementById('levelup-screen');
   if (lvlScreen) lvlScreen.classList.remove('hidden');
}
function selectRandomUpgrade(upg) {
   if (!player) return;
   player.upgrades[upg.id] = (player.upgrades[upg.id] || 0) + 1;
   upg.apply(player, player.upgrades[upg.id]);
   sound.playPowerup();
   closeUpgradeScreen();
}
function closeUpgradeScreen() {
   const lvlScreen = document.getElementById('levelup-screen');
   if (lvlScreen) lvlScreen.classList.add('hidden');
   if (state === GameState.BOSS_REWARDS) {
       return;
   }
   if (wave === 15 && bossActive) {
       return;
   }
   startWave(wave + 1);
   state = GameState.PLAYING;
}
function startWave(waveNum) {
   wave = waveNum;
   waveSpawning = true;
   const banner = document.getElementById('wave-banner');
   if (banner) {
       banner.textContent = `VAGUE ${wave}`;
       banner.classList.add('active');
       setTimeout(() => banner.classList.remove('active'), 1800);
   }

   if (waveNum === 15) {
       startBossFight();
       return;
   }

   const cols = Math.min(7, Math.max(4, Math.floor(width / 80)));
   const rows = Math.min(5, 2 + Math.floor((wave - 1) / 3));
   const colSpacing = Math.min(85, (width - 70) / cols);
   const startX = (width - (cols - 1) * colSpacing) / 2;
   const availableTypes = ['scout'];
   if (wave >= 2) availableTypes.push('dart');
   if (wave >= 3) availableTypes.push('tank');
   if (wave >= 4) availableTypes.push('splitter');
   if (wave >= 5) availableTypes.push('disruptor');
   if (wave >= 6) availableTypes.push('phantom');
   if (wave >= 7) availableTypes.push('healer');
   for (let r = 0; r < rows; r++) {
       for (let c = 0; c < cols; c++) {
           let type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
           if (r === 0 && wave >= 3 && Math.random() < 0.4) {
               type = (wave >= 5 && Math.random() < 0.5) ? 'disruptor' : 'tank';
           }
           const x = startX + c * colSpacing;
           const y = -60 - r * 55;
           invaders.push(new Invader(x, y, type, wave));
       }
   }
   waveSpawning = false;
   updateHud();
}

const hudScore = document.getElementById('hud-score');
const hudCombo = document.getElementById('hud-combo');
const hudWave = document.getElementById('hud-wave');
const hudNovaFill = document.getElementById('hud-nova-fill');
const hudHearts = document.getElementById('hud-hearts');
const hudStatus = document.getElementById('hud-status');

function updateHud() {
   if (hudScore) hudScore.textContent = score.toLocaleString();
   if (hudCombo) hudCombo.textContent = `x${combo.toFixed(1)} Combo`;
   if (hudWave) {
       if (bossActive) {
           hudWave.textContent = 'Le noble Destrier';
       } else {
           hudWave.textContent = wave;
       }
   }
   if (hudStatus) {
       if (player && player.empTimer > 0) {
           hudStatus.classList.remove('hidden');
       } else {
           hudStatus.classList.add('hidden');
       }
   }
   if (hudNovaFill) {
       if (bossActive) {
           hudNovaFill.style.width = `${Math.max(0, Math.min(100, (1 - boss.hp / boss.maxHp) * 100))}%`;
       } else {
           hudNovaFill.style.width = `${player ? player.novaCharge : 0}%`;
       }
   }
   if (touchNovaBtn) {
       if (bossActive) {
           touchNovaBtn.classList.add('boss-disabled');
           touchNovaBtn.classList.remove('ready');
       } else if (player && player.novaCharge >= 98) {
           touchNovaBtn.classList.add('ready');
           touchNovaBtn.classList.remove('boss-disabled');
       } else {
           touchNovaBtn.classList.remove('ready');
           touchNovaBtn.classList.remove('boss-disabled');
       }
   }
}
function updateHearts() {
   if (!hudHearts || !player) return;
   if (bossActive) {
       hudHearts.innerHTML = `
          <div class="player-health-bar">
             <div class="player-health-fill" style="width:${Math.max(0, Math.min(100, (player.health / player.maxHealth) * 100))}%"></div>
          </div>
       `;
       return;
   }
   hudHearts.innerHTML = '';
   for (let i = 0; i < player.maxHealth; i++) {
       const h = document.createElement('span');
       h.className = 'heart' + (i >= player.health ? ' lost' : '');
       h.textContent = '♥';
       hudHearts.appendChild(h);
   }
}
function initGame() {
   resize();
   sound.init();
   player = new PlayerShip();
   bullets = [];
   enemyBullets = [];
   invaders = [];
   powerups = [];
   particles = [];
   shockwaves = [];
   targetX = width / 2;
   keys.left = false;
   keys.right = false;
   isTouching = false;
   totalPlaySeconds = 0;
   bossActive = false;
   boss = null;
   bossRewardStage = 0;
   victoryCutsceneTimer = 0;
   const tierEl = document.getElementById('hud-tier');
   if (tierEl && typeof SHIP_SKINS !== 'undefined' && SHIP_SKINS.length > 0) {
       tierEl.textContent = SHIP_SKINS[0].name;
   }
   score = 0;
   combo = 1.0;
   comboTimer = 0;
   kills = 0;
   player.maxHealth = 3;
   player.health = 3;
   updateHearts();
   startWave(1);
   const startScreen = document.getElementById('start-screen');
   if (startScreen) startScreen.classList.add('hidden');
   const lvlScreen = document.getElementById('levelup-screen');
   if (lvlScreen) lvlScreen.classList.add('hidden');
   const goScreen = document.getElementById('gameover-screen');
   if (goScreen) goScreen.classList.add('hidden');
   const pauseScreen = document.getElementById('pause-screen');
   if (pauseScreen) pauseScreen.classList.add('hidden');
   const pauseBtn = document.getElementById('pause-btn');
   if (pauseBtn) pauseBtn.textContent = 'PAUSE';
   state = GameState.PLAYING;
}
function endGame() {
   state = GameState.GAMEOVER;
   sound.playExplosion(true);
   if (score > highScore) {
       highScore = score;
       localStorage.setItem('neon_invaders_high', highScore.toString());
   }
   const goScore = document.getElementById('go-score');
   const goBest = document.getElementById('go-best');
   const goWave = document.getElementById('go-wave');
   const goKills = document.getElementById('go-kills');
   if (goScore) goScore.textContent = score.toLocaleString();
   if (goBest) goBest.textContent = highScore.toLocaleString();
   if (goWave) goWave.textContent = wave;
   if (goKills) goKills.textContent = kills;
   const goScreen = document.getElementById('gameover-screen');
   if (goScreen) goScreen.classList.remove('hidden');
}
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

function startBossFight() {
   bossActive = true;
   boss = {
       x: width / 2,
       y: Math.max(140, height * 0.28),
       hp: 420,
       maxHp: 420,
       dir: 1,
       speed: 2.2,
       shotCooldown: 40,
       laserCooldown: 330,
       laserWarning: 0,
       laserActive: 0,
       lasers: [],
       stopped: false,
       shields: [
           { x: width * 0.35, y: height * 0.62, radius: 18, phase: 0 },
           { x: width * 0.65, y: height * 0.62, radius: 18, phase: Math.PI }
       ]
   };
   state = GameState.BOSS_FIGHT;
   invaders = [];
   enemyBullets = [];
   bullets = [];
   powerups = [];
   player.novaCharge = 0;
   updateHearts();
   updateHud();
   const banner = document.getElementById('wave-banner');
   if (banner) {
       banner.textContent = 'Le noble Destrier';
       banner.classList.add('active');
       setTimeout(() => banner.classList.remove('active'), 2100);
   }
}
function bossLocalPoint(localX, localY) {
   const scale = Math.max(0.42, Math.min(0.52, (width - 80) / 512));
   return {
       x: boss.x + (localX - DESTRIER_PROJECT.pivot.x) * scale,
       y: boss.y + (localY - DESTRIER_PROJECT.pivot.y) * scale
   };
}
function beginBossLaserPattern() {
   const phaseTwo = boss.hp < boss.maxHp * 0.5;
   boss.stopped = true;
   boss.laserWarning = 90;
   boss.laserActive = 0;
   boss.lasers = [];

   // Center vertical lasers continue firing in Phase 1 and Phase 2
   const left = bossLocalPoint(DESTRIER_PROJECT.muzzles[2].x, DESTRIER_PROJECT.muzzles[2].y);
   const right = bossLocalPoint(DESTRIER_PROJECT.muzzles[3].x, DESTRIER_PROJECT.muzzles[3].y);
   boss.lasers.push({
       x1: left.x,
       y1: left.y,
       x2: left.x,
       y2: height + 100,
       width: 34,
       color: '#ff2a2a',
       isDiagonal: false
   });
   boss.lasers.push({
       x1: right.x,
       y1: right.y,
       x2: right.x,
       y2: height + 100,
       width: 34,
       color: '#ff2a2a',
       isDiagonal: false
   });

   // Phase 2: Add diagonal lasers targeting player's Y-level with extended length
   if (phaseTwo) {
       for (let i = 0; i < 2; i++) {
           const muzzle = DESTRIER_PROJECT.muzzles[i];
           const start = bossLocalPoint(muzzle.x, muzzle.y);
           const targetX = 50 + Math.random() * (width - 100);
           const targetY = player.y;
           const angle = Math.atan2(targetY - start.y, targetX - start.x);
           const laserLength = 3000;
           boss.lasers.push({
               x1: start.x,
               y1: start.y,
               x2: start.x + Math.cos(angle) * laserLength,
               y2: start.y + Math.sin(angle) * laserLength,
               width: 30,
               color: '#ff2a2a',
               isDiagonal: true
           });
       }
   }
   sound.playAbility();
}
function drawBoss() {
   if (!boss || !bossActive) return;
   const scale = Math.max(0.42, Math.min(0.52, (width - 80) / 512));

   if (boss.laserWarning > 0) {
       ctx.save();
       ctx.strokeStyle = 'rgba(255, 42, 42, 0.28)';
       ctx.setLineDash([8, 10]);
       ctx.lineWidth = 3;
       for (let i = 0; i < boss.lasers.length; i++) {
           const laser = boss.lasers[i];
           ctx.beginPath();
           ctx.moveTo(laser.x1, laser.y1);
           ctx.lineTo(laser.x2, laser.y2);
           ctx.stroke();
       }
       ctx.restore();
   }

   if (boss.laserActive > 0) {
       ctx.save();
       ctx.strokeStyle = '#ff0033';
       ctx.shadowColor = '#ff0033';
       ctx.shadowBlur = 18;
       ctx.lineWidth = 2;
       for (let i = 0; i < boss.lasers.length; i++) {
           const laser = boss.lasers[i];
           ctx.beginPath();
           ctx.moveTo(laser.x1, laser.y1);
           ctx.lineTo(laser.x2, laser.y2);
           ctx.stroke();
       }
       ctx.restore();
   }

   for (let i = 0; i < boss.shields.length; i++) {
       const shield = boss.shields[i];
       ctx.save();
       ctx.translate(shield.x, shield.y);
       ctx.fillStyle = 'rgba(7, 15, 30, 0.95)';
       ctx.strokeStyle = '#8ffcff';
       ctx.shadowColor = '#00f0ff';
       ctx.shadowBlur = 18;
       ctx.lineWidth = 2.5;
       ctx.beginPath();
       ctx.moveTo(-24, 0);
       ctx.lineTo(-12, -12);
       ctx.lineTo(12, -12);
       ctx.lineTo(24, 0);
       ctx.lineTo(12, 12);
       ctx.lineTo(-12, 12);
       ctx.closePath();
       ctx.fill();
       ctx.stroke();
       ctx.restore();
   }

   ctx.save();
   ctx.translate(boss.x, boss.y);
   ctx.scale(scale, scale);
   ctx.translate(-DESTRIER_PROJECT.pivot.x, -DESTRIER_PROJECT.pivot.y);

   for (let i = 0; i < DESTRIER_PROJECT.shapes.length; i++) {
       const shape = DESTRIER_PROJECT.shapes[i];
       ctx.beginPath();
       ctx.strokeStyle = shape.color;
       ctx.fillStyle = shape.type === 'circle'
           ? (shape.r === 24 ? 'rgba(0,255,102,0.9)' : 'rgba(30,5,25,0.92)')
           : 'rgba(30,5,25,0.92)';
       ctx.shadowColor = shape.color;
       ctx.shadowBlur = shape.r === 24 ? 18 : 12;
       if (shape.type === 'circle') {
           ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2);
       } else {
           shape.pts.forEach((pt, idx) => {
               if (idx === 0) ctx.moveTo(pt[0], pt[1]);
               else ctx.lineTo(pt[0], pt[1]);
           });
           ctx.closePath();
       }
       ctx.fill();
       ctx.stroke();
   }

   if (boss.laserActive > 0) {
       ctx.beginPath();
       ctx.strokeStyle = '#ffffff';
       ctx.lineWidth = 3;
       ctx.shadowColor = '#00ff66';
       ctx.shadowBlur = 20;
       ctx.arc(256, 256, 34, 0, Math.PI * 2);
       ctx.stroke();
   }
   ctx.restore();
}
function updateBossFight() {
   if (!boss || !player) return;

   player.update();
   player.novaCharge = (1 - boss.hp / boss.maxHp) * 100;

   const phaseTwo = boss.hp < boss.maxHp * 0.5;

   for (let i = 0; i < boss.shields.length; i++) {
       const shield = boss.shields[i];
       shield.phase = (shield.phase || 0) + (phaseTwo ? 0.04 : 0.03);
       shield.x = width * 0.5 + Math.sin(shield.phase) * (width * 0.28);
       shield.y = Math.min(height - 120, Math.max(boss.y + 120, height * 0.62));
   }

   if (!boss.stopped) {
       boss.x += boss.dir * boss.speed * (phaseTwo ? 1.2 : 1);
       if (boss.x < 110 || boss.x > width - 110) {
           boss.dir *= -1;
           boss.x = Math.max(110, Math.min(width - 110, boss.x));
       }
   }

   if (boss.laserWarning > 0) {
       boss.laserWarning--;
       if (boss.laserWarning === 0) {
           boss.laserActive = 150;
       }
   } else if (boss.laserActive > 0) {
       boss.laserActive--;
       for (let i = 0; i < boss.lasers.length; i++) {
           const laser = boss.lasers[i];
           const hit = pointNearSegment(player.x, player.y, laser.x1, laser.y1, laser.x2, laser.y2, laser.width / 2 + player.radius * 0.6);
           if (hit) {
               player.takeDamage();
               if (state === GameState.GAMEOVER) return;
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
           beginBossLaserPattern();
           boss.laserCooldown = phaseTwo ? 210 : 350;
       }
   }

   if (!boss.stopped) {
       boss.shotCooldown--;
       if (boss.shotCooldown <= 0) {
           const muzzleOffset = phaseTwo ? 42 : 62;
           for (let i = 0; i < 2; i++) {
               const muzzle = DESTRIER_PROJECT.muzzles[i];
               const start = bossLocalPoint(muzzle.x, muzzle.y);
               const angle = Math.atan2(player.y - start.y, player.x - start.x);
               enemyBullets.push(new Bullet(start.x, start.y, angle, '#ff0055', true, false));
           }
           boss.shotCooldown = muzzleOffset;
       }
   }

   for (let i = bullets.length - 1; i >= 0; i--) {
       const bullet = bullets[i];
       bullet.update();
       if (bullet.life <= 0 || bullet.y < -20 || bullet.x < 0 || bullet.x > width) {
           bullets.splice(i, 1);
           continue;
       }
       let blocked = false;
       for (let s = 0; s < boss.shields.length; s++) {
           const shield = boss.shields[s];
           if (Math.hypot(bullet.x - shield.x, bullet.y - shield.y) < bullet.radius + shield.radius) {
               createParticles(bullet.x, bullet.y, '#8ffcff', 4);
               bullets.splice(i, 1);
               blocked = true;
               break;
           }
       }
       if (blocked) continue;

       // Diagonal lasers act as a shield against player attacks
       if (boss.laserActive > 0) {
           for (let l = 0; l < boss.lasers.length; l++) {
               const laser = boss.lasers[l];
               if (laser.isDiagonal) {
                   const hit = pointNearSegment(bullet.x, bullet.y, laser.x1, laser.y1, laser.x2, laser.y2, (laser.width / 2) + bullet.radius);
                   if (hit) {
                       createParticles(bullet.x, bullet.y, '#ff2a2a', 6);
                       bullets.splice(i, 1);
                       blocked = true;
                       break;
                   }
               }
           }
       }
       if (blocked) continue;

       const scale = Math.max(0.42, Math.min(0.52, (width - 80) / 512));
       const localX = (bullet.x - boss.x) / scale + DESTRIER_PROJECT.pivot.x;
       const localY = (bullet.y - boss.y) / scale + DESTRIER_PROJECT.pivot.y;

       if (pointInPolygon(localX, localY, DESTRIER_PROJECT.hitbox)) {
           const center = bossLocalPoint(256, 256);
           const weakPointOpen = boss.laserActive > 0 && Math.hypot(bullet.x - center.x, bullet.y - center.y) < 40;
           const damage = weakPointOpen ? bullet.damage * 2 : bullet.damage;
           boss.hp = Math.max(0, boss.hp - damage);
           createParticles(bullet.x, bullet.y, weakPointOpen ? '#00ff66' : '#ff007f', 6);
           bullets.splice(i, 1);
           updateHearts();
           updateHud();
           if (boss.hp <= 0) {
               startBossVictoryCutscene();
               return;
           }
       }
   }

   for (let i = enemyBullets.length - 1; i >= 0; i--) {
       const bullet = enemyBullets[i];
       bullet.update();
       if (bullet.life <= 0 || bullet.y > height + 30 || bullet.x < -30 || bullet.x > width + 30) {
           enemyBullets.splice(i, 1);
           continue;
       }
       const dist = Math.hypot(bullet.x - player.x, bullet.y - player.y);
       if (dist < bullet.radius + player.radius) {
           enemyBullets.splice(i, 1);
           player.takeDamage();
           if (state === GameState.GAMEOVER) return;
       }
   }

   for (let i = particles.length - 1; i >= 0; i--) {
       const pt = particles[i];
       pt.update();
       if (pt.life <= 0) particles.splice(i, 1);
   }
}
function startBossVictoryCutscene() {
   if (!boss || !player) return;

   // Keep the defeated boss visible while the Nova shockwave reaches it.
   boss.hp = 0;
   boss.defeated = true;
   boss.stopped = true;
   boss.lasers = [];
   boss.laserWarning = 0;
   boss.laserActive = 0;

   state = GameState.BOSS_CUTSCENE;
   victoryCutsceneTimer = 0;
   player.novaCharge = 100;
   enemyBullets = [];
   bullets = [];

   sound.playNova();
   triggerShake(20);
   shockwaves.push(new Shockwave(player.x, player.y, Math.max(width, height)));

   const banner = document.getElementById('wave-banner');
   if (banner) {
       banner.textContent = 'NOVA — VICTOIRE';
       banner.classList.add('active');
   }
}
function showVictoryScreen() {
   state = GameState.BOSS_REWARDS;
   const el = document.getElementById('victory-screen');
   const timeEl = document.getElementById('victory-time');
   if (el) el.classList.remove('hidden');
   if (timeEl) timeEl.textContent = formatTime(totalPlaySeconds);
}
function formatTime(seconds) {
   const mins = Math.floor(seconds / 60);
   const secs = Math.floor(seconds % 60);
   return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
function applyBossReward(upgrade) {
   if (!player) return;
   player.upgrades[upgrade.id] = (player.upgrades[upgrade.id] || 0) + 1;
   upgrade.apply(player, player.upgrades[upgrade.id]);
   sound.playPowerup();
   bossRewardStage++;
   if (bossRewardStage < 2) {
      openBossRewards();
   } else {
      openStyleReward();
   }
}
function openBossRewards() {
   const screen = document.getElementById('levelup-screen');
   const container = document.getElementById('upgrades-container');
   const subtitle = document.getElementById('levelup-subtitle');
   if (!screen || !container || !subtitle) return;

   container.innerHTML = '';
   subtitle.textContent = bossRewardStage === 0
       ? 'RÉCOMPENSE BOSS — CHOISISSEZ VOTRE 1ER AMÉLIORATION'
       : 'RÉCOMPENSE BOSS — CHOISISSEZ VOTRE 2E AMÉLIORATION';

   RANDOM_UPGRADE_POOL.forEach(upg => {
       const currentLvl = (player && player.upgrades[upg.id]) || 0;
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
function openStyleReward() {
   const screen = document.getElementById('levelup-screen');
   const container = document.getElementById('upgrades-container');
   const subtitle = document.getElementById('levelup-subtitle');
   if (!screen || !container || !subtitle) return;

   container.innerHTML = '';
   subtitle.textContent = 'RÉCOMPENSE BOSS — CHOISISSEZ VOTRE STYLE GRATUIT';
   const maxed = player.skinIndex >= SHIP_SKINS.length - 1;

   const card = document.createElement('div');
   card.className = 'upgrade-card style-card' + (maxed ? ' maxed' : '');
   card.innerHTML = `
      <div class="upgrade-icon" style="background: rgba(255, 234, 0, 0.15); border-color: #ffea00;">${STYLE_UPGRADE.icon}</div>
      <div class="upgrade-info">
          <div class="upgrade-title">
             <span>${STYLE_UPGRADE.name}</span>
             <span class="upgrade-level-badge">${maxed ? 'MAX' : `Châssis ${player.skinIndex + 2}/10`}</span>
          </div>
          <div class="upgrade-desc">${STYLE_UPGRADE.getDesc(player.skinIndex)}</div>
      </div>`;
   card.onclick = () => {
       if (!maxed) STYLE_UPGRADE.apply(player);
       const lvlScreen = document.getElementById('levelup-screen');
       if (lvlScreen) lvlScreen.classList.add('hidden');
       bossRewardStage = 0;
       // reset player health back to hearts, set to 3 if needed, keep max if above 3
       if (player) {
           player.maxHealth = Math.max(3, player.maxHealth);
           if (player.health < 3) player.health = 3;
           updateHearts();
       }
       const banner = document.getElementById('wave-banner');
       if (banner) {
           banner.textContent = 'COMBAT TERMINÉ';
           banner.classList.add('active');
       }
       state = GameState.PLAYING;
       startWave(21);
   };
   container.appendChild(card);
   screen.classList.remove('hidden');
}
function continueFromVictory() {
   const victoryScreen = document.getElementById('victory-screen');
   if (victoryScreen) victoryScreen.classList.add('hidden');
   bossRewardStage = 0;
   openBossRewards();
}
document.addEventListener('click', (event) => {
   if (event.target && event.target.id === 'victory-continue-btn') {
       continueFromVictory();
   }
});

function update() {
  if ([GameState.PLAYING, GameState.BOSS_FIGHT, GameState.BOSS_CUTSCENE].includes(state)) {
   totalPlaySeconds += 1 / 60;
}
   if (state === GameState.GAMEOVER) return;
   if (state === GameState.BOSS_FIGHT) {
       updateBossFight();
       return;
   }
   if (state === GameState.BOSS_CUTSCENE) {
       for (let i = shockwaves.length - 1; i >= 0; i--) {
           const sw = shockwaves[i];
           sw.update();
           if (sw.finished) shockwaves.splice(i, 1);
       }
       victoryCutsceneTimer++;
     if (boss && victoryCutsceneTimer >= 55) {
   boss = null;
   bossActive = false;
   updateHearts();
   updateHud();
}
       if (victoryCutsceneTimer >= 180) {
           showVictoryScreen();
       }
       return;
   }
   if (state === GameState.BOSS_REWARDS) return;
   if (state === GameState.PLAYING) {
       if (comboTimer > 0) comboTimer--;
       else if (combo > 1.0) {
           combo = +(combo - 0.05).toFixed(1);
           comboTimer = 30;
           updateHud();
       }
       player.update();
       if (hudNovaFill) hudNovaFill.style.width = `${player.novaCharge}%`;
       if (touchNovaBtn) {
           if (player.novaCharge >= 98) {
               touchNovaBtn.classList.add('ready');
           } else {
               touchNovaBtn.classList.remove('ready');
           }
       }
       if (!waveSpawning && invaders.length === 0) {
           if (wave % 5 === 0) {
               presentLevelUpChoices();
           } else {
               startWave(wave + 1);
           }
           return;
       }
       for (let i = bullets.length - 1; i >= 0; i--) {
           const b = bullets[i];
           b.update();
           if (b.life <= 0 || b.y < -20 || b.x < 0 || b.x > width) {
               bullets.splice(i, 1);
               continue;
           }
           let bulletRemoved = false;
           for (let ebIdx = enemyBullets.length - 1; ebIdx >= 0; ebIdx--) {
               const eb = enemyBullets[ebIdx];
               const distEB = Math.hypot(b.x - eb.x, b.y - eb.y);
               if (distEB < b.radius + eb.radius + 4) {
                   sound.playBulletIntercept();
                   createParticles((b.x + eb.x) / 2, (b.y + eb.y) / 2, '#ffffff', 8);
                   createParticles(eb.x, eb.y, '#ff0055', 6);
                   enemyBullets.splice(ebIdx, 1);
                   if (b.pierce <= 0) {
                       bullets.splice(i, 1);
                       bulletRemoved = true;
                   } else {
                       b.pierce--;
                   }
                   break;
               }
           }
           if (bulletRemoved) continue;
           for (let pIdx = powerups.length - 1; pIdx >= 0; pIdx--) {
               const p = powerups[pIdx];
               const distP = Math.hypot(b.x - p.x, b.y - p.y);
               if (distP < b.radius + p.radius) {
                   sound.playPowerup();
                   createParticles(p.x, p.y, p.color, 20);
                   if (p.type === 'triple') {
                       player.tripleShotTimer = 480;
                   } else if (p.type === 'rapid') {
                       player.rapidFireTimer = 420;
                   } else if (p.type === 'shield') {
                       player.shieldTimer = 550;
                   } else if (p.type === 'nuke') {
                       triggerNova();
                   }
                   powerups.splice(pIdx, 1);
                   bullets.splice(i, 1);
                   bulletRemoved = true;
                   break;
               }
           }
           if (bulletRemoved) continue;

           for (let j = invaders.length - 1; j >= 0; j--) {
               const inv = invaders[j];
               const dist = Math.hypot(b.x - inv.x, b.y - inv.y);
               if (dist < b.radius + inv.radius) {
                   if (inv.type === 'tank' && inv.shieldActive) {
                       bullets.splice(i, 1);
                       createParticles(b.x, b.y, '#00f0ff', 6);
                       sound.playBulletIntercept();
                       break;
                   }
                   inv.hp -= b.damage;
                   createParticles(b.x, b.y, inv.color, 5);
                   if (b.pierce <= 0) {
                       bullets.splice(i, 1);
                   } else {
                       b.pierce--;
                   }
                   if (inv.hp <= 0) {
                       sound.playExplosion(inv.type === 'tank');
                       createParticles(inv.x, inv.y, inv.color, 22);
                       addScore(inv.points);
                       if (inv.type === 'splitter') {
                           const drone1 = new Invader(inv.x - 16, inv.y, 'mini_drone', wave);
                           const drone2 = new Invader(inv.x + 16, inv.y, 'mini_drone', wave);
                           drone1.wobble = 0;
                           drone2.wobble = Math.PI;
                           invaders.push(drone1, drone2);
                       }
                       if (Math.random() < 0.18) {
                           powerups.push(new PowerUp(inv.x, inv.y));
                       }
                       invaders.splice(j, 1);
                   }
                   break;
               }
           }
       }

       for (let i = enemyBullets.length - 1; i >= 0; i--) {
           const eb = enemyBullets[i];
           eb.update();
           if (eb.life <= 0 || eb.y > height + 20) {
               enemyBullets.splice(i, 1);
               continue;
           }
           const distPlayer = Math.hypot(eb.x - player.x, eb.y - player.y);
           if (distPlayer < eb.radius + player.radius) {
               if (eb.isEmp) {
                   player.empTimer = 180;
                   createParticles(player.x, player.y, '#ff00aa', 15);
                   updateHud();
               }
               enemyBullets.splice(i, 1);
               player.takeDamage();
           }
       }
       for (let i = invaders.length - 1; i >= 0; i--) {
           const inv = invaders[i];
           inv.update();
           if (height > 100 && inv.y > height + inv.radius + 10 && inv.y > 0) {
               sound.playBreach();
               triggerBreachWarning();
               triggerShake(10);
               if (player) {
                   player.takeDamage();
               }
               invaders.splice(i, 1);
               continue;
           }
           const distPlayer = Math.hypot(inv.x - player.x, inv.y - player.y);
           if (distPlayer < inv.radius + player.radius) {
               player.takeDamage();
               createParticles(inv.x, inv.y, inv.color, 20);
               invaders.splice(i, 1);
               continue;
           }
       }
       for (let i = powerups.length - 1; i >= 0; i--) {
           const p = powerups[i];
           p.update();
           if (p.life <= 0 || p.y > height + 30) {
               powerups.splice(i, 1);
           }
       }
       for (let i = particles.length - 1; i >= 0; i--) {
           const pt = particles[i];
           pt.update();
           if (pt.life <= 0) particles.splice(i, 1);
       }
       for (let i = shockwaves.length - 1; i >= 0; i--) {
           const sw = shockwaves[i];
           sw.update();
           if (sw.finished) shockwaves.splice(i, 1);
       }
   }
}

function draw() {
   ctx.save();
   ctx.scale(dpr, dpr);
   if (shake > 0) {
       const rx = (Math.random() - 0.5) * shake;
       const ry = (Math.random() - 0.5) * shake;
       ctx.translate(rx, ry);
       shake *= 0.88;
       if (shake < 0.2) shake = 0;
   }
   ctx.fillStyle = '#03030a';
   ctx.fillRect(0, 0, width, height);
   ctx.save();
   ctx.strokeStyle = 'rgba(0, 240, 255, 0.035)';
   ctx.lineWidth = 1;
   const step = 55;
   for (let x = 0; x < width; x += step) {
       ctx.beginPath();
       ctx.moveTo(x, 0);
       ctx.lineTo(x, height);
       ctx.stroke();
   }
   for (let y = 0; y < height; y += step) {
       ctx.beginPath();
       ctx.moveTo(0, y);
       ctx.lineTo(width, y);
       ctx.stroke();
   }
   ctx.restore();

   ctx.save();
   ctx.strokeStyle = 'rgba(255, 0, 85, 0.25)';
   ctx.setLineDash([8, 8]);
   ctx.lineWidth = 2;
   ctx.beginPath();
   ctx.moveTo(0, height - 16);
   ctx.lineTo(width, height - 16);
   ctx.stroke();
   ctx.restore();

   for (let sw of shockwaves) sw.draw();
   for (let pt of particles) pt.draw();
   for (let p of powerups) p.draw();
   for (let b of bullets) b.draw();
   for (let eb of enemyBullets) eb.draw();
   for (let inv of invaders) inv.draw();
   if (bossActive) drawBoss();
   if (player && (state === GameState.PLAYING || state === GameState.UPGRADING || state === GameState.PAUSED || state === GameState.BOSS_FIGHT || state === GameState.BOSS_CUTSCENE)) {
       player.draw();
   }
   ctx.restore();
}

function gameLoop() {
   update();
   draw();
   requestAnimationFrame(gameLoop);
}
function bindGameEvents() {
   const startBtn = document.getElementById('start-btn');
   if (startBtn) startBtn.addEventListener('click', initGame);
   const restartBtn = document.getElementById('restart-btn');
   if (restartBtn) restartBtn.addEventListener('click', initGame);
   const pauseBtn = document.getElementById('pause-btn');
   if (pauseBtn) pauseBtn.addEventListener('click', togglePause);
   const resumeBtn = document.getElementById('resume-btn');
   if (resumeBtn) resumeBtn.addEventListener('click', togglePause);
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
