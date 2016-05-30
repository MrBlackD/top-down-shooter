var weapons={};
weapons['rifle']={
	dmg:1,
	lastShot:0,
	shotDelay:400,
	bulletSpeed:2000,
	scatter:5
};


var playState={
	preload:function() {

	},

	create:function() {
		// Create a label to display the FPS
		game.fpsLabel = game.add.text(10, 10, '0',{fill:'#009900'});

		initPlayer();
		initPlayerControl();

		initBulletPool();

		initDummies();

		game.time.events.loop(2000,addDummie,this);

	},

	update:function() {
		game.fpsLabel.text = game.time.fps;

		//game.debug.body(player);

		game.physics.arcade.overlap(dummies, bulletPool,hit);
		game.physics.arcade.overlap(dummies, player,killPlayer);
		playerMovement();


	},

	render:function() {
		
	}
};



	function initPlayer(){
		player=game.add.sprite(game.world.centerX,game.world.centerY,"player");
		player.anchor.setTo(0.3,0.5);
		game.physics.arcade.enable(player);
		player.body.allowRotation=true;
		player.body.collideWorldBounds=true;
		player.body.setSize(player.height,player.height);

		player.stats={};
		player.stats.speed=200;

		player.equipment={};
		player.equipment.weapon=weapons.rifle;
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
		//bullet.checkWorldBounds = true;
		//bullet.outOfBoundsKill = true;

		/*for(var i = 0; i < NUMBER_OF_BULLETS; i++) {

			var bullet = this.game.add.sprite(0, 0, 'bullet');
			bulletPool.add(bullet);

			bullet.anchor.setTo(0.5, 0.5);

			game.physics.enable(bullet, Phaser.Physics.ARCADE);
			bullet.kill();
		}*/
	}

	function initDummies(){
			dummies = this.game.add.group();
			dummies.enableBody=true;
			dummies.createMultiple(10,'enemy');
			dummies.setAll('anchor.x',0.5);
			dummies.setAll('anchor.y',0.5);
			dummies.setAll('body.collideWorldBounds',true);
			dummies.setAll('body.bounce',1);
	/*
		for(var i = 0; i < 2; i++) {

			var dummy = this.game.add.sprite(game.world.randomX, game.world.randomY, 'enemy');
			dummy.rotation=Math.random()*360*Math.PI/180;
			dummy.stats={};
			dummy.stats.hp=100;

			dummy.anchor.setTo(0.5, 0.5);

			game.physics.enable(dummy, Phaser.Physics.ARCADE);
			dummy.body.collideWorldBounds=true;
			dummy.body.immovable=true;

			dummies.add(dummy);
			
		}*/
	}

	function addDummie(){
		var dummie=dummies.getFirstDead();
		if(!dummie||!player.alive)
			return;
		var coordinates=game.rnd.pick([{'x':50,'y':game.world.Y},{'x':game.world.width-50,'y':game.world.Y},{'x':game.world.randomX,'y':50},{'x':game.world.randomX,'y':game.world.height-50}]);
		dummie.reset(coordinates.x,coordinates.y);
		dummie.stats={};
		dummie.stats.hp=5;
		dummie.stats.speed=100;
		dummie.alpha=0;
		//game.debug.body(dummie);
		dummie.rotation=game.physics.arcade.moveToObject(dummie, player, 60);//game.physics.arcade.angleToXY(dummie,player.x,player.y);
		
		game.add.tween(dummie).to({'alpha':1},1000).start();
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
		if(!object.alive)
			return;
		object.stats.hp-=player.equipment.weapon.dmg;
		bullet.kill();
		console.log(object.stats.hp);
		if(object.stats.hp<=0)
			object.kill();
	}

	function killPlayer(dummie,player){
		if(player.alive)
			player.kill();
		if(dummie.alive)
			dummie.kill();
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

		game.physics.arcade.moveToXY(bullet,_x, _y, weapon.bulletSpeed);
	}

	function distanceBetweenPoints(x1,y1,x2,y2){
		//расстояние между 2 точками

		return Math.sqrt(Math.pow(x1-x2)+Math.pow(y1-y2));
	}

	function scatter(x){
		//возвращает угол разброса в радианах
		return Math.ceil(-x+Math.random()*x*2)*Math.PI/180;
	}
