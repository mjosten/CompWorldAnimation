/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/

var PHI = 1.618;

/**
 * function that will calculate the distance between point a and point b.
 * both arguments need to have x and y prototype or field
 */
var distance = function(a, b) {
    return Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2));
}

/* START OF COLLISION FUNCTIONS */

/**
 * This method will return a boolean if the the circles collide.
 * @param {number} cx1 circle 1 x cord
 * @param {number} cy1 ''
 * @param {number} cr1 circle 1 radius
 * @param {number} cx2 circle 2 x cord
 * @param {number} cy2 ''
 * @param {number} cr2 circle 2 radius
 */
var collideCircleWithCircle = function(cx1, cy1, cr1, cx2, cy2, cr2) {
    result = false;
    //get distance between circles
    var dist = distance({x: cx1, y: cy1}, {x: cx2, y: cy2});

    //compare distance with the sum of the radii
    if (dist <= cr1 + cr2) {
        result = true;
    }
    return result;
}

/**
 * Function that will check the if the line segment has any point along
 * the line segment inside the radius of the circle.
 * @param {number} x1 is the x cord of end point of line
 * @param {number} y1 ''
 * @param {number} x2 is the x cord of another end point of line
 * @param {number} y2 ''
 * @param {number} cx circle x locations
 * @param {number} cy ''
 * @param {number} r  radius of circle
 */
var collideLineWithCircle = function(x1, y1, x2, y2, cx, cy, r) {
    //Check if either end point is in the circle, if so, return right away
    inside1 = collidePointWithCircle(x1, y1, cx, cy, r);
    inside2 = collidePointWithCircle(x2, y2, cx, cy, r);
    if (inside1 || inside2) return true;

    //get length of the line
    var length = distance({x: x1, y: y1}, {x: x2, y: y2});

    //get dot product of line and circle
    var dot = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / Math.pow(length, 2);

    //find closest point on line to the circle
    var closestX = x1 + (dot * (x2 - x1));
    var closestY = y1 + (dot * (y2 - y1));

    //check if the point is on the line segment
    var onSegment = collidePointWithLine(x1, y1, x2, y2, closestX, closestY);
    if (!onSegment) return false;

    //get distance to the closest point from circle
    var dist = distance({x: closestX, y: closestY}, {x: cx, y: cy});

    if (dist <= r) {
        return true;
    }
    return false;

}

/**
 * This function will check to see if a point is on a line segment
 * @param {number} x1 is the start x cord of the line segment
 * @param {number} y1 ''
 * @param {number} x2 is the end x cord of the line segment
 * @param {number} y2 ''
 * @param {number} px is the point x cord to compare with the line segment
 * @param {number} py ''
 */
var collidePointWithLine = function(x1, y1, x2, y2, px, py) {
    //get distance between endpoints and point
    var distance1 = distance({x: x1, y: y1}, {x: px, y: py});
    var distance2 = distance({x: x2, y: y2}, {x: px, y: py});
    //get distance of line
    var lineDist = distance({x: x1, y: y1}, {x: x2, y: y2});

    //because of accuracy of floats, define a buffer of collision
    var buffer = 0.1 //higher # = less accurate

    //if the 2 distances are equal to the line length, then the point is on the line
    //use buffer to give a range of collision
    if (distance1 + distance2 >= lineDist - buffer && distance1 + distance2 <= lineDist + buffer) {
        return true;
    }
    return false;
}

/**
 * This function will check if the point is inside the radius of the circle
 * @param {number} px is the x value of a point
 * @param {number} py is the y value of a point
 * @param {number} cx is the x value of the circle origin
 * @param {number} cy ''
 * @param {number} r is the radius of the circle
 */
var collidePointWithCircle = function(px, py, cx, cy, r) {
    var result = false;
    //get distance between point and circle with pythagorean theroem
    var dist = distance({x: px, y: py}, {x: cx, y: cy});
    //if distance is less than r, than there is a collision
    if (dist <= r) {
        result = true;
    }
    return result;

}

/**
 * This function will calculate if there is a collision on the line segment
 * and will also give the point of intersection.
 * @param {number} x1 Line 1 Endpoint 1 x cord
 * @param {number} y1 ''
 * @param {number} x2 Line 1 Endpoint 2 x cord
 * @param {number} y2 ''
 * @param {number} x3 Line 2 Endpoint 1 x cord
 * @param {number} y3 ''
 * @param {number} x4 Line 2 Endpoint 2 x cord
 * @param {number} y4 ''
 * @return object {collides: boolean, x: intersectionX, y: intersectionY}
 */
