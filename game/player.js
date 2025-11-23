import { TILE_SIZE, getPlayerAsset } from './assets.js';

export class Player {
    constructor(name, color, startX, startY) {
        this.name = name;
        this.color = color;
        this.x = startX;
        this.y = startY;
        this.asset = getPlayerAsset(color);
        this.isMoving = false;
        this.moveSpeed = 4; // Pixels per frame
        this.targetX = startX * TILE_SIZE;
        this.targetY = startY * TILE_SIZE;
        this.pixelX = startX * TILE_SIZE;
        this.pixelY = startY * TILE_SIZE;
        this.direction = 'down';
    }

    update(input, world) {
        if (this.isMoving) {
            this.continueMovement();
        } else {
            this.handleInput(input, world);
        }
    }

    handleInput(input, world) {
        let dx = 0;
        let dy = 0;

        if (input.keys['ArrowUp'] || input.keys['w']) dy = -1;
        else if (input.keys['ArrowDown'] || input.keys['s']) dy = 1;
        else if (input.keys['ArrowLeft'] || input.keys['a']) dx = -1;
        else if (input.keys['ArrowRight'] || input.keys['d']) dx = 1;

        if (dx !== 0 || dy !== 0) {
            const nextX = this.x + dx;
            const nextY = this.y + dy;

            if (!world.isSolid(nextX, nextY)) {
                this.x = nextX;
                this.y = nextY;
                this.targetX = nextX * TILE_SIZE;
                this.targetY = nextY * TILE_SIZE;
                this.isMoving = true;
            }
        }
    }

    continueMovement() {
        if (this.pixelX < this.targetX) this.pixelX += this.moveSpeed;
        if (this.pixelX > this.targetX) this.pixelX -= this.moveSpeed;
        if (this.pixelY < this.targetY) this.pixelY += this.moveSpeed;
        if (this.pixelY > this.targetY) this.pixelY -= this.moveSpeed;

        // Snap to grid if close enough
        if (Math.abs(this.pixelX - this.targetX) < this.moveSpeed) this.pixelX = this.targetX;
        if (Math.abs(this.pixelY - this.targetY) < this.moveSpeed) this.pixelY = this.targetY;

        if (this.pixelX === this.targetX && this.pixelY === this.targetY) {
            this.isMoving = false;
        }
    }

    draw(ctx, camera) {
        ctx.drawImage(
            this.asset,
            Math.round(this.pixelX - camera.x),
            Math.round(this.pixelY - camera.y)
        );

        // Draw Name
        ctx.fillStyle = 'white';
        ctx.font = '10px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(
            this.name,
            Math.round(this.pixelX - camera.x + TILE_SIZE / 2),
            Math.round(this.pixelY - camera.y - 5)
        );
    }
}
