
var game = new Phaser.Game('100%', '100%');

game.state.add('boot',bootState);
game.state.add('load',loadState);
game.state.add('play',playState);
game.state.add('training',trainingState);
game.state.add('menu',menuState);

game.state.start('boot');