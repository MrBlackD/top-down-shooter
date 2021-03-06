var playState={
	preload:function() {

	},

	create:function() {

        initOptions();
        initWorld();
        
        
        
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
