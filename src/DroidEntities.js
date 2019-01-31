/*
DroidEntites
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/

//Droid Constants
var DROID_ZERLIN_MOVEMENT = 2.5; //amount a droid will move when left or right key is pressed
//can potentially add in another zerlin move constant for rolling

//basic droid constants
var BASIC_DROID_SHOOT_INTERVAL = .1;
var BASIC_DROID_X_MOVEMENT_SPEED = 150;
var BASIC_DROID_Y_MOVEMENT_SPEED = 100;
var BASIC_DROID_X_VELOCITY = 0.35;
var BASIC_DROID_Y_VELOCITY = 1;
var BASIC_DROID_ORBITAL_X_OFFSET = 0;
var BASIC_DROID_ORBITAL_Y_OFFSET = -200;
var BASIC_DROID_ZERLIN_MOVE_RIGHT_SPEED = 1;

//random constants ("interesting")
var BASIC_DROID_MAX_RANDOM_TARGET_WIDTH = 40;
var BASIC_DROID_MAX_RANDOM_TARGET_HEIGHT = 40;

//Laser constants
var BASIC_DROID_LASER_SPEED = 400; 
var BASIC_DROID_LASER_LENGTH = 10;
var BASIC_DROID_LASER_WIDTH = 10;
var LASER_ZERLIN_MOVEMENT = 2.5;

var EXPLOSION_SCALE = 2;

/**
 * This class will serve as the parent for all droid entities
 * and will contain methods and fields that all droids are required to have
 * ***! Movement and Shooting Pattern will be implemented by child droids !***
 */
class AbstractDroid extends Entity {
    constructor(game, startX, startY, deltaX, deltaY) {
        super(game, startX, startY, deltaX, deltaY);
        // if the animations are null, then will just not draw the animations.
        this.idleAnimation = null; //need to add the animation after instantiation.
        this.explosionAnimation = null;
        this.shootAnimation = null;
        this.animation = null;

        //collision radius can be changed after instantiation
        this.radius = 35;
        this.boundCircle = {x: this.x, y: this.y, radius: this.radius};

    }
    /**
     * this method will change the state of each droid such as firing 
     * and moving and will be implemented more in each childDroid
     */
    update() {
        // All droids will move when left or right is pressed but not both at the same time
        if (this.game.keys['KeyD'] && this.game.keys['KeyA']);
        else if (this.game.keys['KeyD']) {
            this.x = this.x - DROID_ZERLIN_MOVEMENT;
        } 
        else if (this.game.keys['KeyA']) {
            this.x = this.x + DROID_ZERLIN_MOVEMENT;
        }

        //check collision with other droids.
        // for (var i = 0; i < this.game.entities.length; i++) {
        //     var ent = this.game.droids[i];
        //     if (this != ent && this.collideWithDroid(ent)) {
        //         //On droid collision, swap velocities
        //         var tempX = this.deltaX;
        //         var tempY = this.deltaY;
        //         this.deltaX = ent.deltaX;
        //         this.deltaY = ent.deltaY;
        //         ent.deltaX = tempX;
        //         ent.deltaY = tempY;
        //         //may need to shunt droids a little.
        //     };
        // }

        super.update();
    }
    draw() {
        //debug: draw the bounding circle around the droid
        if (this.game.showOutlines) {
            this.game.ctx.beginPath();
            this.game.ctx.strokeStyle = "green";
            this.game.ctx.arc(this.boundCircle.x, 
                this.boundCircle.y, this.boundCircle.radius, 0, Math.PI * 2, false);
            this.game.ctx.stroke();
            this.game.ctx.closePath();
            this.game.ctx.closePath();
            this.game.ctx.restore(); 
        }
        //child droid can choose which animation is the current one 
        // check that animation is not null before drawing.
        if (this.animation) {
            this.animation.drawFrame(this.game.clockTick, this.game.ctx, this.x, this.y);
        }
        super.draw();
    }
    /**
     * this method will remove the droid from the world and add an explosion to the entity list.
     */
    explode() {
        this.removeFromWorld = true;
        //TODO: play droid explosion sound
        this.game.addEntity(new DroidExplosion(this.game, this.x + (this.animation.scale * this.animation.frameWidth / 2), this.y + (this.animation.scale * this.animation.frameHeight / 2)));
        let sound = new Howl({
            src: ['sound/BoomBoom.mp3'],
            loop: false,
            volume: .9,
            onend: function() {
              console.log('BOOOMMM!!!');
            }
        });
        sound.play();
        console.log("droid exploded");
        /**
        * ***! TODO: DELETE AFTER PROTOTYPE: THIS CODE RESPAWNS DROIDS
        * BUG: sometimes multiple lasers will hit the droid bounding circle before the next 
        * update is called causeing mutliple explosions to be called on the same droid.
        */
        this.game.addDroid(new BasicDroid(this.game, this.game.assetManager.getAsset("../img/droid-j-row.png"),
        this.game.surfaceWidth * Math.random(), -75));
    }
    collideWithDroid(ent) {
        return ent !== null && collideCircleWithCircle(this.boundCircle.x, this.boundCircle.y, this.boundCircle.radius,
            ent.boundCircle.x, ent.boundCircle.y, ent.boundCircle.radius);
    }
    
}



