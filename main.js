// main.js
import { levels } from './levels.js';
import { Player } from './player.js';
import { NPC } from './npc.js';

// Helper for distance checks
function distance(x1, y1, x2, y2) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

let stage, layer;
let player, npc;
const npcRadius = 80; // range for speech

// For multi-level support
let currentLevelIndex = 0;

// Keep references to the background Konva.Image so we can update it each level
let bg;

// Track arrow keys
const keysDown = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};

function initGame() {
  stage = new Konva.Stage({
    container: 'gameContainer',
    width: 800,
    height: 600
  });
  layer = new Konva.Layer();
  stage.add(layer);

  // Create a background Konva.Image (we'll set its image src in loadLevel)
  bg = new Konva.Image({
    x: 0,
    y: 0,
    width: 800,
    height: 600
  });
  layer.add(bg);

  // Load the first level
  loadLevel(currentLevelIndex);

  // Key listeners
  window.addEventListener('keydown', (e) => {
    // If user presses "N", go to next level (for demo)
    if (e.key === 'n' || e.key === 'N') {
      goToNextLevel();
    }

    if (e.key in keysDown) {
      keysDown[e.key] = true;
      if (player) {
        player.updateDirection(keysDown);
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.key in keysDown) {
      keysDown[e.key] = false;
      if (player) {
        player.updateDirection(keysDown);
      }
    }
  });

  // Konva animation loop
  const anim = new Konva.Animation((frame) => {
    if (!frame?.timeDiff || !player || !npc) return;
    const dt = frame.timeDiff / 1000;

    // Update player movement
    player.update(dt, stage.width(), stage.height());

    // Check proximity for NPC
    const dist = distance(player.centerX, player.centerY, npc.centerX, npc.centerY);
    if (dist < npcRadius) {
      // NPC faces the player
      npc.facePlayer(player.centerX - npc.centerX, player.centerY - npc.centerY);

      // If the player just entered range, show bubble
      if (!npc.playerNearby) {
        npc.playerNearby = true;
        npc.showBubble("Hi, how are you?");
      }
    } else {
      npc.playerNearby = false;
    }
  }, layer);

  anim.start();
}

// Load a specific level by index
function loadLevel(index) {
  // Clear old player / NPC from the layer if they exist
  if (player) player.sprite.destroy();
  if (npc) npc.sprite.destroy();
  if (npc && npc.label) npc.label.destroy();

  // Get level data
  const level = levels[index];
  if (!level) {
    console.error("Level index out of range:", index);
    return;
  }

  // Load background image
  const bgImg = new Image();
  bgImg.onload = () => {
    bg.image(bgImg);
    layer.batchDraw();
  };
  bgImg.src = level.background;

  // Create player
  const playerImg = new Image();
  playerImg.onload = () => {
    player = new Player({
      layer: layer,
      x: level.playerStart.x,
      y: level.playerStart.y,
      image: playerImg
    });
  };
  //playerImg.src = './sheets/male_warrior.png';
  playerImg.src = './sheets/fox.png';

  // Create NPC
  const npcImg = new Image();
  npcImg.onload = () => {
    npc = new NPC({
      layer: layer,
      x: level.npcStart.x,
      y: level.npcStart.y,
      image: npcImg
    });
  };
  npcImg.src = './sheets/female_warrior.png';
}
// Simple function to go to next level in the array
function goToNextLevel() {
  currentLevelIndex++;
  if (currentLevelIndex >= levels.length) {
    // No more levels; wrap around or show final message
    alert("No more levels! Reloading first level...");
    currentLevelIndex = 0;
  }
  loadLevel(currentLevelIndex);
}

// Start the game once window loads
window.addEventListener('load', initGame);
