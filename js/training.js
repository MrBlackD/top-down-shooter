var map;
var layer;
var map2;
var layer2;

var trainingState={
	preload:function() {

	},

	create:function() {

            //  Because we're loading CSV map data we have to specify the tile size here or we can't render it


        map = game.add.tilemap('trainingFloor', 16, 16);

        //  Now add in the tileset
        map.addTilesetImage('trainingFloorTiles');

        //  Create our layer
        layer = map.createLayer(0);

        //  Resize the world
        layer.resizeWorld();


        initOptions();
        //initWorld();
        
        
        
		initPlayer();
		initPlayerControl();

        
		initBulletPool();
        initEnemyGenerator();


        initEnemyGenerator();
        initEnemies();
        initUI();

        
        //addGenerator(16,16);
        
        //addGenerator(game.world.centerX,16);
        addEnemy(game.world.centerX,16);
        


        
/*		game.time.events.loop(2000,function(){
            generators.forEachAlive(function(generator){
                   addDummie(generator.x,generator.y);
            },this);
        },this);*/

	},

	update:function() {
		game.physics.arcade.collide(player, layer);

		//game.debug.body(player);
        fpsLabel.text = game.time.fps;
        bytesCounter.text=player.stats.bytes + " bytes";
        
        if(targetedEnemy){
            drawEnemyHpBar(targetedEnemy);
            //enemyHpBar.text=targetedEnemy.stats.hp + " HP";
            //drawEnemyHpBar(targetedEnemy);
        }
            
        
        
        if(nextEnemy<game.time.now){
            generators.forEachAlive(function(generator){
                   addDummie(generator.x,generator.y);
            },this);
            
            nextEnemy=game.time.now+delay;
        }

		game.physics.arcade.overlap(enemies, bulletPool,hit);
        game.physics.arcade.overlap(generators, bulletPool,hit);
		game.physics.arcade.overlap(enemies, player,killPlayer);
		playerMovement();
        
        
		enemies.forEachAlive(function(enemy){enemyMovement(enemy,'blinker')},this);
        

	},

	render:function() {
        
	}
};