/*
* Basic droid that will shoot 1 laser every interval
*/
class BasicDroid extends AbstractDroid {
    constructor(game, spritesheet, startX, startY) {
        //super(gameEngine, x, y, deltaX, deltaY)
        //super(game, startX, startY, BASIC_DROID_X_MOVEMENT_SPEED, 0);
        super(game, startX, startY, 0, 0); //debug

        /* animation fields */
        //Animation(spritesheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
        this.idleAnimation = new Animation(spritesheet, 100, 100, 1400, 0.1, 14, true, .5);
        this.animation = this.idleAnimation;

        /* bounding circle fields */
        this.radius = (this.animation.frameWidth / 2) * this.animation.scale;
        this.boundCircle = {radius: this.radius, 
            x: this.x + (this.animation.frameWidth * this.animation.scale) / 2,
            y: this.y + (this.animation.frameHeight * this.animation.scale) / 2};

        /* shooting fields */
        this.fire = false;
        this.secondsBeforeFire = BASIC_DROID_SHOOT_INTERVAL;

        /* movement fields */
        var targetX = (this.game.surfaceWidth / 2) + BASIC_DROID_ORBITAL_X_OFFSET;
        var targetY = (this.game.surfaceHeight / 2) + BASIC_DROID_ORBITAL_Y_OFFSET;
        this.targetOrbitalPoint = {x: targetX, y: targetY};
        
    }
    /* 
    * every update, the basic droid will move around zerlin entity about 50 to 100 pixels above him.
    * The droid will shoot every interval at the main character (as of now, at the mouse)
    * The droid will set removeFromWorld to true when it collides with lightsaber
    */
    update() {
        //update coordinates so the droid will orbit the center of the canvas

        /* droid movement */
        this.calcMovement(this.targetOrbitalPoint); //un comment after debug

        /* bounding circle movement */
        this.boundCircle.x = this.x + (this.animation.frameWidth * this.animation.scale) / 2;
        this.boundCircle.y = this.y + (this.animation.frameHeight * this.animation.scale) / 2;

        /* droid shooting */
        this.secondsBeforeFire -= this.game.clockTick;
        //will shoot at every interval
        if (this.secondsBeforeFire <= 0 && (!this.fire)) {
            this.secondsBeforeFire = BASIC_DROID_SHOOT_INTERVAL;
            this.fire = true;
            //shoot at specific target
            //this.shoot(this.game.Zerlin.x, this.game.Zerlin.y);

            //shoot randomly in target direction
            this.shootRandom(this.game.Zerlin.x + 50, 
                this.game.Zerlin.y + 50, 
                BASIC_DROID_MAX_RANDOM_TARGET_WIDTH,
                BASIC_DROID_MAX_RANDOM_TARGET_HEIGHT);
        }
        
        
        super.update();
    }
    draw() {
        super.draw();
        
        
    }
    shoot(targetX, targetY) {
        var droidLaser = new DroidLaser(this.game, this.x + 20, this.y + 20, BASIC_DROID_LASER_SPEED, 
            targetX, targetY, BASIC_DROID_LASER_LENGTH, BASIC_DROID_LASER_WIDTH);
        this.game.addLaser(droidLaser);
        //TODO - play shooting sound
        //console.log("shot laser at X: " + targetX + " Y: " + targetY);
        //set after droid is done firing
        this.fire = false;
    }
    /**
     * Method that will shoot a laser randomly in an area from target point
     * to target point + max argument
     */
    shootRandom(targetX, targetY, maxWidth, maxHeight) {
        var randTargetX = targetX + (maxWidth * Math.random());
        var randTargetY = targetY + ((-maxHeight) * Math.random());
        this.shoot(randTargetX, randTargetY);
    }
    /*
     * calculate movement so that it will try to fly around the location of the 
     * target.
     */
    calcMovement(target) {
        //if the droid is to the left of target point, then increase the deltaX
        //by the x velocity
        if (this.x < target.x) {
            if (this.deltaX < BASIC_DROID_X_MOVEMENT_SPEED)
                this.deltaX += BASIC_DROID_X_VELOCITY;
            
        }
        
        //if the droid is to the right of target point, then decrease the deltaX
        //by the x velocity
        else if (this.x > target.x) {
            if (this.deltaX >= (-BASIC_DROID_X_MOVEMENT_SPEED))
                this.deltaX -= BASIC_DROID_X_VELOCITY;
        }

        //if droid is above the target point, then increase deltaY(down)
        if (this.y < target.y) {
            if (this.deltaY <= BASIC_DROID_Y_MOVEMENT_SPEED)
                this.deltaY += BASIC_DROID_Y_VELOCITY;
        }
        //if the droid is below the target point, then decrease the deltaY(up)
        else if (this.y >= target.y) {
            if (this.deltaY >= (-BASIC_DROID_Y_MOVEMENT_SPEED)) 
                this.deltaY -= BASIC_DROID_Y_VELOCITY;
        }      

        //after calculating change in x and y then increment x and y by delta x and delta y
        // this.x += this.game.clockTick * (Math.random() * this.deltaX);
        // this.y += this.game.clockTick * (Math.random() * this.deltaY);
        this.x += this.game.clockTick * this.deltaX;
        this.y += this.game.clockTick * this.deltaY;
        
        
    }
}



