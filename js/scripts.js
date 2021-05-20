//Declarad Variables y constantes globales aquí
const VELOCIDAD_MOV = 20;
const FUERZA_SALTO = 30;
const VIDA_MAXIMA = 3;



//AQUI ESTÁ DECLARADO EL JUEGO Y LOS GAME STATES CON SUS FUNCIONES BÁSICAS
let game = new Phaser.Game(800, 600, Phaser.CANVAS, "game");
let mainState = { //Estado del juego
    preload: loadAssets,
    create: initializeGame,
    update: gameUpdate
}

let initialState = {//Pantalla de inicio
    preload: preloadInit,
    create: initInit,
    update: updateInit
}

let winState = { //Pantalla de victoria
    preload: loadWin,
    create: createWin,
    update: updateWin
}

let lostState = { //Pantalla de victorian't
    preload: loadLoss,
    create: createLoss,
    update: updateLoss
}

let aboutState = {// Pantalla de créditos y instrucciones o whatever
    preload: loadAbout,
    create: createAbout,
    update: updateAbout
}

game.state.add("main", mainState);
game.state.add("initial", initialState);
game.state.add("win", winState);
game.state.add("lost", lostState);
game.state.add("about", aboutState);
game.state.start("initial");


//INITIAL STATE
function preloadInit(){

}

function initInit(){

}

function updateInit(){

}

//MAIN STATE
function loadAssets(){
    game.load.image("frog", "assets/imgs/froggo")
    //loadear el sprite de las moscas
};
function initializeGame();
let vidaActual = VIDA_MAXIMA;
function gameUpdate();

//WIN STATE
function loadWin(){

}

function createWin(){

}

function updateWin(){

}
//LOSS STATE
function loadLoss(){

}

function createLoss(){

}

function updateLoss(){

}

//ABOUT STATE

function loadAbout(){

}
function createAbout(){

}

function updateAbout(){

}

//FUNCIONES DEL GUEJO

function die(){
    game.state.start("lostState");
}

function damage(){
    vidaActual --;
    if(vidaActual <= 0){
        die();
    }
}




//PLAYER (he visto esto como 30 segundos de un tuto, arregladlo si tal pls)
player = this.physics.add.sprite(30,30,"frog");
player. setCollideWorldBounds(true);
this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("frog", {start: 0, end: 3}),
    frameRate: 10,
    repeat:-1
});


