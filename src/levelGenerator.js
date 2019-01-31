/*
TODO: don't do the left and right identifiers...Just calculate it 
while going through the array
/ = left tile
\ = right tile
- = center tile
~ = pit tile
  = no tile
* = end of line //or use newline char??

 /----\~~/----\  /---*
-------~~------  ----*
 */

// lvls are in json format ???
//  let tilesObj = {leftTile: 'AM tile path', centerTile: 'AM tile path' ...ect}
class LevelManager {
    //handles the swapping in and out of levels
}

//map
class Level {
    constructor(game, levelLayout, tilesObj) {
        this.game = game;
        this.levelLayout = levelLayout;
        this.tilesObj = tilesObj;

        this.ctx = game.ctx;
        this.leftTile = tilesObj['leftTile'];
        this.centerTile = tilesObj['centerTile'];
        this.rightTile = tilesObj['rightTile'];
        this.pitTile = tilesObj['lcrUnderFillerTile'];
        this.pitTile = tilesObj['pitTile'];

        this.tilesArray; // put tiles into an array is sorted smallest to largest
    }

    _parseLevel() {
        let positionX = 0;
        let positionY = 0;
        for (let i = 0; i < levelLayout.length; i++) {
            if (levelLayout[i] === '/') { //left tile
                
            } else if (levelLayout[i] === '-') { //center tile
                
            } else if (levelLayout[i] === '\\') { //right tile
                
            } else if (levelLayout[i] === '\\') { //right tile
                
            } else if (levelLayout[i] === '~') { //pit tile
                
            } else if (levelLayout[i] === '\n') { //end of level line
                
            } 
        }
    }
}


//Draw a tile of given size.
class Tile extends Entity {
    constructor(game, image, startX, startY) {
        super(game, image, startX, startY, 0, 0);
        this.tile = image;
        this.ctx = game.ctx;
    }
    update() {

    }
    draw() { //code this with a loop to draw whatever length platform the user wants
        this.ctx.drawImage(this.tile, this.x, this.y); 
    }

}

// 700 / 12 = 58.333333
// 1133 / 58.333333 = 19.4
// below is 40 wide by 10 tall
const levelOne = 
  '                                        \n'
+ '                                        \n'
+ '                                        \n'
+ ' ~~         /--\                        \n'
+ '          ----                          \n'
+ '                                        \n'
+ '                            /---\       \n'
+ '                                        \n'
+ '---------\   /------\~~/----\  /--------\n'
+ '----------   --------~~------  /--------\n';

