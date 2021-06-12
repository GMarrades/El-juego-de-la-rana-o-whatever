var game = new Phaser.Game(1024, 1024, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    
    game.load.image('background', 'assets/imgs/deep-space.jpg');
    game.load.image('suelito', 'assets/imgs/suelo_arriba.png')
    game.load.spritesheet('dude', 'assets/imgs/FROGGO_caminando2.png', 32, 32, 6);
}

var player;
var bg;
var facing = 'mLeft';

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.time.desiredFps = 30;

    game.add.image(0, 0, 'background');
    floor = game.add.tileSprite(0, 992, 10000, 32, 'suelito');

    //suelo
    game.world.setBounds(0, -100, 10000, 1124)
    //gravedad
    game.physics.arcade.gravity.y = 250;
    //añadir a personaje y sus fisicas
    player = game.add.sprite(32, 32, 'dude');
    game.physics.arcade.enable([player, floor]);

    //collider suelo
    floor.body.collideWorldBounds = true;
    floor.body.immovable = true;
    floor.body.allowGravity = false;
    
    //rebote contra el suelo y collider personaje-world
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.fixedRotation = true;

    //sprites
    player.animations.add('mLeft', [3, 4, 5], 5, true);
    player.animations.add('mRight', [0, 1, 2], 5, true);
    
    game.camera.follow(player);
}

function update() {

    // game.physics.arcade.collide(player, layer);

    player.body.velocity.x = 0;
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        player.body.velocity.x = -150;
        player.animations.play('mLeft', 5, true);
        facing = 'mLeft';
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        player.body.velocity.x = 150;
        player.animations.play('mRight', 5, true);
        facing = 'mRight';
    }
    
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && game.physics.arcade.collide(player, floor))
    {
        player.body.velocity.y = -250;
    }

    if (game.physics.arcade.collide(player, floor)){
        player.y = floor.y - player.height;
    }

}