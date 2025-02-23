// npc.js

function framesForRow(rowIndex) {
    const frames = [];
    for (let col = 0; col < 9; col++) {
      frames.push(col * 64, rowIndex * 64, 64, 64);
    }
    return frames;
  }
  
  export class NPC {
    constructor(config) {
      // config: layer, x, y, image
      this.layer = config.layer;
      this.x = config.x;
      this.y = config.y;
  
      this.animations = {
        up:    framesForRow(0),
        left:  framesForRow(1),
        down:  framesForRow(2),
        right: framesForRow(3),
      };
  
      // Non-animated sprite (frameRate = 0)
      this.sprite = new Konva.Sprite({
        x: this.x,
        y: this.y,
        image: config.image,
        animations: this.animations,
        animation: 'down', // idle facing down
        frameRate: 0,
        frameIndex: 0
      });
      this.layer.add(this.sprite);
  
      // Create a Konva.Label for speech bubble
      this.label = new Konva.Label({
        x: this.sprite.x() + 20,
        y: this.sprite.y() - 40,
        visible: false
      });
      this.label.add(new Konva.Tag({
        fill: 'white',
        pointerDirection: 'down',
        pointerWidth: 10,
        pointerHeight: 10,
        cornerRadius: 6
      }));
      this.labelText = new Konva.Text({
        text: '',
        fontFamily: 'Arial',
        fontSize: 14,
        padding: 6,
        fill: 'black',
        width: 120,
        align: 'center'
      });
      this.label.add(this.labelText);
      this.layer.add(this.label);
  
      // For checking if we just showed bubble
      this.playerNearby = false;
    }
  
    get centerX() {
      return this.sprite.x() + 32;
    }
    get centerY() {
      return this.sprite.y() + 32;
    }
  
    facePlayer(dx, dy) {
      // dx, dy from NPC to Player
      if (Math.abs(dx) > Math.abs(dy)) {
        this.sprite.animation(dx < 0 ? 'left' : 'right');
      } else {
        this.sprite.animation(dy < 0 ? 'up' : 'down');
      }
      this.sprite.frameIndex(0);
    }
  
    showBubble(message) {
      this.labelText.text(message);
      //this.label.show();
      this.layer.batchDraw();
      setTimeout(() => {
        this.label.hide();
        this.layer.batchDraw();
      }, 3000);
    }
  }
  