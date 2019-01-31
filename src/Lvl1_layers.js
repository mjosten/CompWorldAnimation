/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/
class Layer1 extends Entity {
    constructor(game, image) {
        super(game, 0, 0, -20, 0);
        // animation not needed for background layers
        this.image = image;
        this.ctx = game.ctx;
    }
    update() {
        this.x += this.game.clockTick * this.deltaX;
        this.y += this.game.clockTick * this.deltaY; // ultimately deltaY should always be 0 (does not move vertically)
        // if (this.x > 800) this.x = -230; // add logic here to prevent scrolling off edge of map ?
    }
    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, 2800, 700);
    }
}




