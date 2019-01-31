/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/



var PHI = 1.618;

var Z_SCALE = .65;

var Z_WIDTH = 114;
var Z_HEIGHT = 306;
var Z_ARM_SOCKET_X = 33;
var Z_ARM_SOCKET_Y = 146;
var Z_HORIZANTAL_POSITION = 2 - PHI;
var Z_FEET_ABOVE_FRAME = 10;

var Z_WALKING_FRAME_SPEED = .16;
var Z_WALKING_FRAMES = 6;
var Z_STANDING_FRAME_SPEED = .55;
var Z_STANDING_FRAMES = 2;

var Z_SOMERSAULT_WIDTH = 462;
var Z_SOMERSAULT_HEIGHT = 306;
var Z_SOMERSAULT_FRAME_SPEED = .1;
var Z_SOMERSAULT_FRAMES = 10;

var FORCE_JUMP_DELTA_Y = -950;
var JUMP_DELTA_Y = -500;
var GRAVITATIONAL_ACCELERATION = 1000;


class Zerlin extends Entity {

    constructor(game) {
        var foundationX = game.ctx.canvas.width * Z_HORIZANTAL_POSITION;
        var foundationY = game.ctx.canvas.height / 2; // y will always be dependent on the platform height
        super(game, foundationX - (Z_SCALE * Z_ARM_SOCKET_X), /* change this */ foundationY, 0, 0);

        this.assetManager = game.assetManager;
        this.facingRight = true;
        this.ctx = game.ctx;
        this.direction = 0; // -1 = left, 0 = still, 1 = right
        this.somersaulting = false;
        this.falling = true;

        this.hits = 0;

        // placement of Zerlin on canvas
        this.foundationX = foundationX;
        this.foundationY = foundationY; // TODO: y will always be dependent on the platform height / collision / jump

        this.lightsaber = new Lightsaber(game, this);

        this.boundingbox = new BoundingBox(this.x + (12 * Z_SCALE), this.y + (73 * Z_SCALE), (Z_WIDTH - 29) * Z_SCALE, (Z_HEIGHT - 85) * Z_SCALE);
        this.drawBox = true;

        this.temporaryFloorBoundingBox = new BoundingBox(0, 680, 900, 100); // TODO: remove, switch to platforms

        this.createAnimations();
    }

