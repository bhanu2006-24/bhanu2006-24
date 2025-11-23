export class InteractionSystem {
    constructor(world, ui) {
        this.world = world;
        this.ui = ui;
    }

    interact(player) {
        // Check for objects in front of player or on current tile
        // For simplicity, let's check the tile the player is currently on or adjacent

        // Check adjacent tiles based on direction (simplified to checking neighbors)
        const neighbors = [
            { x: player.x, y: player.y }, // On top
            { x: player.x, y: player.y - 1 }, // Up
            { x: player.x, y: player.y + 1 }, // Down
            { x: player.x - 1, y: player.y }, // Left
            { x: player.x + 1, y: player.y }  // Right
        ];

        for (let pos of neighbors) {
            const obj = this.world.getObjectAt(pos.x, pos.y);
            if (obj) {
                this.handleObjectInteraction(obj);
                return;
            }
        }
    }

    handleObjectInteraction(obj) {
        if (obj.type === 'chest') {
            this.ui.showProject(obj.data);
        } else if (obj.type === 'npc') {
            this.ui.showDialog(obj.data.name, obj.data.dialog);
        }
    }
}
