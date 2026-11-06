// src/state.js

export const GameState = {
    MENU: 0,
    PLAYING: 1,
    UPGRADING: 2,
    GAMEOVER: 3,
    PAUSED: 4,
    BOSS_FIGHT: 5,
    BOSS_CUTSCENE: 6,
    BOSS_REWARDS: 7
};

export const state = {
    current: GameState.MENU,
    pausedFromState: null,
    
    // Canvas & Screen
    canvas: null,
    ctx: null,
    width: window.innerWidth || 800,
    height: window.innerHeight || 600,
    dpr: 1,
    
    // Inputs
    keys: { left: false, right: false },
    isTouching: false,
    targetX: (window.innerWidth || 800) / 2,
    
    // Game Entities
    player: null,
    bullets: [],
    enemyBullets: [],
    invaders: [],
    powerups: [],
    particles: [],
    shockwaves: [],
    
    // Progress & Stats
    score: 0,
    combo: 1.0,
    comboTimer: 0,
    wave: 1,
    kills: 0,
    shake: 0,
    waveSpawning: false,
    highScore: parseInt(localStorage.getItem('neon_invaders_high') || '0', 10),
    
    // Boss State
    totalPlaySeconds: 0,
    bossActive: false,
    boss: null,
    bossRewardStage: 0,
    victoryCutsceneTimer: 0
};

export function triggerShake(amt) {
    state.shake = Math.max(state.shake, amt);
}
