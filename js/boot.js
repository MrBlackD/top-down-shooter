var bootState={
	create:function(){
		game.physics.startSystem(Phaser.Physics.ARCADE);
		// Tell Phaser to compute the FPS
		game.time.advancedTiming = true;
		game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
		game.state.start('load');
	}
}