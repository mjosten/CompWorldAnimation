/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/

/**
 * Manage all assets for this game.
 */
class AssetManager {
    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = [];
        this.downloadQueue = [];
    }
    queueDownload(path) {
        console.log("Queueing " + path);
        this.downloadQueue.push(path);
    }
    isDone() {
        return this.downloadQueue.length === this.successCount + this.errorCount;
    }
    downloadAll(callback) {
        for (var i = 0; i < this.downloadQueue.length; i++) {
			var img = new Image();
            var that = this;
            var path = this.downloadQueue[i];
            console.log(path);
            img.addEventListener("load", function () {
                console.log("Loaded " + this.src);
                that.successCount++;
                if (that.isDone())
                    callback();
            });
            img.addEventListener("error", function () {
                console.log("Error loading " + this.src);
                that.errorCount++;
                if (that.isDone())
                    callback();
            });
            img.src = path;
            this.cache[path] = img;
        }
    }
    getAsset(path) {
        return this.cache[path];
    }
}

/**
 * Driver function to load all assets for the game and launch 
 * the game after completion.
 */
(function () {
	var AM = new AssetManager();

	

	
	AM.queueDownload('./img/blackBackground.png');
	//AM.queueDownload('../img/cavern.png');
	AM.queueDownload('./img/cavernTrans.png');
	AM.queueDownload('./img/stars.png');
	AM.queueDownload('./img/samus.png');
	AM.queueDownload('./img/weapons.png');
	AM.queueDownload('./img/rocketExplosion.png');

	AM.queueDownload('./img/samusRunning.png');
	AM.queueDownload('./img/samusJump.png');
	AM.queueDownload('./img/samusRunShoot.png');


	

	AM.downloadAll(function () {
	    var canvas = document.getElementById("gameWorld");
	    var ctx = canvas.getContext("2d");

	    var gameEngine = new GameEngine(AM);
	    gameEngine.init(ctx);

	    const parallaxBackgroundManager = new ParallaxBackgroundManager(gameEngine); 
	    parallaxBackgroundManager.addBackgroundImage(
	        new ParallaxBackground(gameEngine, AM.getAsset('./img/blackBackground.png'), 
	        0, 0, 0));
	    parallaxBackgroundManager.addBackgroundImage(
	        new ParallaxBackground(gameEngine, AM.getAsset('./img/stars.png'), 
	        100, 0, 200));
	    parallaxBackgroundManager.addBackgroundImage(
	        new ParallaxBackground(gameEngine, AM.getAsset('./img/cavernTrans.png'), 
		    200, 0, 0));
		
	   
	    gameEngine.parallaxManager = parallaxBackgroundManager;
		
		gameEngine.addEntity(new Samus(gameEngine, 100, 500));

	    

	    gameEngine.start();
	    console.log("All Done!");
	});	
})();