    createAnimations() {
        this.standFaceRightAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin standing.png"), 
                                                   Z_WIDTH, 
                                                   Z_HEIGHT, 
                                                   Z_STANDING_FRAMES * Z_WIDTH, 
                                                   Z_STANDING_FRAME_SPEED, 
                                                   Z_STANDING_FRAMES, 
                                                   true, 
                                                   Z_SCALE);
        this.standFaceLeftAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin standing left.png"), 
                                                   Z_WIDTH, 
                                                   Z_HEIGHT, 
                                                   Z_STANDING_FRAMES * Z_WIDTH, 
                                                   Z_STANDING_FRAME_SPEED, 
                                                   Z_STANDING_FRAMES, 
                                                   true, 
                                                   Z_SCALE);
        this.moveRightFaceRightAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin bobbing walking.png"), 
                                                   Z_WIDTH, 
                                                   Z_HEIGHT, 
                                                   Z_WALKING_FRAMES * Z_WIDTH, 
                                                   Z_WALKING_FRAME_SPEED, 
                                                   Z_WALKING_FRAMES, 
                                                   true, 
                                                   Z_SCALE);
        this.moveRightFaceLeftAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin left backwards bobbing walking.png"),
                                                   Z_WIDTH, 
                                                   Z_HEIGHT, 
                                                   Z_WALKING_FRAMES * Z_WIDTH, 
                                                   Z_WALKING_FRAME_SPEED, 
                                                   Z_WALKING_FRAMES, 
                                                   true, 
                                                   Z_SCALE);
        this.moveLeftFaceRightAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin backwards bobbing walking.png"), 
                                                   Z_WIDTH, 
                                                   Z_HEIGHT, 
                                                   Z_WALKING_FRAMES * Z_WIDTH, 
                                                   Z_WALKING_FRAME_SPEED, 
                                                   Z_WALKING_FRAMES, 
                                                   true, 
                                                   Z_SCALE);
        this.moveLeftFaceLeftAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin left bobbing walking.png"), 
                                                   Z_WIDTH, 
                                                   Z_HEIGHT, 
                                                   Z_WALKING_FRAMES * Z_WIDTH, 
                                                   Z_WALKING_FRAME_SPEED, 
                                                   Z_WALKING_FRAMES, 
                                                   true, 
                                                   Z_SCALE);
        this.somersaultingAnimation = new Animation(this.assetManager.getAsset("../img/Zerlin somersault.png"), 
                                                   Z_SOMERSAULT_WIDTH, 
                                                   Z_SOMERSAULT_HEIGHT, 
                                                   Z_SOMERSAULT_FRAMES * Z_SOMERSAULT_WIDTH, 
                                                   Z_SOMERSAULT_FRAME_SPEED, 
                                                   Z_SOMERSAULT_FRAMES, 
                                                   false, 
                                                   Z_SCALE);
    }

    update() {

        // 1. prepare for update

        // change sprite on any of these conditions
        if (this.game.mouse.x < this.foundationX && this.facingRight) {
            this.faceLeft();
        } 
        else if (this.game.mouse.x > this.foundationX && !this.facingRight) {
            this.faceRight();
        }
        else if (this.game.keys['KeyD'] && this.game.keys['KeyF'] && !this.falling) {
            this.somersaulting = true;
            this.x = this.foundationX - Z_SCALE * (Z_SOMERSAULT_WIDTH / 2);
            this.lightsaber.hidden = true;
        }
        else if (this.game.keys['Space'] && this.game.keys['KeyV'] && !this.falling && !this.somersaulting) {
            this.falling = true;
            this.deltaY = FORCE_JUMP_DELTA_Y;
        }
        else if (this.game.keys['Space'] && !this.falling && !this.somersaulting) {
            this.falling = true;
            this.deltaY = JUMP_DELTA_Y;
        }
        else if (!this.game.keys['KeyD'] && !this.game.keys['KeyA'] && this.direction !== 0) {
            this.direction = 0;
        }
        else if (this.game.keys['KeyD'] && this.game.keys['KeyA']) { // force jump
            // what to do if both pressed? stand still?
        }
        else if (this.game.keys['KeyD'] && !this.game.keys['KeyA'] && this.direction !== 1) {
            this.direction = 1;
        }
        else if (!this.game.keys['KeyD'] && this.game.keys['KeyA'] && this.direction !== -1) {
            this.direction = -1;
        }

        if (this.somersaulting) {
            // check if animation is done (can't call animation.isDone() because it does not have latest clockTick yet)
            if ((this.somersaultingAnimation.elapsedTime  + this.game.clockTick) >= this.somersaultingAnimation.totalTime) {
                this.somersaultingAnimation.elapsedTime = 0;
                this.somersaulting = false;
                
                // reposition Zerlin (x & y)
                if (this.facingRight) {
                    this.faceRight();
                } else {
                    this.faceLeft();
                }
                this.lightsaber.hidden = false;
            }
        }
        else if (this.falling) {
            // check if jump is done
                // this.falling = false;

            // var height = jumpHeight * (-4 * (jumpTime * jumpTime - jumpTime));
            this.lastBottom = this.boundingbox.bottom;
            this.deltaY += GRAVITATIONAL_ACCELERATION * this.game.clockTick;
        }


        // 2. update

        this.x += this.game.clockTick * this.deltaX; // ultimately deltaX should always be 0, stays centered, move everything else
        this.y += this.game.clockTick * this.deltaY;
        if (this.somersaulting) {
            // TODO: new bounding box for somersault, left and right
            this.boundingbox = new BoundingBox(this.boundingbox.x, this.y + (73 * Z_SCALE), this.boundingbox.width, this.boundingbox.height);
        } else {
            this.boundingbox = new BoundingBox(this.boundingbox.x, this.y + (73 * Z_SCALE), this.boundingbox.width, this.boundingbox.height);    
        }
        

        this.handleCollisions();

        this.lightsaber.update();
        // this.lightsaber.handleCollisions();
        
        super.update();
    }

    draw() {
        if (this.somersaulting) {
            this.animation = this.somersaultingAnimation;
        }
        else if (this.facingRight) {
            if (this.direction === -1) {
                this.animation = this.moveLeftFaceRightAnimation;
            } else if (this.direction === 0) {
                this.animation = this.standFaceRightAnimation;
            } else if (this.direction === 1) {
                this.animation = this.moveRightFaceRightAnimation;
            }
        } 
        else { // facing left
            if (this.direction === -1) {
                this.animation = this.moveLeftFaceLeftAnimation;
            } else if (this.direction === 0) {
                this.animation = this.standFaceLeftAnimation;
            } else if (this.direction === 1) {
                this.animation = this.moveRightFaceLeftAnimation;
            }
        }
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        this.lightsaber.draw();

        // super.draw();

        if (this.drawBox) {
            this.ctx.strokeStyle = "red";
            this.ctx.strokeRect(this.x, this.y, Z_WIDTH * Z_SCALE, Z_HEIGHT * Z_SCALE);
            this.ctx.strokeStyle = "black";
            this.ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
            this.ctx.strokeRect(this.temporaryFloorBoundingBox.x, this.temporaryFloorBoundingBox.y, this.temporaryFloorBoundingBox.width, this.temporaryFloorBoundingBox.height);
        }
    }

    handleCollisions() {
        if (this.boundingbox.collide(this.temporaryFloorBoundingBox) && this.lastBottom < this.temporaryFloorBoundingBox.top) {
            console.log("landed");
            this.falling = false;
            this.deltaY = 0;
            this.y = this.temporaryFloorBoundingBox.top - (Z_HEIGHT - Z_FEET_ABOVE_FRAME) * Z_SCALE;
        }
        for (var i = 0; i < this.game.lasers.length; i++) {
            var laser = this.game.lasers[i];
            if ( !laser.isDeflected &&
                laser.x > this.boundingbox.left &&
                laser.x < this.boundingbox.right &&
                laser.y > this.boundingbox.top &&
                laser.y < this.boundingbox.bottom) {
                laser.removeFromWorld = true;
                this.hits++;
                console.log(this.hits);
            }
        }
    }

    // functions for updating the animation and sprite being used

    faceRight() {
        this.facingRight = true;
        if (!this.somersaulting) {
            this.x = this.foundationX - Z_SCALE * Z_ARM_SOCKET_X;
        }
        this.boundingbox = new BoundingBox(this.x + (12 * Z_SCALE), this.y + (73 * Z_SCALE), (Z_WIDTH - 29) * Z_SCALE, (Z_HEIGHT - 85) * Z_SCALE);
        
    }

    faceLeft() {
        this.facingRight = false;
        if (!this.somersaulting) {
            this.x = this.foundationX - Z_SCALE * (Z_WIDTH - Z_ARM_SOCKET_X);
        }
        this.boundingbox = new BoundingBox(this.x + (17 * Z_SCALE), this.y + (73 * Z_SCALE), (Z_WIDTH - 29) * Z_SCALE, (Z_HEIGHT - 85) * Z_SCALE);
    }

    jump() {

    }

    slash() {

    }
}



