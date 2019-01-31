
/**
 * Michael Josten
 * Comp World Animation Project
 * This class will contain the animation and update logic for
 * the samus character
 */
const SAMUS_SCALE = 1.75;
const JUMP_HEIGHT = 200;
const GRAVITY = 0.30;
const ROCKET_SCALE = 1;
const TIME_BEFORE_FIRE = 1;
const ROCKET_SPEED = 1000;
const ROCKET_EXPLOSION_X = 600;
const ROCKET_EXPLOSION_SCALE = 1.7;

class Samus extends Entity {

    constructor(game, startX, startY) {
        super(game, startX, startY, 0, 0);

        this.assetManager = game.assetManager;
        this.ctx = game.ctx;
        this.jumping = false;
        //this.falling = false;
        this.shooting = false;
        this.firstJumpFrame = false;

        //Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse)
        this.runningAnimation = new Animation(this.assetManager.getAsset( './img/samusRunning.png'),
            0, 0, 50, 50, 0.1, 8, true, false);

        this.jumpAnimation = new Animation(this.assetManager.getAsset('./img/samusJump.png'), 
            0, 0, 50, 50, 0.1, 6, true, false);

        this.shootAnimation = new Animation(this.assetManager.getAsset('./img/samusRunShoot.png'),
            0, 0, 50, 50, 0.1, 8, true, false);
        //this.animation = this.runningAnimation;
        this.animation = this.runningAnimation;
        this.ground = this.y;
        this.velocityY = 0;

        this.timeToNextFire = TIME_BEFORE_FIRE;
        
    }

    
    

    update() {

        if (this.game.keys['Space'] && !this.jumping && !this.shooting) {
            this.jumping = true;
            this.firstJumpFrame = true;
            this.velocityY = -12;
        } 
        if (this.jumping) {
            // var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
            // var totalHeight = JUMP_HEIGHT;
            // if (jumpDistance > 0.5)
            //     jumpDistance = 1 - jumpDistance;

            //var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
            this.y += this.velocityY;
            this.velocityY += GRAVITY;
            
            //this.y = this.ground - height;

            if (this.y >= this.ground && !this.firstJumpFrame) {
                this.y = this.ground;
                this.jumping = false;
                this.velocityY = 0;
            }
            this.firstJumpFrame = false;
        }
        //spawn a rocket that flies off and explodes.
        if (this.game.keys['KeyF'] && !this.shooting && !this.jumping) {
            if (this.timeToNextFire <= 0) {
                this.shooting = true;
                this.animation = this.shootAnimation;
                this.game.addEntity(new Rocket(this.game, this.x + 65, this.y + 22));
                this.timeToNextFire = TIME_BEFORE_FIRE;
                this.shooting = false;
            }
            
        }
        

        this.x += this.game.clockTick * this.deltaX; // ultimately deltaX should always be 0, stays centered, move everything else
        this.y += this.game.clockTick * this.deltaY;
        this.timeToNextFire -= this.game.clockTick
        if (this.timeToNextFire <= 0) {
            this.animation = this.runningAnimation;
        }
        super.update();
    }

    draw() {
        //Animation.drawFrame(tick, ctx, x, y, scaleBy)
        if (this.jumping) {
            this.jumpAnimation.drawFrame(this.game.clockTick, this.ctx, this.x + 17, this.y - 34, SAMUS_SCALE);
        }
        else {
            this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, SAMUS_SCALE);
        }
        super.draw();
        
        
    }

}

class Rocket extends Entity {
    constructor(game, startX, startY) {
        super(game, startX, startY, 0, 0);
        //Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse)
        this.animation = new Animation(this.game.assetManager.getAsset('./img/weapons.png'),
            68, 30, 24, 17, 1, 1, true, false);
        this.deltaX = ROCKET_SPEED;

    }

    update() {
        if (this.outsideScreen()) {
            this.removeFromWorld = true;
        }
        this.x += this.deltaX * this.game.clockTick;
        this.y += this.deltaY * this.game.clockTick;
        if (this.x >= ROCKET_EXPLOSION_X) {
            this.removeFromWorld = true;
            this.game.addEntity(new RocketExplosion(this.game, this.x, this.y))
        }
        super.update();
    }

    draw() {
        this.animation.drawFrame(this.game.clockTick, this.game.ctx, this.x, this.y, ROCKET_SCALE);
        super.draw();
    }
}

class RocketExplosion extends Entity {
    constructor(game, startX, startY) {
        super(game, startX, startY, -300, 0);
        var spritesheet = this.game.assetManager.getAsset('./img/rocketExplosion.png');

        //Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse)
        this.animation = new Animation(spritesheet, 0, 0, 64, 64, 0.02, 15, false, false);

        this.x = this.x - this.animation.frameWidth * ROCKET_EXPLOSION_SCALE / 2;
        this.y = this.y - this.animation.frameHeight * ROCKET_EXPLOSION_SCALE / 2;
    }
    update() {
        super.update();
        if (this.animation.isDone()) {
            this.removeFromWorld = true;
        }
        this.x += this.deltaX * this.game.clockTick;
        this.y += this.deltaY * this.game.clockTick;
    }
    draw() {
        this.animation.drawFrame(this.game.clockTick, this.game.ctx, this.x, this.y, ROCKET_EXPLOSION_SCALE);
        super.draw();
    }
}