var collideLineWithLine = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    var result = {collides: false, x: 0, y: 0};
    //calculate the distance to the intersection point
    var uA = ((x4  -x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    var uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    // if uA and uB is between 0-1, then the lines collide.
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        //intersection points
        var intX = x1 + (uA * (x2 - x1));
        var intY = y1 + (uA * (y2 - y1));
        result.collides = true;
        result.x = intX;
        result.y = intY;
    }
    return result;

}

/**
 * This function will return a boolean if the line segment collides with 
 * the rectangle
 * @param {number} x1 is an endpoint 1x cord
 * @param {number} y1 ''
 * @param {number} x2 is endpoint 2 line segment x cord
 * @param {number} y2 ''
 * @param {number} rx rectangle x cordinate (top left)
 * @param {number} ry rectangle y cordinate (top left)
 * @param {number} rw rectangle width
 * @param {number} rh rectangle height
 */
var collideLineWithRectangle = function(x1, y1, x2, y2, rx, ry, rw, rh) {
    var result = false;
    //check collision of line segment with each side of the rectangle
    var left = collideLineWithLine(x1, y1, x2, y2, rx, ry, rx, ry + rh);
    var right = collideLineWithLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
    var top = collideLineWithLine(x1, y1, x2, y2, rx, ry, rx + rw, ry);
    var bottom = collideLineWithLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh);

    if (left.collides || right.collides || top.collides || bottom.collides) {
        result = true;
    }
    //can return the object with intersection point if need to.
    return result;
}

/**
 * 
 * @param {number} cx is the center of circle x cord
 * @param {number} cy ''
 * @param {number} cr is the circle radius
 * @param {number} rx is the rectangle x cord
 * @param {number} ry is the top left rectangle y cord
 * @param {number} rw is the width of the rectangle
 * @param {number} rh is the height of the rectangle
 */
var collideCircleWithRectangle = function(cx, cy, cr, rx, ry, rw, rh) {
    var result = false;
    //temp variables to set edges for testing
    var testX = cx;
    var testY = cy;

    //calculate which edge is the closest.
    if (cx < rx) testX = rx; //test left edge
    else if (cx > rx + rw) testX = rx + rw; //test right edge
    if (cy < ry) testY = ry; // test top edge
    else if (cy > ry + rh) testY = ry + rh; //test bottom edge

    //get distance from closest edge
    var dist = distance({x: cx, y: cy}, {x: testX, y: testY});

    //if distance is less than circle radius then there is a collision.
    if (dist <= cr) {
        result = true;
    }
    return result;
}

/* END OF COLLISION FUNCTIONS */



window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