var LS_UP_IMAGE_WIDTH = 126;
var LS_UP_IMAGE_HEIGHT = 204;
var LS_DOWN_IMAGE_WIDTH = 126;
var LS_DOWN_IMAGE_HEIGHT = 198;

var LS_UP_COLLAR_X = 114;
var LS_UP_COLLAR_Y = 162;
var LS_DOWN_COLLAR_X = 114;
var LS_DOWN_COLLAR_Y = 35;
var LS_UP_TIP_X = 114;
var LS_UP_TIP_Y = 5;
var LS_DOWN_TIP_X = 114;
var LS_DOWN_TIP_Y = 192;

var LS_RIGHT_X_AXIS = 10;
var LS_LEFT_X_AXIS = 10;
var LS_UP_Y_AXIS = 147;
var LS_DOWN_Y_AXIS = 51;


class Lightsaber extends Entity {

    constructor(game, Zerlin) {
        super(game, 
                0, 0, // will be set in faceRightUpSaber()
                0, 0);
        this.assetManager = game.assetManager;
        this.ctx = game.ctx;
        this.angle = 0;
        this.Zerlin = Zerlin;
        this.hidden = false;
        this.faceRightUpSaber();
        this.updateCollisionLine();



        // this.bladeCollar = { x: 500, y: 200};
        // this.bladeTip = { x: 200, y: 500};

        // for debugging
        this.drawCollisionLine = false;

    }

