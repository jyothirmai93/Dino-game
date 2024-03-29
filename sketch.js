//creating global variables to use in entire code.
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;
var jumpSound , checkPointSound, dieSound;

localStorage["HighestScore"] = 0;

function preload(){
  //loading all images or animations.
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")

}

function setup() {
  createCanvas(600, 200);
  
  //creating dino sprite - playing char
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  //creating ground
  ground = createSprite(300,180,600,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);

  //creting other invisible ground
  invisibleGround = createSprite(300,190,600,10);
  invisibleGround.visible = false;

  //game end sprites
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  restart = createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;
  
  //creating groups
  cloudsGroup = createGroup();
  obstaclesGroup = new Group();
  
  score = 0;

  //trex.debug = true;
  //trex.setCollider("rectangle", 0, 0, 100, 100);

}

function draw() {
  //background color to give color, also to stop duplicates
  background('lightgreen');

  //Displaying score
  text("Score: "+ score, 500,30);
  fill('red');
  textStyle(ITALIC);
  text("high score:"+localStorage["HighestScore"], 30, 30)

  //Gamestarts
  if (gameState===PLAY){

    //dino jumping
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
      jumpSound.play();
    }
    //dino gravity
    trex.velocityY = trex.velocityY + 0.8;
    //for dino standing
    trex.collide(invisibleGround);

    //creating infinite screen- ground
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    //creating other objects- NPC
    spawnClouds();
    spawnObstacles();

    //score calculation 
    score = score + Math.round(getFrameRate()/60);
    //score sound
    if(score>0 && score%100 === 0){
      checkPointSound.play() 
    }
    //game adaptivity with score
    ground.velocityX = -(6 + 3*score/100);

    //ending rule
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play()
    }

  }
  //GameEnds & thier aspects
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  //we need sprites in all states of this game.
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log("Highest Score is:");
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}