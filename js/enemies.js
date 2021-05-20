const MAX_MOSCAS = 10;
const TIMER_RYTHM = 0.1*Phaser.Timer.SECOND;
const ALTURA_MOSCAS;
const PROBABILIDAD_TIPO_MOSCAS = 0.5;
let moscas;
let currentMoscaProbability = 0.2;
let currentMoscaVelocity = 50;

//Esto va en initialize game
createMoscas(MAX_MOSCAS);

//Esto va después
function createMoscas(number){
    moscas  = game.add.group();
    moscas.enableBody = true;
    moscas.createMultiple(number, "mosca");
    moscas.callAll("eventsOutOfBounds.add", "events.onOutOfBounds", resetMember);
    ufos.callAll("anchor.SetTo", "anchor", 0.5, 1.0);
    ufos.setAll("checkWorldBounds", true); 
}

//Activar una mosca
function activateMosca(){
    if(Math.random()< currentMoscaProbability){
        let mosca = moscas.getFirstExist(false);
        if(mosca){
            //Setea posición para que la mosca spawnee
            let mw = mosca.body.width;
            let z = mw / 2 + x;
            let otherMovement = Math.random()>PROBABILIDAD_TIPO_MOSCAS;
            mosca.reset(ALTURA_MOSCAS, z);
            //Setea velocidad en x y en y
            mosca.body.velocity.x = currentMoscaVelocity;
            mosca.body.velocity.y = 0;
            //Si la mosca tiene el movimiento alternativo subirá y bajará en función de su posición en x
            if(otherMovement){
                mosca.body.y += Math.sin(mosca.body.x);
            }
        }
    }
}

