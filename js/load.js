var loadState={
	preload:function(){
		var loadingLable=game.add.text(game.world.centerX,game.world.centerY,'loading...',{font:'30px Courier',fill:'#009900'});
		loadingLable.anchor.x=0.5;
		loadingLable.anchor.y=0.5;
		
		game.load.image("player","assets/player.png");
		game.load.image("enemy","assets/enemy.png");
		game.load.image("bullet","assets/bullet.png");
        game.load.image("tile","assets/tile.png");
        
        game.load.tilemap('trainingFloor', 'assets/trainingFloor.csv', null, Phaser.Tilemap.CSV);
        game.load.image('trainingFloorTiles', 'assets/Tile.png');
        

	},
	create:function(){
		game.state.start('training');
	},
	update:function(){

	}
}
