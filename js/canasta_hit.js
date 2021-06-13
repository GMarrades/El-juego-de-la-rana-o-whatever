/*let fuego;
let canasta;
let scoreText;

game.load.image('canastita', 'assets/imgs/Canasta.png')
game.load.spritesheet('fireball', 'assets/imgs/FireBall.png')


    //añadir lengua como 'balas'
    fuego = game.add.group();
    fuego.enableBody = true;
    fuego.physicsBodyType = Phaser.Physics.ARCADE;

    fuego.createMultiple(1, 'fireball');
    fuego.setAll('checkWorldBounds', true);
    fuego.setAll('outOfBoundsKill', true);

    //añadir canasta/s
    canasta = game.add.sprite(800, 900, 'canastita');
    canasta2 = game.add.sprite(1352, 800-48, 'canastita');

    game.physics.arcade.enable([canasta, canasta2]);
    
    canasta.body.collideWorldBounds = true;
    canasta2.body.collideWorldBounds = true;
    canasta2.body.allowGravity = false;

    click_clack = 0;

    score = 0;
    crearHUD();

    //movimiento canasta2
    if(click_clack == 0){
        canasta2.x -= 1;  
    }
    if(click_clack == 1){
        canasta2.x += 1;
    }
    if(canasta2.x <= 1350){
        click_clack = 1;
    }
    if(canasta2.x >= 1435){
        click_clack = 0;
    }
    canasta2.y = 800-48;
    
    game.physics.arcade.collide(floor, canasta);
    game.physics.arcade.overlap(canasta, fuego, hitCanasta, null, this);
    game.physics.arcade.overlap(canasta2, fuego, hitCanasta, null, this);

    else if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        dispararFuego();
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

    function crearHUD(){
        let posX = 750;
        let posY = 900;
        let styleHUD = {fontsize: '5px', fill: '#FFFFFF'};
    
        scoreText = game.add.text(posX, posY, 'Score: '+score, styleHUD);
    }

//esto está hecho de tal forma que cuando la bola toque la primera canasta, ya no puedas volver a ganar puntos de ella
//igual con la siguiente
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
        click_clack = 2;
    }
}*/