class DroidLaser extends Entity {
    constructor(game, startX, startY, speed, targetX, targetY, length, width) {
        super(game, startX, startY, 0, 0);
        //console.log("created DroidLaser Entity");

        //Droid Laser Fields
        this.color = "green";
        this.deflectedColer = "blue";
        this.secondaryColor = "white";
        this.isDeflected = false; //set to false TODO

        var distFromStartToTarget = distance({x: targetX, y: targetY}, {x: this.x, y: this.y});
        var unitVectorDeltaX = ((targetX - startX) / distFromStartToTarget);
        var unitVectorDeltaY = ((targetY - startY) / distFromStartToTarget);

        this.deltaX = unitVectorDeltaX * speed;
        this.deltaY = unitVectorDeltaY * speed;
        this.slope = this.deltaY / this.deltaX;

        this.speed = speed;
        this.length = length;
        this.width = width;

        this.isDeflected = false;

        // move laser so tail is touching the starting point upon instantiation, instead of the head
        this.x = this.x + unitVectorDeltaX * this.length;
        this.y = this.y + unitVectorDeltaY * this.length;
        this.tailX = startX;
        this.tailY = startY;
        this.angle = this.findAngle(this.x, this.y, this.tailX, this.tailY);
    }
    update() {
        // keep track of previous position for collision detection
        this.prevX = this.x;
        this.prevY = this.y;

        this.x += this.deltaX * this.game.clockTick;
        this.y += this.deltaY * this.game.clockTick;
        this.tailX += this.deltaX * this.game.clockTick;
        this.tailY += this.deltaY * this.game.clockTick;

        if (this.isCollidedWithSaber()) {
            this.deflect();
        }

        if (this.isOutsideScreen()) {
            this.removeFromWorld = true;
        }
        //check zerlin movement and move laser accordingly
        /* when a or d is pressed then move the lasers left or right
        * dont move when both a and d are pressed at the same time
        */
        if (this.game.keys['KeyD'] && this.game.keys['KeyA']);
        else if (this.game.keys['KeyD']) {
            this.x = this.x - LASER_ZERLIN_MOVEMENT;
            this.tailX = this.tailX - LASER_ZERLIN_MOVEMENT;
        } 
        else if (this.game.keys['KeyA']) {
            this.x = this.x + LASER_ZERLIN_MOVEMENT;
            this.tailX = this.tailX + LASER_ZERLIN_MOVEMENT;
        }

        //check collision with droid
        for (var i = 0; i < this.game.droids.length; i++) {
            var ent = this.game.droids[i];
            if (this != ent && this.isDeflected && this.collideWithDroid(ent)) {
                console.log("Collision with droid");
                this.color = "red";
                //explode the droid.
                ent.explode();
                //increment points
            }
        }
    
        super.update();
    }
    draw() {
        var ctx = this.game.ctx;

        //debug laser
        // ctx.save();
        // ctx.lineWidth = 10;
        // ctx.strokeStyle = this.color;
        // ctx.lineCap = "round";
        // ctx.beginPath();
        // ctx.moveTo(this.x, this.y);
        // ctx.lineTo(this.tailX, this.tailY);
        // ctx.stroke();
        // ctx.closePath();
        // ctx.restore();
        //end debug code

        ctx.save();
        //Outer Layer of laser
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.isDeflected ? this.deflectedColer : this.color;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.tailX, this.tailY);
        ctx.stroke();

