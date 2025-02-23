// player.js

// Helper function: build frames for 9 columns (64×64 each) in a given row
function framesForRow(rowIndex) {
    const frames = [];
    for (let col = 0; col < 9; col++) {
      frames.push(col * 64, rowIndex * 64, 64, 64);
    }
    return frames;
  }
  
  export class Player {
    constructor(config) {
      // config should include: layer, x, y, image
      this.layer = config.layer;
      this.x = config.x;
      this.y = config.y;
      this.speed = 100;
  
      // Animations: 4 rows × 9 columns
      this.animations = {
        up:    framesForRow(0),
        left:  framesForRow(1),
        down:  framesForRow(2),
        right: framesForRow(3),
      };
  
      // Create Konva Sprite
      this.sprite = new Konva.Sprite({
        x: this.x,
        y: this.y,
        image: config.image,
        animation: 'down', // default
        animations: this.animations,
        frameRate: 8,
        frameIndex: 0
      });
      this.layer.add(this.sprite);
      this.sprite.start(); // starts animating; we’ll stop it on idle
  
      // Movement velocity
      this.vx = 0;
      this.vy = 0;
    }
  
    // Called when arrow keys change
    updateDirection(keysDown) {
      // Reset velocity
      this.vx = 0;
      this.vy = 0;
  
      if (keysDown.ArrowLeft) {
        this.vx = -this.speed;
        this.sprite.animation('left');
      } else if (keysDown.ArrowRight) {
        this.vx = this.speed;
        this.sprite.animation('right');
      } else if (keysDown.ArrowUp) {
        this.vy = -this.speed;
        this.sprite.animation('up');
      } else if (keysDown.ArrowDown) {
        this.vy = this.speed;
        this.sprite.animation('down');
      }
  
      // If not moving, stop the animation
      if (this.vx === 0 && this.vy === 0) {
        this.sprite.stop();
        this.sprite.frameIndex(0);
      } else {
        this.sprite.start(); // walking animation
      }
    }
  
    // Called each frame in the Konva.Animation loop
    update(dt, stageWidth, stageHeight) {
      if (this.vx !== 0 || this.vy !== 0) {
        // next position
        const nextX = this.sprite.x() + this.vx * dt;
        const nextY = this.sprite.y() + this.vy * dt;
        // clamp
        const clampX = Math.max(0, Math.min(stageWidth - 64, nextX));
        const clampY = Math.max(0, Math.min(stageHeight - 64, nextY));
        this.sprite.x(clampX);
        this.sprite.y(clampY);
      }
    }
  
    // Helper: get center X/Y for distance checks
    get centerX() {
      return this.sprite.x() + 32;
    }
    get centerY() {
      return this.sprite.y() + 32;
    }
  }
  