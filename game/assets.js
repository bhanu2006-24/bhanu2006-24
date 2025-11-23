export const TILE_SIZE = 32;

export const assets = {
    player: null,
    tiles: {},
};

// Simple procedural texture generation to avoid external assets
function createColorCanvas(color, width = TILE_SIZE, height = TILE_SIZE) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);

    // Add some noise/texture
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    for (let i = 0; i < 10; i++) {
        ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
    }

    return canvas;
}

function createPlayerSprite(color) {
    const canvas = document.createElement('canvas');
    canvas.width = TILE_SIZE;
    canvas.height = TILE_SIZE;
    const ctx = canvas.getContext('2d');

    // Body
    ctx.fillStyle = color;
    ctx.fillRect(8, 8, 16, 16);

    // Head
    ctx.fillStyle = '#ffccaa'; // Skin tone
    ctx.fillRect(10, 4, 12, 10);

    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(12, 8, 2, 2);
    ctx.fillRect(18, 8, 2, 2);

    return canvas;
}

export function loadAssets() {
    // Terrain
    assets.tiles.grass = createColorCanvas('#2ecc71');
    assets.tiles.water = createColorCanvas('#3498db');
    assets.tiles.wall = createColorCanvas('#7f8c8d');
    assets.tiles.floor = createColorCanvas('#95a5a6');
    assets.tiles.path = createColorCanvas('#d35400');

    // Objects
    assets.tiles.chest = createColorCanvas('#f1c40f'); // Gold chest
    assets.tiles.npc = createPlayerSprite('#8e44ad'); // Purple NPC
}

export function getPlayerAsset(color) {
    return createPlayerSprite(color);
}
