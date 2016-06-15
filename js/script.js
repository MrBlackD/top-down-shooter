var weapons={};
weapons[0]={
    id:0,
    name:'rifle',
	dmg:1,
	lastShot:0,
	shotDelay:200,
	bulletSpeed:1000,
	scatter:5
};
weapons[1]={
    id:1,
    name:'scope',
	dmg:100,
	lastShot:0,
	shotDelay:1000,
	bulletSpeed:3000,
	scatter:2
};


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


    function initOptions(){
        game.renderer.renderSession.roundPixels=true;
        nextEnemy=0;
        delay=2000;
        targetedEnemy=null;
    }

    function initWorld(){
        game.stage.backgroundColor = "#000";
        game.world.height=1000;
        drawGrid();
        
    }

    function initUI(){
        // Create a label to display the FPS
		fpsLabel = game.add.text(game.camera.x+game.camera.width-50,game.camera.y+ 10, '0',{fontSize:14,fill:'#999'});
        fpsLabel.fixedToCamera=true;
        //bytes counter
        bytesCounter = game.add.text(game.camera.x,game.camera.y,' bytes',{fontSize:14,fill:'#33f'});
        bytesCounter.fixedToCamera=true;
        
        //enemy health  bar
        enemyHpLabel=game.add.text(game.camera.x+game.camera.width/2,game.camera.y+ 10,'',{fontSize:14,fill:'#944'});
        enemyHpLabel.anchor.setTo(0.5,0.5);
        enemyHpLabel.fixedToCamera=true;
        
        enemyHpBarFrame = game.add.graphics(game.camera.width/2-102, game.camera.y+20);
        enemyHpBarFrame.fixedToCamera=true;
        enemyHpBarFrame.visible=false;
        enemyHpBar = game.add.graphics(game.camera.width/2-100, game.camera.y+20);
        enemyHpBar.fixedToCamera=true;
        enemyHpBar.visible=false;
    }

    function drawEnemyHpBar(enemy){
        
        enemyHpBarFrame.clear();
        enemyHpBarFrame.lineStyle(24, 0xff9999);
       
        enemyHpBarFrame.moveTo(0, 0);  
        enemyHpBarFrame.lineTo(204, 0);

        enemyHpBar.clear();
        enemyHpBar.lineStyle(20, 0xff3333);
       
        enemyHpBar.moveTo(0, 0);  
        enemyHpBar.lineTo(200*enemy.stats.hp/enemy.stats.maxHp, 0);
        

    }


	function initPlayer(){
		player=game.add.sprite(game.world.centerX,game.world.height-50,"player");
		player.anchor.setTo(0.3,0.5);
		game.physics.arcade.enable(player);
		player.body.allowRotation=true;
		player.body.collideWorldBounds=true;
		player.body.setSize(player.height,player.height);

        player.stats={};
        playerStats=JSON.parse(localStorage.getItem('playerStats'));
        if(playerStats){
            player.stats=playerStats;
        }else{
            player.stats.hp=100;
            player.stats.maxHp=100;
    		player.stats.speed=200;
            player.stats.kills=0;
            player.stats.bytes=0;
        }
        player.equipment={};
        player.equipment.weapon=weapons[0];
		

        game.camera.follow(player);
        //game.camera.deadzone = new Phaser.Rectangle(game.camera.width/2-100, player.y-100,game.camera.width/2+100, game.camera.height/2+100);
	}


	function initPlayerControl(){
		upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
		downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
		leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
		rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
	}

	function initBulletPool(){

		NUMBER_OF_BULLETS=200;
		bulletPool = this.game.add.group();
		bulletPool.enableBody=true;
		bulletPool.createMultiple(NUMBER_OF_BULLETS,'bullet');
		bulletPool.setAll('anchor.x',0.5);
		bulletPool.setAll('anchor.y',0.5);
		bulletPool.setAll('checkWorldBounds',true);
		bulletPool.setAll('outOfBoundsKill',true);

	}

	function initEnemies(){
        enemies = this.game.add.group();
        enemies.enableBody=true;
        enemies.createMultiple(10,'enemy');
        enemies.setAll('anchor.x',0.5);
        enemies.setAll('anchor.y',0.5);
        enemies.setAll('body.collideWorldBounds',true);
        enemies.setAll('body.bounce',1);
	}

    function initEnemyGenerator(){
        generators=this.game.add.group();
        generators.enableBody=true;
        generators.createMultiple(10,'tile');
        generators.setAll('anchor.x',0.5);
        generators.setAll('anchor.y',0.5);
    }
    


    function drawGrid(){
        var graphics = game.add.graphics(0,0);
        graphics.lineStyle(1, 0x009900);
        for(var i=0;i<game.world.height;i+=40){
            //horizontal
            graphics.moveTo(i,0);
            graphics.lineTo(i,game.world.height);
            //vertical
            graphics.moveTo(0,i);
            graphics.lineTo(game.world.width,i);
            
        }
            
    }


    function addGenerator(x,y){
        var generator=generators.getFirstDead();
        generator.reset(x,y);
        generator.stats={};
        generator.stats.hp=20;
        generator.alpha=0;
        
        game.add.tween(generator).to({'alpha':1},1000).start();
    }

	function addEnemy(x,y){
		var enemy=enemies.getFirstDead();
		if(!enemy||!player.alive)
			return;
		enemy.reset(x,y);
        
		enemy.stats={};
        enemy.stats.maxHp=5;
		enemy.stats.hp=5;
		enemy.stats.speed=50;
        enemy.stats.bytes=1;
        
        
        enemy.equipment={};
        enemy.equipment.weapon=weapons[1];
        
		enemy.alpha=0;
		//game.debug.body(enemy);
		enemy.rotation=game.physics.arcade.moveToObject(enemy, player, 60);//game.physics.arcade.angleToXY(enemy,player.x,player.y);
		enemy.inputEnabled=true;
        enemy.events.onInputOver.add(mouseOverEnemy, this);
        enemy.events.onInputOut.add(mouseOutEnemy, this);
        
		game.add.tween(enemy).to({'alpha':1},1000).start();
	}



	function playerMovement(){
		player.body.velocity.x=0;
		player.body.velocity.y=0;
		if(upKey.isDown){
			player.body.velocity.y=-player.stats.speed;
		}
		if(downKey.isDown){
			player.body.velocity.y=player.stats.speed;
		}
		if(leftKey.isDown){
			player.body.velocity.x=-player.stats.speed;
		}
		if(rightKey.isDown){
			player.body.velocity.x=player.stats.speed;
		}
		if(game.input.activePointer.isDown){
			fireBullet();
		}
		player.rotation = game.physics.arcade.angleToPointer(player);
		//player.body.rotation=player.rotation;
	}

	function hit(object,bullet){
		if(!object.alive||object.alpha!=1)
			return;
		object.stats.hp-=player.equipment.weapon.dmg;
		bullet.kill();
        targetedEnemy=object;
        mouseOverEnemy(targetedEnemy);
		if(object.stats.hp<=0){
            mouseOutEnemy(targetedEnemy);
            object.kill();
            player.stats.bytes+=object.stats.bytes;
            player.stats.kills+=1;
        }
			
	}

	function killPlayer(dummie,player){
		if(player.alive)
			player.kill();
		if(dummie.alive)
			dummie.kill();
	}

	function enemyMovement(enemy,behavior){
		if(!player.alive){
            enemy.body.velocity.x=0;
            enemy.body.velocity.y=0;
            return;
        }
        switch(behavior){
            case 'blinker':
                enemy.rotation = game.math.angleBetween(enemy.x, enemy.y, player.x, player.y);
                shoot(enemy);
                blink(enemy);
                break;
            default:
                enemy.rotation = game.math.angleBetween(enemy.x, enemy.y, player.x, player.y);
                enemy.body.velocity.x = Math.cos(enemy.rotation) * enemy.stats.speed;
                enemy.body.velocity.y = Math.sin(enemy.rotation) * enemy.stats.speed;
                break;
        }

	}

    //function for enemy random blinking

    function blink(enemy){
        if(!player.alive)
			return;
        if(!enemy.nextBlink)
            enemy.nextBlink=0;
        if(enemy.nextBlink<game.time.now){
            do{
                _x=game.rnd.integerInRange(game.camera.x,game.camera.x+game.camera.width);
                _y=game.rnd.integerInRange(game.camera.y,game.camera.y+game.camera.height);
            }while(game.physics.arcade.distanceBetween(player,{x:_x,y:_y})<200)
            enemy.x=_x;
            enemy.y=_y;
            enemy.nextBlink+=game.rnd.integerInRange(1000,2000);
        }

    }
    //function for enemy shooting
    function shoot(enemy){
        if(!player.alive)
			return;
        var weapon=enemy.equipment.weapon;
		if (game.time.now - weapon.lastShot < weapon.shotDelay) return;
		weapon.lastShot = game.time.now;

		var bullet = this.bulletPool.getFirstDead();

		if (bullet === null || bullet === undefined) return;

		bullet.revive();
        bullet.reset(enemy.x,enemy.y);
        bullet.rotation = game.math.angleBetween(bullet.x, bullet.y, player.x, player.y)+90*Math.PI/180;
		bullet.body.velocity.x = Math.cos(bullet.rotation-90*Math.PI/180) * weapon.bulletSpeed;
        bullet.body.velocity.y = Math.sin(bullet.rotation-90*Math.PI/180) * weapon.bulletSpeed;
        
    }

	function fireBullet(){
		if(!player.alive)
			return;
		// Enforce a short delay between shots by recording
		// the time that each bullet is shot and testing if
		// the amount of time since the last shot is more than
		// the required delay.
		var weapon=player.equipment.weapon;
		if (game.time.now - weapon.lastShot < weapon.shotDelay) return;
		weapon.lastShot = game.time.now;

		// Get a dead bullet from the pool
		var bullet = this.bulletPool.getFirstDead();

		// If there aren't any bullets available then don't shoot
		if (bullet === null || bullet === undefined) return;

		// Revive the bullet
		// This makes the bullet "alive"
		bullet.revive();

		// Bullets should kill themselves when they leave the world.
		// Phaser takes care of this for me by setting this flag
		// but you can do it yourself by killing the bullet if
		// its x,y coordinates are outside of the world.


		// Set the bullet position to the gun position.
		//Math.ceil(-10+Math.random()*20)*Math.PI/180;
		var r=player.width*0.7;
		var x=player.x+r*Math.cos(player.rotation+12*Math.PI/180);
		var y=player.y+r*Math.sin(player.rotation+12*Math.PI/180);
		bullet.reset(x,y);
		bullet.rotation=game.physics.arcade.angleToPointer(player)+90*Math.PI/180;
		// Shoot it
		rad=Math.sqrt(Math.pow(game.input.activePointer.x-player.x,2)+Math.pow(game.input.activePointer.y-player.y,2));
		
		//FOR CAMERA----------------------------------------------
		_x=player.x+rad*(Math.cos(Math.acos((game.input.activePointer.x-player.x)/rad)+scatter(weapon.scatter)));
		_y=player.y+rad*(Math.sin(Math.asin((game.input.activePointer.y-player.y)/rad)+scatter(weapon.scatter))); 
		//game.physics.arcade.moveToXY(bullet,_x+game.camera.x, _y+game.camera.y, BULLET_SPEED);
		//FOR CAMERA----------------------------------------------

		//game.physics.arcade.moveToXY(bullet,_x+game.camera.x, _y+game.camera.y, weapon.bulletSpeed);
        
        bullet.rotation = game.math.angleBetween(bullet.x-game.camera.x, bullet.y-game.camera.y, game.input.activePointer.x, game.input.activePointer.y)+90*Math.PI/180;
		bullet.body.velocity.x = Math.cos(bullet.rotation-90*Math.PI/180) * weapon.bulletSpeed;
        bullet.body.velocity.y = Math.sin(bullet.rotation-90*Math.PI/180) * weapon.bulletSpeed;
	}

	function distanceBetweenPoints(x1,y1,x2,y2){
		//расстояние между 2 точками

		return Math.sqrt(Math.pow(x1-x2)+Math.pow(y1-y2));
	}

	function scatter(x){
		//возвращает угол разброса в радианах
		return Math.ceil(-x+Math.random()*x*2)*Math.PI/180;
	}


    function saveGameState(){

		localStorage.setItem('playerStats',JSON.stringify(player.stats));

	}

    function mouseOverEnemy(enemy){
        enemyHpBar.visible=true;
        enemyHpBarFrame.visible=true;
        targetedEnemy=enemy;
    }

    function mouseOutEnemy(enemy){
        game.time.events.add(Phaser.Timer.SECOND * 1, function(){
            enemyHpBar.visible=false;
            enemyHpBarFrame.visible=false;    
        }, this);

    }