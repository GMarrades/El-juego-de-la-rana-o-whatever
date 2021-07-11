//CONSTANTES y VARIABLES INICIALIZADAS
const ANCHO = 1024;
const ALTO = 633;
const TAMAÑO_TILE = 16;
const FPS_BUSCADOS = 30;
const VIDA_MAXIMA = 3;
const FUERZA_REBOTE = 0.2;
const FUERZA_GRAVEDAD = 250;
const FUERZA_SALTO = -250;
const MAX_CANASTAS = 2;
const PATH_TO_MINIGAME4 = 2800;
const COLOR_TEXTO_ABAJO = '#aeabe';
const COLOR_TEXTO_ARRIBA = '##e69138';

let vidaActual;
let fuego;
let canasta;
let scoreText;
let click_clack = true;
let score = 0;
let CurrentMinigame = 1; //Controlar que eventos se deben de triggerear en cada minijuego
let win = false; //Determina que texto se pone en la pantalla de acabar el juego
let totalScore = 0; //Intentar llevar una cuenta  de la puntuación en los diferentes minijuegos

let game = new Phaser.Game(ANCHO, ALTO, Phaser.CANVAS, 'menu',);
let player;
let bg;
let facing = 'mLeft';
let gameState = {preload:preloadGame, create:createGame, update:updateGame};
let endState = {preload:preloadEnd, create:createEnd};
let aboutState = {preload:preloadAbout, create:createAbout, update:updateAbout};
let menuState = {preload:preloadMenu, create:createMenu};



window.onload = initGame;


function preloadMenu(){
    game.load.image('primerPlano', 'assets/imgs/fondo3.png');
    game.load.image('segundoPlano', 'assets/imgs/fondo2.png');
    game.load.image('tercerPlano', 'assets/imgs/fondo1.png');
    game.load.image('botonAbout', 'assets/imgs/button_about.png');
    game.load.image('botonPlay', 'assets/imgs/button_play.png');
}

function createMenu(){
    fondo3 = game.add.tileSprite(0, 0, ANCHO, 900, 'tercerPlano');
    fondo2 = game.add.tileSprite(0, 0, ANCHO, 900, 'segundoPlano');
    fondo = game.add.tileSprite(0, 0, ANCHO, 900, 'primerPlano');
    game.add.button(450, 300, 'botonAbout', goAbout);
    game.add.button(463, 400, 'botonPlay', startGame);
    TextoInit();
}


function preloadAbout(){ //About está hecho del todo
    game.load.image('primerPlano', 'assets/imgs/fondo3.png');
    game.load.image('segundoPlano', 'assets/imgs/fondo2.png');
    game.load.image('TercerPlano', 'assets/imgs/fondo1.png');
}

function createAbout(){ //Los textos del about
    fondo3 = game.add.tileSprite(0, 0, 1024, 900, 'tercerPlano');
    fondo2 = game.add.tileSprite(0, 0, 1024, 900, 'segundoPlano');
    fondo = game.add.tileSprite(0, 0, 1024, 900, 'primerPlano');
    TextoAbout();
    TextosGoBack();
}

function updateAbout(){ //Toda la pantalla funciona como un botón por lo que no hace falta ponerlo
    if (game.input.mousePointer.leftButton.justPressed(30)){
        mainMenu();
    }
}

function preloadGame() {
    game.load.image('suelito', 'assets/imgs/suelo_arriba.png')
    game.load.spritesheet('frog', 'assets/imgs/FROGGO_caminando2.png', TAMAÑO_TILE, TAMAÑO_TILE, 6);
    game.load.image('segunda_capa', 'assets/imgs/fondo3.png')
    game.load.image('tercera_capa', 'assets/imgs/fondo2.png')
    game.load.image('cuarta_capa', 'assets/imgs/fondo1.png')
    game.load.image('canastita', 'assets/imgs/Canasta.png');
    game.load.spritesheet('fireball', 'assets/imgs/FireBall.png');
    game.load.image('agua', 'assets/imgs/Water.png');
    game.load.image('tronco','assets/imgs/tronco.png');
    game.load.image('corazon1', 'assets/imgs/corazon1.png');
    game.load.image('corazon2', 'assets/imgs/corazon2.png');
    game.load.image('corazon3', 'assets/imgs/corazon3.png');
}

