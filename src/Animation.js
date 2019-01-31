/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/
/*
 * Animate spriteSheets.
 */
class Animation {
    constructor(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
    }


    drawFrame(tick, ctx, x, y, scaleBy) {
        var scaleBy = scaleBy || 1;
        this.elapsedTime += tick;
        if (this.loop) {
            if (this.isDone()) {
                this.elapsedTime = 0;
            }
        } else if (this.isDone()) {
            return;
        }
        var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
        var vindex = 0;
        if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
            index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
            vindex++;
        }
        while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
            index -= Math.floor(this.spriteSheet.width / this.frameWidth);
            vindex++;
        }

        var locX = x;
        var locY = y;
        var offset = vindex === 0 ? this.startX : 0;
        ctx.drawImage(this.spriteSheet,
                    index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                    this.frameWidth, this.frameHeight,
                    locX, locY,
                    this.frameWidth * scaleBy,
                    this.frameHeight * scaleBy);
    }

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    }

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    }
}

//add a method to change out the background images we are looping through
/**
 * Manage and animate backgrounds.
 */
//add all of the parallax images to be drawn to this class
class ParallaxBackgroundManager extends Entity { 
    constructor(game) {
        super(game, 0, 0, 0, 0);
        this.scrollDirection = 1; // change to 0 by default
        this.parralaxBackgroundsArray = [];
    }
    addBackgroundImage(background) {
        this.parralaxBackgroundsArray.push(background);
    }
    update() {
        // console.log(`right: ${this.game.moveRight} left: ${this.game.moveRight}`);
        // if (this.game.keys['KeyD'] && !this.game.keys['KeyA'])  {
        //     this.scrollDirection = 1;
        // } else if (!this.game.keys['KeyD'] && this.game.keys['KeyA']) {
        //     this.scrollDirection = -1;
        // } else if (!this.game.keys['KeyD'] && !this.game.keys['KeyA']) {
        //     this.scrollDirection = 0;
        // }  
    }
    draw() {
        // console.log('direction: ' + this.scrollDirection);
        this.parralaxBackgroundsArray.forEach(element => {
            element.scrollDirection = this.scrollDirection;
            element.update();
            element.draw();
        });
    }
}

//add more customizable background scroll patterns ???
/*
 * An individual image to be drawn with its follower.
 */
class ParallaxBackground extends Entity {  
    constructor(game, backgroundImage, speed, startX, startY) {
        super(game, startX, startY, 0, 0);
        this.backgroundImage = backgroundImage;
        this.speed = speed;
        this.startX = startX;
        this.imageWidth = this.backgroundImage.width;

        this.ctx = game.ctx;
        //setup initially for background to scroll to the left
        this.scrollDirection = -1;
        this.image1X = this.startX;
        this.image2X = this.startX + this.imageWidth;
    }
    update() { 
        if (this.scrollDirection === -1) { // left scroll
            if(this.image1X > this.imageWidth + this.startX) {
                this.image1X = this.image2X - this.imageWidth;
            } else if(this.image2X > this.imageWidth + this.startX) {
                this.image2X = this.image1X - this.imageWidth;
            }
        } else if (this.scrollDirection === 1) { // right scroll
            if (this.image1X < this.startX - this.imageWidth) { 
                this.image1X = this.image2X + this.imageWidth; 
            } else if (this.image2X < this.startX - this.imageWidth) {
                this.image2X = this.image1X + this.imageWidth; 
            }
        }
        //move images left or right
        this.image1X -= this.speed * this.scrollDirection * this.game.clockTick; 
        this.image2X -= this.speed * this.scrollDirection * this.game.clockTick; 
    }
    draw() {
        this.ctx.drawImage(this.backgroundImage, this.image1X, this.y); 
        this.ctx.drawImage(this.backgroundImage, this.image2X, this.y);
    }
}