        //inner layer of laser.
        ctx.lineWidth = this.width / 2;
        ctx.strokeStyle = this.secondaryColor;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.tailX, this.tailY);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        super.draw()
    }
    isCollidedWithSaber() {
        var lightsaber = this.game.Zerlin.lightsaber;
        if (lightsaber.hidden) {
            return false;
        }
        // decrease miss percentage by also checking previous blade
        return this.isCollidedWithLine(lightsaber.bladeCollar, lightsaber.bladeTip) ||
                this.isCollidedWithLine(lightsaber.prevBladeCollar, lightsaber.prevBladeTip);
    }
    isCollidedWithLine(p1, p2) {
        // TODO: possibly change segment intersection using clockwise check (more elegant)

        // laser's point-slope equation
        var m1 = this.slope;
        var b1 = this.y - m1 * this.x;

        // other's point-slope equation
        var m2 = this.calcSlope(p1, p2);
        var b2 = p2.y - m2 * p2.x;

        var parallel = m1 === m2;
        if (!parallel) {
            var intersection = {};

            // set point slope equations of each equal to eachother
            // 1. mx + b = nx + c 
            // 2. (m - n)x = c - b
            // 3. x = (c - b) / (m - n)
            intersection.x = (b2 - b1) / (m1 - m2);

            // plug in x to one equation to find y
            intersection.y = m1 * intersection.x + b1;
            return this.isPointOnSegment(intersection, {p1: this, p2: {x: this.prevX, y: this.prevY}}) 
                    && this.isPointOnSegment(intersection, {p1: p1, p2: p2});

        } else { // can't collide if parallel.
            return false;
        }
    }
    calcSlope(p1, p2) {
        return (p1.y - p2.y) / (p1.x - p2.x);
    }
    isPointOnSegment(pt, segment) {
        return (pt.x >= Math.min(segment.p1.x, segment.p2.x))
            && (pt.x <= Math.max(segment.p1.x, segment.p2.x))
            && (pt.y >= Math.min(segment.p1.y, segment.p2.y))
            && (pt.y <= Math.max(segment.p1.y, segment.p2.y));
    }
    deflect() {
        this.isDeflected = true;

        var saberAngle = this.game.Zerlin.lightsaber.getSaberAngle();
        var laserAngle = Math.atan2(this.y - this.prevY, this.x - this.prevX);
        var newLaserAngle = 2 * saberAngle - laserAngle;
        var unitVectorDeltaX = Math.cos(newLaserAngle);
        var unitVectorDeltaY = Math.sin(newLaserAngle);
        this.deltaX = unitVectorDeltaX * this.speed;
        this.deltaY = unitVectorDeltaY * this.speed;
        this.slope = this.deltaY / this.deltaX;

        // move laser so tail is touching the deflection point, instead of the head
        this.tailX = this.x; // TODO: change to deflection point
        this.tailY = this.y;
        this.x = this.x + unitVectorDeltaX * this.length;
        this.y = this.y + unitVectorDeltaY * this.length;
        this.angle = this.findAngle(this.x, this.y, this.tailX, this.tailY);
    }
    isOutsideScreen() {
        return this.tailX < 0 ||
                this.tailX > this.game.ctx.canvas.width ||
                this.tailY < 0 ||
                this.tailY > this.game.ctx.canvas.height;
    }

    /**
     * This method will return a boolean if there is a collision between the laser segment and
     * the droid.
     * @param {AbstractDroid} otherDroid the droid to check collision with
     */
    collideWithDroid(otherDroid) {
        return collideLineWithCircle(this.x, this.y, this.tailX, this.tailY, otherDroid.boundCircle.x,
            otherDroid.boundCircle.y, otherDroid.boundCircle.radius);
        
    }
    /**
     * this method will return the angle of a line in radians 
     */
    findAngle(x1, y1, x2, y2) {
        var dy = y2 - y1;
        var dx = x2 - x1;
        var theta = Math.atan2(dy, dx); //range (-PI to PI)
        theta *= 180 / Math.PI; //rads to degress, range(-180 to 180)
        if (theta < 0) 
            theta = 360 + theta; //range(0 to 360)
        return theta;
    }

}

/**
 * this class will just play the droid explosion animation
 * and when the animation is done, this entity will be removed from world
 * TODO: Make the sprite sheet animation able to be passed in for ifferent animations.
 * although if sprite sheet is null then use the static animation.
 */
class DroidExplosion extends Entity {
    constructor(game, x, y) {
        super(game, x, y, 0, 0);
        
        var spritesheet = this.game.assetManager.getAsset("../img/Explosion.png");
        //Animation(spritesheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
        this.animation = new Animation(spritesheet, 64, 64, 256, 0.2, 15, false, 1.7);

        this.x = x - this.animation.frameWidth * EXPLOSION_SCALE / 2;
        this.y = y - this.animation.frameHeight * EXPLOSION_SCALE / 2;
    }
    update() {
        super.update();
        if (this.animation.isDone()) {
            this.removeFromWorld = true;
        }
    }
    draw() {
        this.animation.drawFrame(this.game.clockTick, this.game.ctx, this.x, this.y);
        super.draw(this.game.ctx);
    }
}