    update() {
        // rotate 
        if (this.game.mouse) {
             // TODO: rotateAndCache if mouse not moved
            this.angle = Math.atan2(this.game.mouse.y - (this.y + (this.armSocketY * Z_SCALE)), 
                                    this.game.mouse.x - (this.x + (this.armSocketX * Z_SCALE)));

            // change sprite on any of these conditions 
            // TODO: consolidate logic here
            if (this.game.mouse.x < this.Zerlin.foundationX && this.facingRight) {
                if (this.saberUp) {
                    this.faceLeftUpSaber();
                } else {
                    this.faceLeftDownSaber();
                }        
            } 
            else if (this.game.mouse.x > this.Zerlin.foundationX && !this.facingRight) {
                if (this.saberUp) {
                    this.faceRightUpSaber();
                } else {
                    this.faceRightDownSaber();
                }
            } 
            else if (this.game.rightClickDown && this.saberUp) {
                if (this.game.mouse.x < this.Zerlin.foundationX) {
                    this.faceLeftDownSaber();
                } else {
                    this.faceRightDownSaber();
                }        
            } else if (!this.game.rightClickDown && !this.saberUp) {
                if (this.game.mouse.x < this.Zerlin.foundationX) {
                    this.faceLeftUpSaber();
                } else {
                    this.faceRightUpSaber();
                }
            }

        }

        this.x = this.Zerlin.foundationX - (this.armSocketX * Z_SCALE), 
        this.y = this.Zerlin.y + (Z_ARM_SOCKET_Y * Z_SCALE) - (this.armSocketY * Z_SCALE);
        this.updateCollisionLine();

        super.update();
    }

    draw() {
        if (!this.hidden) {
            this.ctx.save();
            this.ctx.translate(this.x + (this.armSocketX * Z_SCALE), this.y + (this.armSocketY * Z_SCALE));
            this.ctx.rotate(this.angle);
            this.ctx.drawImage(this.image,
                               0,
                               0,
                               this.width,
                               this.height,
                               -(this.armSocketX * Z_SCALE),
                               -(this.armSocketY * Z_SCALE),
                               Z_SCALE * this.width,
                               Z_SCALE * this.height);
            this.ctx.restore();
        }
        if (this.drawCollisionLine) {
            this.ctx.save();
            this.ctx.strokeStyle = "black";
            this.ctx.beginPath();
            this.ctx.moveTo(this.bladeCollar.x, this.bladeCollar.y);
            this.ctx.lineTo(this.bladeTip.x, this.bladeTip.y);
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.restore();
        }
        super.draw();
    }

    saberSlope() {
        return (this.bladeCollar.y - this.bladeTip.y) / (this.bladeCollar.x - this.bladeTip.x);
    }

    getSaberAngle() {
        // return this.angle + Math.PI / 2;
        return Math.atan2(this.bladeCollar.y - this.bladeTip.y, this.bladeCollar.x - this.bladeTip.x);
    }

