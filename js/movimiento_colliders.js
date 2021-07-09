//CONSTANTES y VARIABLES INICIALIZADAS
const TAMAÑO_TILE = 16;
const FPS_BUSCADOS = 30;
const VIDA_MAXIMA = 3;
const FUERZA_REBOTE = 0.2;
const FUERZA_GRAVEDAD = 250;
const FUERZA_SALTO = -250;

let vidaActual;
let fuego;
let canasta;
let scoreText;
let click_clack = true;
let score = 0;
let CurrentMinigame = 1;

let game = new Phaser.Game(1024, 633, Phaser.CANVAS, 'phaser-example', { preload: preloadGame, create: createGame, update: updateGame });
let player;
let bg;
let facing = 'mLeft';
let deathState = {preload:preloadDeath, create:createDeath, update:updateDeath};
game.state.add('death', deathState);


function preloadGame() {
    game.load.image('suelito', 'assets/imgs/suelo_arriba.png')
    game.load.spritesheet('frog', 'assets/imgs/FROGGO_caminando2.png', TAMAÑO_TILE, TAMAÑO_TILE, 6);
    game.load.image('segunda_capa', 'assets/imgs/fondo3.png')
    game.load.image('tercera_capa', 'assets/imgs/fondo2.png')
    game.load.image('cuarta_capa', 'assets/imgs/fondo1.png')
    game.load.image('canastita', 'assets/imgs/Canasta.png');
    game.load.spritesheet('fireball', 'assets/imgs/FireBall.png');
}



function createGame() {
    //Inicializar Físicas y tal
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.time.desiredFps = FPS_BUSCADOS;

    //Añadir Sprites
    fondo = game.add.tileSprite(0, 300, 10000, 900, 'cuarta_capa');
    fondo2 = game.add.tileSprite(0, 500, 10000, 900, 'tercera_capa');
    fondo3 = game.add.tileSprite(0, 650, 10000, 900, 'segunda_capa');
    floor = game.add.tileSprite(0, 1100, 10000, TAMAÑO_TILE, 'suelito');
    floor2 = game.add.tileSprite(1350, 800, 100, TAMAÑO_TILE, 'suelito');
    player = game.add.sprite(1200, 300, 'frog');
    canasta = game.add.sprite(800, 900, 'canastita');
    canasta2 = game.add.sprite(1352, 800-48, 'canastita');


    //suelo
    game.world.setBounds(0, -100, 10000, 1124)

    //gravedad
    game.physics.arcade.gravity.y = FUERZA_GRAVEDAD;

    //añadir fisicas
    game.physics.arcade.enable([player, floor, floor2, canasta, canasta2]);
    
    //añadir HUD
    crearTexto();

    //collider suelo
    floor.body.collideWorldBounds = true;
    floor.body.immovable = true;
    floor.body.allowGravity = false;
    floor2.body.allowGravity = false;
    
    //rebote contra el suelo y collider personaje-world
    player.body.bounce.y = FUERZA_REBOTE;
    player.body.collideWorldBounds = true;
    player.body.fixedRotation = true;

    //Animaciones
    player.animations.add('mLeft', [3, 4, 5], 5, true);
    player.animations.add('mRight', [0, 1, 2], 5, true);
    
    //seguir jugador
    game.camera.follow(player);
    
    //settear la vida
    vidaActual = VIDA_MAXIMA;

    //Cosas de las bolas de fuego
    fuego = game.add.group();
    fuego.enableBody = true;
    fuego.physicsBodyType = Phaser.Physics.ARCADE;
    fuego.createMultiple(100, 'fireball');
    fuego.setAll('checkWorldBounds', true);
    fuego.setAll('outOfBoundsKill', true);

    
    //fisicas de canastas
    canasta.body.collideWorldBounds = true;
    canasta2.body.collideWorldBounds = true;
    canasta2.body.allowGravity = false;
    game.physics.arcade.collide(floor, canasta);
    game.physics.arcade.overlap(canasta, fuego, hitCanasta, null, this);
    game.physics.arcade.overlap(canasta2, fuego, hitCanasta, null, this);

    crearHUD();
}

function updateGame() {
    PlayerController();
    moverCanastas();
    hitCanasta();
   
}
function preloadDeath(){
        
}
function createDeath(){

}
function updateDeath(){

}

function crearTexto(){
    let posX = 50;
    let posY = 800;

    WelcomeText = game.add.text(posX, posY, 'Welcome to a Froggo Game!', {
        font: 'Arial',
        fontSize: '30px',
        fill: '#FFFFFF'
    });
    HelpText = game.add.text(posX, posY+50, 'Press LEFT & RIGHT to move, SPACEBAR to jump, aim with the CURSOR & shoot with UP!', {
        font: 'Arial',
        fontSize: '15px',
        fill: '#FFFFFF'
    });
    MinigameText = game.add.text(posX+1000, posY+50, 'Try hitting the baskets with your fireballs!', {
        font: 'Arial',
        fontSize: '15px',
        fill: '#FFFFFF'
    });
}

function moverCanastas(){
    if(click_clack == true){
        canasta2.x -= 1;  
    }
    if(click_clack == false){
        canasta2.x += 1;
    }
    if(canasta2.x <= 1350){
        click_clack = false;
    }
    if(canasta2.x >= 1435){
        click_clack = true;
    }
    canasta2.y = 800-48;
}

function dispararFuego()
{
    if (fuego.countDead() > 0)
    {
        var fireball = fuego.getFirstDead();

        fireball.reset(player.x, player.y);

        game.physics.arcade.moveToPointer(fireball, 500);
    }
}

function crearHUD(){
    let posX = 750;
    let posY = 900;
    let styleHUD = {fontsize: '5px', fill: '#FFFFFF'};

    scoreText = game.add.text(posX, posY, 'Score: '+score, styleHUD);
}

function hitCanasta (){
    if (game.physics.arcade.collide(canasta, fuego)){
        score +=1;
        scoreText.text = 'Score ' + score;
        canasta.body.enable = false;
    }
    if (game.physics.arcade.collide(canasta2, fuego)){
        score +=1;
        scoreText.text = 'Score ' + score;
        canasta2.body.enable = false;
        canasta2.body.immovable = true;
    }
}

function PlayerController(){ //Pilla todos los inputs de teclado y modifica al jugueador
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
    
    if ((game.input.keyboard.isDown(Phaser.Keyboard.UP || game.input.keyboard.isDown(Phaser.Keyboard.W))) && game.physics.arcade.collide(player, floor))
    {
        player.body.velocity.y = FUERZA_SALTO;
    }

    if (game.physics.arcade.collide(player, floor)){
        player.y = floor.y - player.height-0.5;
    }
    if (game.input.mousePointer.leftButton.justPressed(30)){
        dispararFuego();
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