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
let fuego;
let canasta;
let puntos = 0;
let deathState = {preload:preloadDeath, create:createDeath, update:updateDeath};
game.state.add('death', deathState);


function preloadGame() {
    game.load.image('suelito', 'assets/imgs/suelo_arriba.png')
    game.load.spritesheet('frog', 'assets/imgs/FROGGO_caminando2.png', TAMAÑO_TILE, TAMAÑO_TILE, 6);
    game.load.spritesheet('fireball', 'assets/imgs/FireBall.png')
    game.load.image('segunda_capa', 'assets/imgs/fondo3.png')
    game.load.image('tercera_capa', 'assets/imgs/fondo2.png')
    game.load.image('cuarta_capa', 'assets/imgs/fondo1.png')
    game.load.image('canastita', 'assets/imgs/Canasta.png')
}



function createGame() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.time.desiredFps = FPS_BUSCADOS;

    fondo = game.add.tileSprite(0, 300, 10000, 900, 'cuarta_capa');
    fondo2 = game.add.tileSprite(0, 500, 10000, 900, 'tercera_capa');
    fondo3 = game.add.tileSprite(0, 650, 10000, 900, 'segunda_capa');

    floor = game.add.tileSprite(0, 1100, 10000, TAMAÑO_TILE, 'suelito');

    //suelo
    game.world.setBounds(0, -100, 10000, 1124)
    //gravedad
    game.physics.arcade.gravity.y = FUERZA_GRAVEDAD;
    //añadir a personaje y sus fisicas
    player = game.add.sprite(16, 1000, 'frog');
    game.physics.arcade.enable([player, floor]);

    //añadir lengua como 'balas'
    fuego = game.add.group();
    fuego.enableBody = true;
    fuego.physicsBodyType = Phaser.Physics.ARCADE;

    fuego.createMultiple(1, 'fireball');
    fuego.setAll('checkWorldBounds', true);
    fuego.setAll('outOfBoundsKill', true);

    //añadir canasta/s
    canasta = game.add.sprite(800, 900, 'canastita');

    game.physics.arcade.enable(canasta);
    
    canasta.body.collideWorldBounds = true;
    canasta.y = floor.y - 48;
    

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
    
    //seguir jugador
    game.camera.follow(player);
    
    //settear la vida
    vidaActual = VIDA_MAXIMA;
}

function hitCanasta (puntos){
    if (game.physics.arcade.collide(canasta, fuego)){
        puntos +=1;
        console.log(puntos);
    }
    
}

function updateGame() {
    canasta.x = 800;
    
    game.physics.arcade.collide(floor, canasta);
    game.physics.arcade.overlap(canasta, fuego, hitCanasta, null, this);
    
    player.body.velocity.x = 0;
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        player.body.velocity.x = -150;
        player.animations.play('mLeft', 5, true);
        facing = 'mLeft';
        fondo3.tilePosition.x += 0.5;
        fondo2.tilePosition.x += 0.1;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        player.body.velocity.x = 150;
        player.animations.play('mRight', 5, true);
        facing = 'mRight';
        fondo2.tilePosition.x -= 0.1;
        fondo3.tilePosition.x -= 0.5;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        dispararFuego();
    }
    
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && game.physics.arcade.collide(player, floor))
    {
        player.body.velocity.y = FUERZA_SALTO;
    }

    if (game.physics.arcade.collide(player, floor)){
        player.y = floor.y - player.height-0.5;
    }

    function dispararFuego()
    {
        if (fuego.countDead() > 0)
        {
            var fireball = fuego.getFirstDead();

            fireball.reset(player.x, player.y);

            game.physics.arcade.moveToPointer(fireball, 300);
        }
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