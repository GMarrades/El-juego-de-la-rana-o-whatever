player = this.physics.add.sprite(30,30,"frog");
player. setCollideWorldBounds(true);
this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("frog", {start: 0, end: 3}),
    frameRate: 10,
    repeat:-1
});