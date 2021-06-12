//CONSTANTES y VARIABLES INICIALIZADAS
const TAMAÑO_TILE = 16;
const FPS_BUSCADOS = 30;
const VIDA_MAXIMA = 3;
const FUERZA_REBOTE = 0.2;
const FUERZA_GRAVEDAD = 250;
const FUERZA_SALTO = -250;
let vidaActual;

let game = new Phaser.Game(1024, 633, Phaser.CANVAS, 'phaser-example', { preload: preloadGame, create: createGame, update: updateGame });
let player;
let bg;
let facing = 'mLeft';
let deathState = {preload:preloadDeath, create:createDeath, update:updateDeath};
game.state.add('death', deathState);


function preloadGame() {
    game.load.image('suelito', 'assets/imgs/suelo_arriba.png')
    game.load.spritesheet('frog', 'assets/imgs/FROGGO_caminando2.png', TAMAÑO_TILE, TAMAÑO_TILE, 6);
}



function createGame() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.time.desiredFps = FPS_BUSCADOS;

    //game.add.image(0, 0, 'background');
    floor = game.add.tileSprite(0, 600, 10000, TAMAÑO_TILE, 'suelito');

    //suelo
    game.world.setBounds(0, -100, 10000, 1124)
    //gravedad
    game.physics.arcade.gravity.y = FUERZA_GRAVEDAD;
    //añadir a personaje y sus fisicas
    player = game.add.sprite(16, 16, 'frog');
    game.physics.arcade.enable([player, floor]);

    //collider suelo
    floor.body.collideWorldBounds = true;
    floor.body.immovable = true;
    floor.body.allowGravity = false;
    
    //rebote contra el suelo y collider personaje-world
    player.body.bounce.y = FUERZA_REBOTE;
    player.body.collideWorldBounds = true;
    player.body.fixedRotation = true;

    //sprites
    player.animations.add('mLeft', [3, 4, 5], 5, true);
    player.animations.add('mRight', [0, 1, 2], 5, true);
    
    game.camera.follow(player);
    
    //settear la vida
    vidaActual = VIDA_MAXIMA;
}

function updateGame() {

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
        player.body.velocity.y = FUERZA_SALTO;
    }

    if (game.physics.arcade.collide(player, floor)){
        player.y = floor.y - player.height-0.5;
    }

    function die(){

    }
    
    function damage(){
        vidaActual --;
        if(vidaActual <= 0){
            die();
        }
    }

    function preloadDeath(){

    }
    function createDeath(){

    }
    function updateDeath(){

    }

}