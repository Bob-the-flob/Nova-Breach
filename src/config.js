// src/config.js
import { sound } from './audio.js';
import { createParticles, updateHearts } from './main.js';

export const SHIP_SKINS = [
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

export const STYLE_UPGRADE = {
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

export const RANDOM_UPGRADE_POOL = [
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