function createGame() {
    //Inicializar Físicas y tal
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.time.desiredFps = FPS_BUSCADOS;

    //Añadir Sprites
    fondo = game.add.tileSprite(0, 300, 10000, 900, 'cuarta_capa');
    fondo2 = game.add.tileSprite(0, 500, 10000, 900, 'tercera_capa');
    fondo3 = game.add.tileSprite(0, 650, 10000, 900, 'segunda_capa');
    floor = game.add.tileSprite(0, 1100, 1350, TAMAÑO_TILE, 'suelito');
    floor2 = game.add.tileSprite(1350, 800, 100, TAMAÑO_TILE, 'suelito');
    agua = game.add.tileSprite(1350,1100, 1350, TAMAÑO_TILE, 'agua');
    player = game.add.sprite(1200, 1000, 'frog');
    canasta = game.add.sprite(800, 900, 'canastita');
    canasta2 = game.add.sprite(1352, 852, 'canastita');


    //suelo
    game.world.setBounds(0, -100, 10000, 1124)

    //gravedad
    game.physics.arcade.gravity.y = FUERZA_GRAVEDAD;

    //añadir fisicas
    game.physics.arcade.enable([player, floor, floor2, canasta, canasta2, agua]);
    
    //añadir HUD
    TextosGame();

    //collider suelo
    floor.body.collideWorldBounds = true;
    floor.body.immovable = true;
    floor.body.allowGravity = false;
    floor2.body.allowGravity = false;
    agua.body.collideWorldBounds = true;
    agua.body.immovable = true;
    agua.body.allowGravity = false;
    
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
    game.physics.arcade.overlap(canasta, fuego, hitCanasta, null, this);
    game.physics.arcade.overlap(canasta2, fuego, hitCanasta, null, this);
    game.physics.arcade.overlap(player, agua, die, null, this);

    crearHUD();
}

function updateGame() {
    PlayerController();
    moverCanastas();
    hitCanasta();
    drown();
}

function preloadEnd(){ //Cargados los fondos de las pantallas no jugables
    game.load.image('primerPlano', 'assets/imgs/fondo3.png');
    game.load.image('segundoPlano', 'assets/imgs/fondo2.png');
    game.load.image('TercerPlano', 'assets/imgs/fondo1.png');
    game.load.image('botonRestart', 'assets/imgs/button_restart.png');
    game.load.image('botonMenu', 'assets/imgs/button_main-menu.png')
}

function createEnd(){ //Usa If/else para determinar que texto poner, faltan los botones como en el Main menu
    fondo3 = game.add.tileSprite(0, 0, 1024, 900, 'tercerPlano');
    fondo2 = game.add.tileSprite(0, 0, 1024, 900, 'segundoPlano');
    fondo = game.add.tileSprite(0, 0, 1024, 900, 'primerPlano');
    if(win){
        WinText = game.add.text(50, 150, 'You Won!', {font: 'Arial',fontSize: '30px',fill: '#e69138'});
    }
    else{
        LoseText =  game.add.text(500, 150, 'You Lost!', {font: 'Arial',fontSize: '30px',fill: '#e69138'});
    }
    miniText = game.add.text(50, 400, 'You reached minigame ' + CurrentMinigame, {font: 'Arial',fontSize: '30px',fill: '#f2db9b'});
    scoreText = game.add.text(750, 400,  'Your score is ' + totalScore,{font: 'Arial',fontSize: '30px',fill: '#f2db9b'});
    game.add.button(50, 500, 'botonMenu', mainMenu);
    game.add.button(750, 500, 'botonRestart', startGame);
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

function drown(){
    if(game.physics.arcade.collide(player, agua)){
        die();
    }
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

function PlayerController(){ //Pilla todos los inputs que afectan al juegueador
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
    
    if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && game.physics.arcade.collide(player, floor))
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
    //PONER UN TIMER DE 1segundo
    game.state.start('end');
}

function damage(){
    vidaActual --;
    if(vidaActual <= 0){
        die();
    }
}

function winCanasta(){ //ACABAR EL JUEGO BIEN
    if (score >= MAXCANASTAS){
        win = true;
        //PONER UN TIMER DE 1 SEGUNDO
        game.state.start('end');
    }
}

function mainMenu(){ //IR AL MAIN MENU
    game.state.start('menu');
}

function startGame(){ // EMPEZAR EL JUEGO
    game.state.start('game');
}

function goInstructions(){
    game.state.start(aboutState);
}
function TextosGoBack(){
    GoBackText = game.add.text(25, 600, 'Click anywhere to go to Main Menu', {font: 'Arial',fontSize: '20px', fill: '#f2db9b'});
}

function TextosGame(){

    MinigameText = game.add.text(1050, 900, 'Try hitting the baskets with your fireballs!', {
        font: 'Arial',
        fontSize: '15px',
        fill: '#FFFFFF'
    });
}

function TextoAbout(){
    HelpText = game.add.text(25, 400, 'Press LEFT & RIGHT to move, UP to jump, aim with the CURSOR & shoot with CLICK!', {font: 'Arial',fontSize: '24px',fill: '#f2db9b'});
}

function TextoInit(){
    WelcomeText = game.add.text(320, 100, 'Welcome to a Froggo Game!', {font: 'Arial',fontSize: '30px',fill: '#e69138'});
    AuthorsText = game.add.text(100, 550, 'A game by Guillem Marrades, Jaime Pérez and Margarita Gaya', {font: 'Arial', fontSize: '30px', fill: '#f2db9b' });
}

function checkCurrentMinigam(){

}

function initGame(){
    game.state.add('menu', menuState);
    game.state.add('game', gameState);
    game.state.add('end', endState);
    game.state.add('about', aboutState);
    game.state.start('menu');
}

function goAbout(){
    game.state.start('about');
}