    updateCollisionLine() {
        var cosine = Math.cos(this.angle);
        var sine = Math.sin(this.angle);

        var collarXrotated = this.collarXfromSocket * cosine - this.collarYfromSocket * sine;
        var collarYrotated = this.collarYfromSocket * cosine + this.collarXfromSocket * sine;

        var tipXrotated = this.tipXfromSocket * cosine - this.tipYfromSocket * sine;
        var tipYrotated = this.tipYfromSocket * cosine + this.tipXfromSocket * sine;

        this.prevBladeCollar = this.bladeCollar;
        this.prevBladeTip = this.bladeTip;
        this.bladeCollar = { x: (collarXrotated + this.armSocketX) * Z_SCALE + this.x, y: (collarYrotated + this.armSocketY) * Z_SCALE + this.y };
        this.bladeTip = { x: (tipXrotated + this.armSocketX) * Z_SCALE + this.x, y: (tipYrotated + this.armSocketY) * Z_SCALE + this.y };
    }

    faceRightUpSaber() {
        this.image = this.assetManager.getAsset("../img/Lightsaber with point of rotation drawn.png");
        this.width = LS_UP_IMAGE_WIDTH;
        this.height = LS_UP_IMAGE_HEIGHT;
        this.armSocketX = LS_RIGHT_X_AXIS;
        this.armSocketY = LS_UP_Y_AXIS;

        this.collarXfromSocket = LS_UP_COLLAR_X - LS_RIGHT_X_AXIS;
        this.collarYfromSocket = LS_UP_COLLAR_Y - LS_UP_Y_AXIS;
        this.tipXfromSocket = LS_UP_TIP_X - LS_RIGHT_X_AXIS;
        this.tipYfromSocket = LS_UP_TIP_Y - LS_UP_Y_AXIS;

        this.facingRight = true;
        this.saberUp = true;
    }

    faceLeftUpSaber() {
        this.image = this.assetManager.getAsset("../img/Lightsaber with point of rotation drawn left.png");
        this.width = LS_UP_IMAGE_WIDTH;
        this.height = LS_UP_IMAGE_HEIGHT;
        this.armSocketX = LS_LEFT_X_AXIS;
        this.armSocketY = this.height - LS_UP_Y_AXIS;

        this.collarXfromSocket = LS_UP_COLLAR_X - LS_LEFT_X_AXIS;
        this.collarYfromSocket = LS_UP_Y_AXIS - LS_UP_COLLAR_Y;
        this.tipXfromSocket = LS_UP_TIP_X - LS_RIGHT_X_AXIS;
        this.tipYfromSocket = LS_UP_Y_AXIS - LS_UP_TIP_Y;

        this.facingRight = false;
        this.saberUp = true;
    }

    faceRightDownSaber() {
        this.image = this.assetManager.getAsset("../img/lightsaber upside down.png");
        this.width = LS_DOWN_IMAGE_WIDTH;
        this.height = LS_DOWN_IMAGE_HEIGHT;
        this.armSocketX = LS_RIGHT_X_AXIS;
        this.armSocketY = LS_DOWN_Y_AXIS;

        this.collarXfromSocket = LS_DOWN_COLLAR_X - LS_RIGHT_X_AXIS;
        this.collarYfromSocket = LS_DOWN_COLLAR_Y - LS_DOWN_Y_AXIS;
        this.tipXfromSocket = LS_DOWN_TIP_X - LS_RIGHT_X_AXIS;
        this.tipYfromSocket = LS_DOWN_TIP_Y - LS_DOWN_Y_AXIS;

        this.facingRight = true;
        this.saberUp = false;
    }

    faceLeftDownSaber() {
        this.image = this.assetManager.getAsset("../img/lightsaber upside down left.png");
        this.width = LS_DOWN_IMAGE_WIDTH;
        this.height = LS_DOWN_IMAGE_HEIGHT;
        this.armSocketX = LS_LEFT_X_AXIS;
        this.armSocketY = this.height - LS_DOWN_Y_AXIS;

        this.collarXfromSocket = LS_DOWN_COLLAR_X - LS_LEFT_X_AXIS;
        this.collarYfromSocket = LS_DOWN_Y_AXIS - LS_DOWN_COLLAR_Y;
        this.tipXfromSocket = LS_DOWN_TIP_X - LS_LEFT_X_AXIS;
        this.tipYfromSocket = LS_DOWN_Y_AXIS - LS_DOWN_TIP_Y;

        this.facingRight = false;
        this.saberUp = false;
    }
}