class GameEngine {
    constructor(assetManager) {
        this.assetManager = assetManager;
        this.showOutlines = true; //debug bit
        this.entities = [];
        this.parallaxManager = null;
        this.lasers = [];
        this.droids = [];
        this.tiles = [];
        this.ctx = null;
        this.surfaceWidth = null;
        this.surfaceHeight = null;
        this.moveLeft = null;
        this.moveRight = null;
        this.mouse = {x: 100, y: 100};
        this.click = null;
        this.Zerlin = null;
        this.keys = {};

    }
    init(ctx) {
        this.ctx = ctx;
        this.surfaceWidth = this.ctx.canvas.width;
        this.surfaceHeight = this.ctx.canvas.height;
        this.timer = new Timer();
        this.Zerlin = new Zerlin(this);
        this.startInput();
        console.log('game initialized');
    }
    start() {
        console.log("starting game");
        var that = this;
        (function gameLoop() {
            that.loop();
            requestAnimationFrame(gameLoop);
        })();
    }
    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
        // this.moveLeft = null;
        // this.moveRight = null;
    }
    update() {
        this.parallaxManager.update();
        this.Zerlin.update();
        
        for (var i = this.droids.length -1; i >= 0; i--) {
            this.droids[i].update();
            if (this.droids[i].removeFromWorld) {
                this.droids.splice(i, 1);
            }
        }
        for (var i = this.lasers.length -1; i >= 0; i--) {
            this.lasers[i].update();
            if (this.lasers[i].removeFromWorld) {
                this.lasers.splice(i, 1);
            }
        }
        for (var i = this.tiles.length -1; i >= 0; i--) {
            this.tiles[i].update();
            // if (this.tiles[i].removeFromWorld) { // TODO: needed removeFromWorld for tiles?
            //     this.entities.splice(i, 1);
            // }
        }
        for (var i = this.entities.length -1; i >= 0; i--) {
            this.entities[i].update();
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
            }
        }

        this.click = null;
    }
    draw() {
        this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
        this.ctx.save();
        this.parallaxManager.draw();
        this.Zerlin.draw();
        for (var i = 0; i < this.droids.length; i++) {
            this.droids[i].draw(this.ctx);
        }
        for (var i = 0; i < this.lasers.length; i++) {
            this.lasers[i].draw(this.ctx);
        }
        for (var i = 0; i < this.tiles.length; i++) {
            this.tiles[i].draw(this.ctx);
        }
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(this.ctx);
        }

        // // draws axis' for debugging placement of entities
        // this.ctx.beginPath();
        // this.ctx.moveTo(this.ctx.canvas.width * (2 - PHI), 0);
        // this.ctx.lineTo(this.ctx.canvas.width * (2 - PHI), this.ctx.canvas.height);
        // this.ctx.stroke();

        this.ctx.restore();
    }
    addEntity(entity) {
        // console.log('added entity');
        this.entities.push(entity);
    }
    addDroid(droid) {
        console.log('added droid');
        this.droids.push(droid);
        // this.entities.push(droid);
    }
    addLaser(laser) {
        console.log('added laser');
        this.lasers.push(laser);
        // this.entities.push(laser);
    }
    addTile(tile) {
        console.log('added laser');
        this.tiles.push(tile);
        // this.entities.push(tile);
    }
    startInput () {
        console.log('Starting input');
        var that = this;

        var getXandY = e => {
            var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
            var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;
            return { x: x, y: y };
        }


        // Keyboard

        this.ctx.canvas.addEventListener("keydown", (e) => {
            if (that.keys[e.code]) { return; } // prevent repeating calls when key is held down
            // console.log("Key Down Event - Char " + e.code + " Code " + e.keyCode);
            that.keys[e.code] = true;            
            e.preventDefault();
        }, false);

        this.ctx.canvas.addEventListener("keyup", function (e) {
            // console.log("Key Up Event - Char " + e.code + " Code " + e.keyCode);
            that.keys[e.code] = false;
            e.preventDefault();
        }, false);


        // Mouse
        this.ctx.canvas.addEventListener("click", function(e) {
            that.click = getXandY(e);
            //debug
            //that.addEntity(new DroidLaser(that, 300, 300, 20, that.click.x, that.click.y, 20, 10));
            //console.log("click X: %d, Y: %d", that.click.x, that.click.y);
            //console.log(e);
        }, false);

        this.ctx.canvas.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        }, false);

        this.ctx.canvas.addEventListener("mousemove", function(e) {
            that.mouse = getXandY(e);
            //console.log(e);
        }, false);

        this.ctx.canvas.addEventListener("mousedown", function (e) {
            if (e.button === 2) { // right click
                that.rightClickDown = true; // change to inside that.keys['rightClick']
            }
        }, false);

        this.ctx.canvas.addEventListener("mouseup", function (e) {
            if (e.button === 2) { // right click
                that.rightClickDown = false;
            }
        }, false);
    


        console.log('Input started');
    }

}

class Timer {
    constructor() {
        this.gameTime = 0;
        this.maxStep = 0.05;
        this.wallLastTimestamp = 0;
    }
    tick() {
        var wallCurrent = Date.now();
        var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
        this.wallLastTimestamp = wallCurrent;
        var gameDelta = Math.min(wallDelta, this.maxStep); // TODO: are these 3  lines okay?
        this.gameTime += gameDelta;
        return gameDelta;
    }
}



class Entity {
    constructor(game, x, y, deltaX, deltaY) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.removeFromWorld = false;
        // Entity's velocity
        this.deltaX = deltaX;
        this.deltaY = deltaY;

    }
    update() {
        
    }
    draw() {
        // if (this.game.showOutlines && this.radius) {
        //     this.game.ctx.beginPath();
        //     this.game.ctx.strokeStyle = "green";
        //     this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        //     this.game.ctx.stroke();
        //     this.game.ctx.closePath();
        // }
    }
    rotateAndCache(image, angle) {
        var offscreenCanvas = document.createElement('canvas');
        var size = Math.max(image.width, image.height);
        offscreenCanvas.width = size;
        offscreenCanvas.height = size;
        var offscreenCtx = offscreenCanvas.getContext('2d');
        offscreenCtx.save();
        offscreenCtx.translate(size / 2, size / 2);
        offscreenCtx.rotate(angle);
        offscreenCtx.translate(0, 0);
        offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
        offscreenCtx.restore();
        //offscreenCtx.strokeStyle = "red";
        //offscreenCtx.strokeRect(0,0,size,size);
        return offscreenCanvas;
    }
    scaleAndCache(image, scale) {

    }
    outsideScreen() {
        return (this.x < 0 || 
            this.x > this.game.surfaceWidth ||
            this.y < 0 ||
            this.y > this.game.surfaceHeight);

    }
    
}

class BoundingBox {

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.left = x;
        this.top = y;
        this.right = this.left + width;
        this.bottom = this.top + height;
    }

    collide(oth) {
        if ((this.right > oth.left)
         && (this.left < oth.right) 
         && (this.top < oth.bottom) 
         && (this.bottom > oth.top)) {
            return true;
        }
        return false;
    }
}
