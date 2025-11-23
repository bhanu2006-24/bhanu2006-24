import { TILE_SIZE, assets } from './assets.js';
import { projects, npcs } from './data.js';

export class World {
    constructor() {
        this.width = 40;
        this.height = 30;
        this.map = [];
        this.objects = [];
        this.generateMap();
    }

    generateMap() {
        // Initialize with grass
        for (let y = 0; y < this.height; y++) {
            this.map[y] = [];
            for (let x = 0; x < this.width; x++) {
                // Simple borders
                if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
                    this.map[y][x] = 'wall';
                } else {
                    // Random water patches
                    if (Math.random() > 0.95) {
                        this.map[y][x] = 'water';
                    } else {
                        this.map[y][x] = 'grass';
                    }
                }
            }
        }

        // Create paths and areas
        this.createPath(5, 5, 35, 5);
        this.createPath(20, 5, 20, 25);

        // Place Projects (Chests)
        projects.forEach((project, index) => {
            // Distribute them around the map
            let px = 5 + (index * 5) % 30;
            let py = 8 + Math.floor(index / 6) * 5;

            // Ensure valid position
            if (this.map[py] && this.map[py][px] !== 'wall' && this.map[py][px] !== 'water') {
                this.objects.push({
                    type: 'chest',
                    x: px,
                    y: py,
                    data: project
                });
            }
        });

        // Place NPCs
        npcs.forEach(npc => {
            this.objects.push({
                type: 'npc',
                x: npc.x,
                y: npc.y,
                data: npc
            });
        });
    }

    createPath(x1, y1, x2, y2) {
        // Simple horizontal/vertical path drawing
        if (x1 === x2) {
            for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
                this.map[y][x1] = 'path';
            }
        } else if (y1 === y2) {
            for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
                this.map[y1][x] = 'path';
            }
        }
    }

    draw(ctx, camera) {
        const startCol = Math.floor(camera.x / TILE_SIZE);
        const endCol = startCol + (camera.width / TILE_SIZE) + 1;
        const startRow = Math.floor(camera.y / TILE_SIZE);
        const endRow = startRow + (camera.height / TILE_SIZE) + 1;

        for (let y = startRow; y <= endRow; y++) {
            for (let x = startCol; x <= endCol; x++) {
                if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
                    const tileType = this.map[y][x];
                    if (assets.tiles[tileType]) {
                        ctx.drawImage(
                            assets.tiles[tileType],
                            Math.round(x * TILE_SIZE - camera.x),
                            Math.round(y * TILE_SIZE - camera.y)
                        );
                    }
                }
            }
        }

        // Draw Objects
        this.objects.forEach(obj => {
            let asset = assets.tiles[obj.type];
            if (asset) {
                ctx.drawImage(
                    asset,
                    Math.round(obj.x * TILE_SIZE - camera.x),
                    Math.round(obj.y * TILE_SIZE - camera.y)
                );
            }
        });
    }

    isSolid(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return true;
        const tile = this.map[y][x];
        return tile === 'wall' || tile === 'water';
    }

    getObjectAt(x, y) {
        return this.objects.find(obj => obj.x === x && obj.y === y);
    }
}
