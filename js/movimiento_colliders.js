//CONSTANTES y VARIABLES INICIALIZADAS
const ANCHO = 1024;
const ALTO = 633;
const TAMAÑO_TILE = 16;
const FPS_BUSCADOS = 30;
const VIDA_MAXIMA = 3;
const FUERZA_REBOTE = 0.2;
const FUERZA_GRAVEDAD = 250;
const FUERZA_SALTO = -250;
const MOSCAS_GROUP_SIZE = 200;
const TIMED_SPAWN = 0.1 * Phaser.Timer.SECOND;

let vidaActual;
let fuego;
let canasta;
let scoreText;
let click_clack = true;
let score = 0;
let CurrentMinigame = 1; //Controlar que eventos se deben de triggerear en cada minijuego
let endedMg2 = false;
let win = false; //Determina que texto se pone en la pantalla de acabar el juego
let moscas;


let game = new Phaser.Game(ANCHO, ALTO, Phaser.CANVAS, 'menu',);
let player;
let bg;
let gameState = {preload:preloadGame, create:createGame, update:updateGame};
let endState = {preload:preloadEnd, create:createEnd};
let aboutState = {preload:preloadAbout, create:createAbout, update:updateAbout};
let menuState = {preload:preloadMenu, create:createMenu};



window.onload = initGame;


function preloadMenu(){
    game.load.atlasJSONHash('atlas', 'assets/imgs/Atlas.png', 'assets/imgs/Atlas.json')
    game.load.image('botonAbout', 'assets/imgs/button_about.png');
    game.load.image('botonPlay', 'assets/imgs/button_play.png');
}

function createMenu(){
    fondo = game.add.sprite(0, 0, 'atlas', 'fondoMenu.png');
    game.add.button(450, 300, 'botonAbout', goAbout);
    game.add.button(463, 400, 'botonPlay', startGame);
    TextoInit();
}

function preloadAbout(){
    game.load.atlasJSONHash('atlas', 'assets/imgs/Atlas.png', 'assets/imgs/Atlas.json')

}

function createAbout(){
    fondo = game.add.sprite(0, 0, 'atlas', 'fondoMenu.png');
    TextoAbout();
    TextosGoBack();
}

function updateAbout(){
    if (game.input.mousePointer.leftButton.justPressed(30)){
        mainMenu();
    }
}

function preloadGame() {
game.load.atlasJSONHash('atlas', 'assets/imgs/Atlas.png', 'assets/imgs/Atlas.json')
}

function createGame() {
    //Inicializar Físicas y tal
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.time.desiredFps = FPS_BUSCADOS;

    //Añadir Sprites
    fondo = game.add.tileSprite(0, 300, 10000, 900, 'atlas', 'fondo1.png');
    fondo2 = game.add.tileSprite(0, 500, 10000, 900, 'atlas', 'fondo2.png');
    fondo3 = game.add.tileSprite(0, 650, 10000, 900, 'atlas', 'fondo3.png');
    floor = game.add.tileSprite(0, 1100, 3000, TAMAÑO_TILE, 'atlas', 'suelo_arriba.png');
    floor3 = game.add.tileSprite(4350, 1100, 1000, TAMAÑO_TILE, 'atlas', 'suelo_arriba.png');
    floor2 = game.add.tileSprite(1350, 800, 100, TAMAÑO_TILE, 'atlas', 'suelo_arriba.png');
    agua = game.add.tileSprite(3000,1150, 1350, TAMAÑO_TILE, 'atlas', 'Water.png');
    player = game.add.sprite(1200, 1000, 'atlas', 'CorrerDer1.png');
    canasta = game.add.sprite(800, 900, 'atlas', 'Canasta.png');
    canasta2 = game.add.sprite(1352, 852, 'atlas', 'Canasta.png');

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
    player.animations.add('mLeft', Phaser.Animation.generateFrameNames('CorrerIzq', 1,3, '.png'), 10, false, false);
    player.animations.add('mRight', Phaser.Animation.generateFrameNames('CorrerDer', 1,3, '.png'), 10, false,false);
    
    //seguir jugador
    game.camera.follow(player);
    
    //settear la vida
    vidaActual = VIDA_MAXIMA;


    //fisicas de canastas
    
    setCanastas();
    setFireballs();
    crearHUD();
}

function updateGame() {
    moverCanastas();
    hitCanasta();
    drown();
    checkCurrentMinigame();
    if(CurrentMinigame !=2){
        PlayerController();
    }
    else{
        TimerText();
    }
}

function preloadEnd(){
    game.load.atlasJSONHash('atlas', 'assets/imgs/Atlas.png', 'assets/imgs/Atlas.json')
    game.load.image('botonRestart', 'assets/imgs/button_restart.png');
    game.load.image('botonMenu', 'assets/imgs/button_main-menu.png')
}

function createEnd(){
    fondo = game.add.sprite(0, 0, 'atlas', 'fondoMenu.png');
    if(win){
        WinText = game.add.text(50, 150, 'You Won!', {font: 'Arial',fontSize: '30px',fill: '#e69138'});
    }
    else{
        LoseText =  game.add.text(500, 150, 'You Lost!', {font: 'Arial',fontSize: '30px',fill: '#e69138'});
    }
    miniText = game.add.text(50, 400, 'You reached minigame ' + CurrentMinigame, {font: 'Arial',fontSize: '30px',fill: '#f2db9b'});
    scoreText = game.add.text(750, 400,  'Your score is ' + score,{font: 'Arial',fontSize: '30px',fill: '#f2db9b'});
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
        fondo3.tilePosition.x += 0.5;
        fondo2.tilePosition.x += 0.1;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        player.body.velocity.x = 150;
        player.animations.play('mRight', 5, true);
        fondo2.tilePosition.x -= 0.1;
        fondo3.tilePosition.x -= 0.5;
    }
    
    if (game.input.keyboard.isDown(Phaser.Keyboard.UP)&& game.physics.arcade.collide(player, floor))
    {
        player.body.velocity.y = FUERZA_SALTO;
    }
    game.physics.arcade.collide(player,floor);


    if (game.input.mousePointer.leftButton.justPressed(30)){
        dispararFuego();
    }
}

function die(){
    game.state.start('end');
}

function damage(){
    vidaActual --;
    if(vidaActual <= 0){
        die();
    }
}

function endWin(){
    if (score >= MAXCANASTAS){
        win = true;
        game.state.start('end');
    }
}

function mainMenu(){
    game.state.start('menu');
}

function startGame(){
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

function checkCurrentMinigame(){
    if(player.body.x >1000){
        CurrentMinigame = 1;
        if(player.body.x> 2500){
            CurrentMinigame = 2;
            if (endedMg2 = true){
                CurrentMinigame = 3;
                    CheckWin();
            }
        }
    }
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

function setFireballs(){
        fuego = game.add.group();
        fuego.enableBody = true;
        fuego.physicsBodyType = Phaser.Physics.ARCADE;
        fuego.createMultiple(100, 'atlas', 'FireBall.png');
        fuego.setAll('checkWorldBounds', true);
        fuego.setAll('outOfBoundsKill', true);
}

function setCanastas(){
    canasta.body.collideWorldBounds = true;
    canasta2.body.collideWorldBounds = true;
    canasta2.body.allowGravity = false;
    game.physics.arcade.overlap(canasta, fuego, hitCanasta, null, this);
    game.physics.arcade.overlap(canasta2, fuego, hitCanasta, null, this);
}

function CheckWin(){
    Phaser.Physics.collide(player,floor3, win());
}
function TimerText(){
    
}