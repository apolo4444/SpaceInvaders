var BLOCKS=15*6;
var activate=false;
var gameOver=false;

GamePlayManager={

    init: function(){
        game.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally=true;
       game.scale.pageAlignVertically=true;

       this.score=0;
       this.x=0;
       this.y=40;
       this.lives=3;
       this.speed=100;
       this.ballX=this.speed*0.03;
       this.ballY=this.speed*0.03;
       this.break=BLOCKS;
//Agregado mio
       this.rows=6
       this.columns=15;
       this.fps=60;
       this.alienDirection=1;
       this.alienSpeed=this.speed*(1/this.fps)*this.alienDirection;
       this.scene=0;
       this.bulletsCount=0;
       this.flagFirstMouseDown=false;
       this.isAttack=false;
       this.alienBulletsCount=0;
       

    },

    preload:function(){
       this.preloadImages();
       this.preloadSounds();
   
    },

    preloadImages:function(){
        game.load.image("ball","./SRC/IMAGES/shot1.svg");
        game.load.image("ship","./SRC/IMAGES/SpaceShip.svg")
        game.load.image("alien","./SRC/IMAGES/Alien.svg")
        game.load.image("shot1","./SRC/IMAGES/Shot1.svg")
        game.load.image("shot2","./SRC/IMAGES/Shot2.svg")
        game.load.image("win","./SRC/IMAGES/win.png")
        game.load.image("start","./SRC/IMAGES/start.png")
        game.load.image("lose","./SRC/IMAGES/lose.png")

    },

    preloadSounds:function(){
        game.load.audio("audio","./SRC/SOUNDS/Audio_3_.mp3");
        game.load.audio("music","./SRC/SOUNDS/music.wav");
        game.load.audio("kill","./SRC/SOUNDS/kill.wav");
        game.load.audio("kill2","./SRC/SOUNDS/kill2.wav");
        game.load.audio("shot","./SRC/SOUNDS/empty-block.wav");
        game.load.audio("pickup","./SRC/SOUNDS/pickup.wav");
        game.load.audio("win","./SRC/SOUNDS/powerup-reveal.wav");

    },

    gamePanel:function(){
        var screen = game.add.bitmapData(game.width, game.height);
        screen.ctx.fillStyle = '#FF00FF';
        screen.ctx.fillRect(0,0,game.width, game.height);

        var bg = game.add.sprite(0,0,screen);
        bg.alpha = 1;

        return bg;
    },
    showFinalMessage:function(msg){
        
        var style = {
            font: 'bold 60pt Arial',
            fill: '#FFFFFF',
            align: 'center'
          }
        //Crea un bitmap con el texto
        var bgAlpha = game.add.bitmapData(game.width, game.height);
        bgAlpha.ctx.fillStyle = '#000000';
        bgAlpha.ctx.fillRect(0,0,game.width, game.height);
        bgAlpha.ctx.font="60px Arial";
        bgAlpha.ctx.fillStyle="#FFFFFF";
        bgAlpha.ctx.fillText(msg,game.width/4, game.height/2);
    
        //Crea un sprite con el bitmap
        var bg = game.add.sprite(0,0,bgAlpha);
        bg.alpha = 0.5;
       
        
       return bg;
  
    },
    onTap: function(){

        if(!this.flagFirstMouseDown){
            //this.tweenMollusk = game.add.tween(this.mollusk.position).to( {y: -0.001}, 5800, Phaser.Easing.Cubic.InOut, true, 0, 1000, true).loop(true);
            this.flagFirstMouseDown=true;
            this.activate=true;
            
        }else{
            //this.flagFirstMouseDown=false;
           // if(!this.isAttack){
                this.shot();
                this.isAttack=true;
            //}
            
           
        }

        
        /* if(!activate){
            activate=true;
        }else{
            activate=false;
        } */
    },
    create:function(){
      switch(this.scene){
        case 0:
            this.levelScene();
            break;
        case 1:
            this.winScene();
            break;
        case 2:
            this.loseScene();
            break;
        default:
            break;

      }

    },

    levelScene:function(){
          //this.screen=this.gamePanel();
          this.screen=game.add.sprite(0,0,"start");
          this.screen.scale.setTo(1,0.60);
          this.racket=game.add.sprite(0,0,"ship");
          this.racket.anchor.setTo(0.5,0.5);
          this.racket.scale.setTo(0.25,0.25)
          this.racket.x=game.width/2;
          this.racket.y=game.height-this.racket.width/2;
          this.bullets=[];
          this.blocks=[];

        //Disparos de los aliens
            this.alienBullets=[];  
  
          let count=0
          for(let i=0;i<BLOCKS;i++){
              count++;
              var block=game.add.sprite(this.x+25,this.y,"alien");
              block.scale.setTo(0.25,0.25);
              this.blocks[i]=block;
              if(count%this.columns==0){
                  this.x=0;
                  this.y+=this.blocks[i].height;
              }else{
                  this.x+=this.blocks[i].width;
              }
          }
  
         
  
          game.input.onDown.add(this.onTap,this);
  
          this.loop=game.sound.add("music");
          this.loop.play();
  
          //Texto del puntaje
          this.currentScore = 0;
          var style = {
              font: 'bold 30pt Arial',
              fill: '#FFFFFF',
              align: 'center'
            }
          
          this.scoreText = game.add.text(game.width/2, 20, '0', style);
          this.scoreText.anchor.setTo(0.5);
  
          this.livesText=game.add.text(20,20,this.lives, style);
          this.livesText.anchor.setTo(0.5);
    }, 

    winScene:function(){
        this.screen=game.add.sprite(0,0,"win")
        this.screen.scale.setTo(0.75,0.75);
    },

    loseScene:function(){
        this.screen=game.add.sprite(0,0,"lose")
        this.screen.scale.setTo(0.75,0.75);
    },

    increaseScore:function(){
        //cambia el sprite del caballo cuando agarra un diamante durante un tiempo determinado
        this.currentScore+=100;
        this.scoreText.text = this.currentScore;

    },

    getBoundsBlock: function(currentDiamond){
        //Devuelve un rectangulo con las mismas dimenciones que los sprites
        return new Phaser.Rectangle(currentDiamond.left,currentDiamond.top,currentDiamond.width,currentDiamond.height);

    },

    isRectanglesOverlapping: function(rect1, rect2) {
        if(rect1.x> rect2.x+rect2.width || rect2.x> rect1.x+rect1.width){
            return false;
        }
        if(rect1.y> rect2.y+rect2.height || rect2.y> rect1.y+rect1.height){
            return false;
        }
        return true;
    },

    isOverlapingOtherBlock:function(index, rect2){
        for(var i=0; i<index; i++){
            var rect1 = this.getBoundsDiamond(this.diamonds[i]);
            if(this.isRectanglesOverlapping(rect1, rect2)){
                return true;
            }
        }
        return false;
    },

    racketMove:function(){
        var pointerX=game.input.x;
        var distX=pointerX-this.racket.x;
        //this.racket.x+=distX*0.03;
        this.racket.x+=distX;
    },

    shot:function(){
        this.playMusic("shot")
        this.ball=game.add.sprite(0,0,"ball");
        this.ball.anchor.setTo(0.5,0.5);
        this.bullets[this.bulletsCount]=this.ball;
        this.ball.x=this.racket.x;
        this.ball.y=this.racket.y;
        this.bulletsCount++;
    },

    ballMove:function(ball){
        var rectBall=this.getBoundsBlock(ball);
       
        if (ball.visible){
            for(let i=0;i<BLOCKS;i++){
                let rectBlock=this.getBoundsBlock(this.blocks[i]);
                if(this.blocks[i].visible&&this.isRectanglesOverlapping(rectBall,rectBlock)){
                    this.increaseScore();
                    this.break--;
                    this.blocks[i].visible=false;
                    this.blocks[i]="";
                    //this.ballY=-(game.rnd.integerInRange(50,100)*0.03);
                    // this.ballY=-(this.ballY);
                    // this.ballX=-(game.rnd.integerInRange(50,100)*0.03);
                   ball.visible=false;
                    ball.x=this.racket.x;
                    ball.y=this.racket.y;
                    //this.isAttack=false;

                    ball="";
                    
                    this.playMusic("kill2");
                }
    
            }
        }
        
        if(ball.y<=0){
            ball.visible=false;
            ball.x=this.racket.x;
            ball.y=this.racket.y;
            //this.isAttack=false;
        }    

        //ball.x+=this.ballX;
        //ball.y+=this.ballY;
        if (ball.visible){
            ball.y-=this.speed*(1/this.fps)
        }
       

    },

    shotMove:function(ball){
        var rectBall=this.getBoundsBlock(ball);
        var rectRacket=this.getBoundsBlock(this.racket);
        
        if (ball.visible){
            if(!this.gameOver){
            if(this.isRectanglesOverlapping(rectBall,rectRacket)){
                ball="";
                this.gameOver=true;
                this.scene=2;
                this.playMusic("kill");
                this.create();
                this.activate=false;
            } 
        }   
        } 

        if(ball.y>=this.height){
            ball.visible=false;
           ball="";
            //this.isAttack=false;
        }   

        if (ball.visible){
            ball.y+=this.speed*(1/this.fps)
        }
       

    },

    aliensMove:function(){

        this.randomNumber=game.rnd.integerInRange(0,4000);
        //this.randomNumber=game.rnd.integerInRange(0,this.break*100);
        for(let i=0;i<BLOCKS;i++){
           this.blocks[i].x+=this.alienSpeed;
            if(this.blocks[i].x+this.alienSpeed<=0||this.blocks[i].x+this.alienSpeed>=this.game.width){
                 this.alienDirection*=-1;
                this.aliensDown();
            }
            this.alienSpeed=this.speed*(1/this.fps)*this.alienDirection;

            let rectBlock=this.getBoundsBlock(this.blocks[i]);
            var rectRacket=this.getBoundsBlock(this.racket);
            if(!this.gameOver){
                if(this.isRectanglesOverlapping(rectBlock,rectRacket)){
                    this.gameOver=true;
                    this.scene=2;
                    this.playMusic("kill");
                    this.create();
                    this.activate=false;
                   
                }
            }

            if(i==this.randomNumber){
                this.aliensAttacks(this.blocks[i]);
            }
           
        }

        
    },
    aliensDown:function(){
        for(let i=0;i<BLOCKS;i++){
                 this.blocks[i].y+=this.blocks[i].height/5;
             }
    },

    aliensAttacks:function(alien){
        this.playMusic("shot")
        this.shot2=game.add.sprite(0,0,"shot2");
        this.shot2.anchor.setTo(0.5,0.5);
        this.alienBullets[this.alienBulletsCount]=this.shot2;
        this.shot2.x=alien.x;
        this.shot2.y=alien.y;
        this.alienBulletsCount++;
    },

    playMusic:function(audio){
        this.music=game.sound.add(audio);
        this.music.play();
    },

    update:function(){
        if(!this.gameOver){
            if(this.activate){
                this.racketMove();
                if(this.bullets.length!=0){
                    for(let i=0;i<this.bullets.length;i++){
                        this.ballMove(this.bullets[i]);
                    }
                    
                }
               
                this.aliensMove();

                if(this.alienBullets.length!=0){
                    for(let i=0;i<this.alienBullets.length;i++){
                        this.shotMove(this.alienBullets[i]);
                    }
                    
                }
                
            }

            if(this.break<=0){
                this.break=BLOCKS;
                this.activate=false;
                this.scene=1;
                this.playMusic("win");
                this.create();
    
            }
        }
        
    }

}

var game= new Phaser.Game(640,480,Phaser.AUTO);
game.state.add("gameplay",GamePlayManager);
game.state.start("gameplay");