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

// Default settings dictionary for Developer Mode
const defaultDevSettings = {
    active: false,
    mode: 'global', // 'global' or 'specific'
    global: {
        hp: 1.0,
        speed: 1.0,
        dmg: 1.0,
        aimChance: 1.0
    },
    specific: {
        scout: { hp: 1.0, speed: 1.0, dmg: 1.0, aimChance: 1.0 },
        dart: { hp: 1.0, speed: 1.0, dmg: 1.0, aimChance: 1.0 },
        tank: { hp: 1.0, speed: 1.0, dmg: 1.0, aimChance: 1.0 },
        splitter: { hp: 1.0, speed: 1.0, dmg: 1.0, aimChance: 1.0 },
        mini_drone: { hp: 1.0, speed: 1.0, dmg: 1.0, aimChance: 1.0 },
        disruptor: { hp: 1.0, speed: 1.0, dmg: 1.0, aimChance: 1.0 },
        phantom: { hp: 1.0, speed: 1.0, dmg: 1.0, aimChance: 1.0 },
        healer: { hp: 1.0, speed: 1.0, dmg: 1.0, aimChance: 1.0 },
        boss_destrier: { hp: 1.0, speed: 1.0, dmg: 1.0, aimChance: 1.0 }
    }
};

// Retrieve settings stored on this device, falling back to defaults if not set
let loadedDevSettings = defaultDevSettings;
try {
    const rawStored = localStorage.getItem('neon_invaders_dev');
    if (rawStored) {
        loadedDevSettings = { ...defaultDevSettings, ...JSON.parse(rawStored) };
    }
} catch (e) {
    console.warn('Unable to load developer settings from localStorage:', e);
}

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
    victoryCutsceneTimer: 0,

    // Developer Mode Settings
    devSettings: loadedDevSettings
};

export function triggerShake(amt) {
    state.shake = Math.max(state.shake, amt);
}

// Persist the developer configuration to this device's browser memory
export function saveDevSettings() {
    try {
        localStorage.setItem('neon_invaders_dev', JSON.stringify(state.devSettings));
    } catch (e) {
        console.warn('Unable to save developer settings to localStorage:', e);
    }
}
