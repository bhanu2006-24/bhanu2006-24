import { loadAssets, TILE_SIZE } from './assets.js';
import { World } from './world.js';
import { Player } from './player.js';
import { InteractionSystem } from './interaction.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// UI Elements
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const nameInput = document.getElementById('player-name');
const colorBtns = document.querySelectorAll('.color-btn');
const projectModal = document.getElementById('project-modal');
const closeModal = document.querySelector('.close-modal');
const dialogBox = document.getElementById('dialog-box');
const dialogContent = document.getElementById('dialog-content');
const dialogNext = document.getElementById('dialog-next');

// Game State
let gameState = 'START'; // START, PLAYING, DIALOG, MODAL
let world;
let player;
let interactionSystem;
let selectedColor = '#e74c3c';
let camera = { x: 0, y: 0, width: 0, height: 0 };
let input = { keys: {} };
let currentDialog = null;
let dialogIndex = 0;

// Initialization
function init() {
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('keydown', e => input.keys[e.key] = true);
    window.addEventListener('keyup', e => input.keys[e.key] = false);
    window.addEventListener('keydown', handleInteractionInput);

    // UI Event Listeners
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedColor = btn.dataset.color;
        });
    });

    startBtn.addEventListener('click', startGame);
    closeModal.addEventListener('click', hideProject);
    dialogNext.addEventListener('click', nextDialog);

    loadAssets();

    // Start Loop
    requestAnimationFrame(gameLoop);
}

function startGame() {
    const name = nameInput.value.trim() || 'Hero';
    world = new World();
    player = new Player(name, selectedColor, 15, 15); // Start in middle
    interactionSystem = new InteractionSystem(world, {
        showProject: showProject,
        showDialog: showDialog
    });

    startScreen.classList.add('hidden');
    gameState = 'PLAYING';
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    camera.width = canvas.width;
    camera.height = canvas.height;
    ctx.imageSmoothingEnabled = false;
}

function handleInteractionInput(e) {
    if (gameState === 'PLAYING' && e.code === 'Space') {
        interactionSystem.interact(player);
    }
}

// UI Functions
function showProject(project) {
    gameState = 'MODAL';
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('project-desc').textContent = project.description;
    document.getElementById('project-link').href = project.link;

    const tagsContainer = document.getElementById('project-tags');
    tagsContainer.innerHTML = '';
    project.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        tagsContainer.appendChild(span);
    });

    projectModal.classList.remove('hidden');
}

function hideProject() {
    projectModal.classList.add('hidden');
    gameState = 'PLAYING';
}

function showDialog(name, textArray) {
    gameState = 'DIALOG';
    currentDialog = textArray;
    dialogIndex = 0;
    dialogBox.classList.remove('hidden');
    updateDialogText();
}

function nextDialog() {
    dialogIndex++;
    if (dialogIndex >= currentDialog.length) {
        dialogBox.classList.add('hidden');
        gameState = 'PLAYING';
        currentDialog = null;
    } else {
        updateDialogText();
    }
}

function updateDialogText() {
    dialogContent.textContent = currentDialog[dialogIndex];
}

// Game Loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    if (gameState === 'PLAYING') {
        player.update(input, world);

        // Update Camera to follow player
        camera.x = player.pixelX - camera.width / 2 + TILE_SIZE / 2;
        camera.y = player.pixelY - camera.height / 2 + TILE_SIZE / 2;

        // Clamp Camera
        camera.x = Math.max(0, Math.min(camera.x, world.width * TILE_SIZE - camera.width));
        camera.y = Math.max(0, Math.min(camera.y, world.height * TILE_SIZE - camera.height));
    }
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameState !== 'START') {
        world.draw(ctx, camera);
        player.draw(ctx, camera);
    }
}

init();
