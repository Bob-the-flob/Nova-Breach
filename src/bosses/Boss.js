// src/bosses/Boss.js
import { state } from '../state.js';

export default class Boss {
    constructor(x, y, maxHp, speed) {
        this.x = x;
        this.y = y;
        this.hp = maxHp;
        this.maxHp = maxHp;
        this.speed = speed;
        this.dir = 1;
        this.stopped = false;
        this.defeated = false;
    }

    // Handles the standard horizontal sweeping motion
    updateMove(speedMultiplier = 1) {
        if (!this.stopped && !this.defeated) {
            this.x += this.dir * (this.speed * speedMultiplier);
            if (this.x < 110 || this.x > state.width - 110) {
                this.dir *= -1;
                this.x = Math.max(110, Math.min(state.width - 110, this.x));
            }
        }
    }

    takeDamage(amount) {
        this.hp = Math.max(0, this.hp - amount);
        return this.hp <= 0;
    }

    // These will be overridden by specific boss subclasses (like Destrier)
    update() {}
    draw() {}
}
