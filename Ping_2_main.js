const WIDTH=window.innerWidth-12,
HEIGHT=window.innerHeight-32,
paddleWidth=90,
paddleHeight=15;
const canvas=document.getElementById('canvas');
canvas.width=WIDTH;
canvas.height=HEIGHT;
canvas.style.background='white';
const context = canvas.getContext('2d');

var player=new Player();
var cpuPlayer=new CPUPlayer();
var ball= new Ball(WIDTH/2,HEIGHT/2,5);
var isLeft=false,
    isRight=false;
let scoreOne = 0;    
var globalID;
var Player_name="CPU";
localStorage.setItem("name",Player_name);
localStorage.setItem("High_score",0);

function drawGame(){
    player.drawPlayer();
    cpuPlayer.drawCPUPlayer();
    ball.drawBall();
}

function updateGame(){
    player.updatePlayer();
    cpuPlayer.updateCPUPlayer(ball);
    ball.updateBall(player.paddle,cpuPlayer.paddle);
    displayScoreOne();
}

document.addEventListener('keydown',(event)=>{
    if(event.keyCode == 37){
        isLeft = true;
        isRight = false;
    } else if(event.keyCode == 39){
        isLeft=false;
        isRight=true;
    }
});

document.addEventListener('keyup', function(event) {
    isLeft=false;
    isRight=false;
});

//player function
function Player(){
    this.paddle=new Paddle(WIDTH / 2 - paddleWidth / 2, HEIGHT - paddleHeight, paddleWidth, paddleHeight);
}

Player.prototype.drawPlayer=function(){
    this.paddle.drawPaddle();
};

Player.prototype.updatePlayer = function(){
    if(isLeft){
        this.paddle.updatePaddle(-4);
    }else if(isRight){
        this.paddle.updatePaddle(4);
    }
};


//Player  score text
function displayScoreOne(){
    context.font="18px Arial"
    context.fillStyle = 'black'
    context.fillText("Score: " + scoreOne,100, 300);
  }


// CPU player function
function CPUPlayer(){
   this.paddle=new Paddle(WIDTH / 2 - paddleWidth / 2, 0, paddleWidth, paddleHeight);
}

CPUPlayer.prototype.drawCPUPlayer=function(){
    this.paddle.drawPaddle();
};


CPUPlayer.prototype.updateCPUPlayer = function(ball) {
    // let diff = -(this.paddle.x + (this.paddle.width/2 - ball.x));
    // if (diff < 0 &&  diff < 4){
    //     diff = -10;
    // } else if (diff > 0 && diff > 4){
    //     diff = 10;  
    // }
    // this.paddle.updatePaddle(diff);
    if(isLeft){
        this.paddle.updatePaddle(-4);
    }else if(isRight){
        this.paddle.updatePaddle(4);
    }
    // this.paddle.x=player.paddle.x;

};

//   CPUPlayer.prototype.updateCPUPlayer = function() {
//     if(isLeft){
//         this.paddle.updatePaddle(-4);
//     }else if(isRight){
//         this.paddle.updatePaddle(4);
//     }
//   };

//paddle function
function Paddle(x , y , paddleWidth, paddleHeight){
    this.x = x;
    this.y = y;
    this.width = paddleWidth;
    this.height = paddleHeight;
    this.xDirSpeed = 0;
}

Paddle.prototype.drawPaddle=function(){
    context.beginPath();
    context.fillStyle="green";
    context.fillRect(this.x, this.y, this.width, this.height);
    context.closePath();
}


Paddle.prototype.updatePaddle=function(x){
    this.x += x;
    this.xDirSpeed = x;
    if(this.x < 0){
        this.x = 0;
        this.xDirSpeed = 0;
    }else if((this.x + this.width) > WIDTH){
        this.x = WIDTH - this.width;
        this.xDirSpeed = 0;
    }
};
 
//Ball function
function Ball(x,y,radius){
    this.x=x;
    this.y=y;
    this.radius=radius;
    this.xDirSpeed=Math.random()<0.5?(Math.floor(Math.random()*3)+1):-(Math.floor(Math.random()*3)+1);
    this.yDirSpeed=Math.random()<0.5?(Math.floor(Math.random()*3)+1):-(Math.floor(Math.random()*3)+1);
}

Ball.prototype.drawBall=function(){
    context.beginPath();
    context.fillStyle="#FF0C00";
    context.arc(this.x,this.y,this.radius,0,2*Math.PI);
    context.fill();
    context.closePath();
};

Ball.prototype.updateBall=function(playerPaddle,cpuPaddle){
    this.x+=this.xDirSpeed;
    this.y+=this.yDirSpeed;

    //check if the Ball hits right side or left side of canvas
    if((this.x-this.radius)<0){
        this.xDirSpeed=-this.xDirSpeed;
    }else if((this.x+this.radius)>WIDTH){
        this.xDirSpeed = -this.xDirSpeed;
    }

    //check if ball has hit the paddle
    if((this.x+this.radius)>playerPaddle.x && (this.x-this.radius)<(playerPaddle.x+playerPaddle.width) &&
    (this.y+this.radius)>(HEIGHT-paddleHeight)){
        scoreOne+=1;
        this.xDirSpeed += playerPaddle.xDirSpeed/2;
        this.yDirSpeed = -this.yDirSpeed;
        this.y+=this.yDirSpeed;
    }else if((this.x+this.radius)>cpuPaddle.x && (this.x-this.radius)<(cpuPaddle.x+cpuPaddle.width) &&
    (this.y-this.radius)<(paddleHeight)){
        this.xDirSpeed += playerPaddle.xDirSpeed/2;
        this.yDirSpeed = -this.yDirSpeed;
        this.y += this.yDirSpeed;
    }

    //check if ball has missed to hit the paddle
    if(((this.x+this.radius)<playerPaddle.x) || ((this.x-this.radius)>(playerPaddle.x+playerPaddle.width))){
        if((this.y+this.radius)>HEIGHT){
            // scoreOne=0;
            // console.log("CPU player has won the game");
            
            if(scoreOne>localStorage.getItem("High_score")){
                localStorage.setItem("High_score",scoreOne);
                alert("Congratulations you have a new high score"+"\n"+
                "Press enter to restart the game");  
                //scoreOne=0;              
            }
            else{
                
                let text="\n GAME OVER \nPress Enter to restart the game";
                alert("Player name :"+localStorage.getItem("name")+"\n"+"HighScore : "+localStorage.getItem("High_score")+text);
            }
            scoreOne=0;
            cancelAnimationFrame(globalID);
            this.x=playerPaddle.x+(playerPaddle.width/2);
            this.y=playerPaddle.y-5;
            // this.xDirSpeed=Math.random()<0.5?(Math.floor(Math.random()*3)+1):-(Math.floor(Math.random()*3)+1);
            // this.yDirSpeed=Math.random()<0.5?(Math.floor(Math.random()*3)+1):-(Math.floor(Math.random()*3)+1);
            this.xDirSpeed=2;
            this.yDirSpeed=2;

        }
    }else if((this.y-this.radius)<=0){
            console.log(this.y-this.radius,canvas.height);
            if(scoreOne>localStorage.getItem("High_score")){
                localStorage.setItem("High_score",scoreOne);
                alert("Congratulations you have a new high score"+"\n"+
                "Press enter to restart the game");  
                //scoreOne=0;              
            }
            else{
                
                let text="\n GAME OVER \nPress Enter to restart the game";
                alert("Player name :"+localStorage.getItem("name")+"\n"+"HighScore : "+localStorage.getItem("High_score")+text);
            }
            scoreOne=0;
            cancelAnimationFrame(globalID);
            this.x=WIDTH/2;
            this.y=HEIGHT/2;
            this.xDirSpeed=2;
            this.yDirSpeed=2;
            
    }   
    // }else if(((this.x+this.radius)<cpuPaddle.x) || ((this.x-this.radius)>(cpuPaddle.x+cpuPaddle.width))){
    //     if((this.y - this.radius) <cpuPaddle.height){
    //         alert("gameover");
    //         scoreOne=0;
    //         console.log("playerOne has won the game");
    //         return;
    //         // this.x=playerPaddle.x+(playerPaddle.width/2);
    //         // this.y=playerPaddle.y-5;
    //         // this.xDirSpeed=Math.random()<0.5?(Math.floor(Math.random()*3)+1):-(Math.floor(Math.random()*3)+1);
    //         // this.yDirSpeed=Math.random()<0.5?(Math.floor(Math.random()*3)+1):-(Math.floor(Math.random()*3)+1);
    //     }
    // }
};

 
 function loop(){
    context.clearRect(0,0,WIDTH,HEIGHT);
    drawGame();
    updateGame();
     
    // window.requestAnimationFrame(loop);
    globalID = requestAnimationFrame(loop);
 }

function Enter_the_game(){
    alert("Player name: "+localStorage.getItem("name")+"\n"+ 
        "High Score: "+localStorage.getItem("High_score")+"\n"
         +"Press Enter to continue");
    Player_name = prompt("Please enter your name:", "Harry");
    localStorage.setItem("name",Player_name);
    loop();
}
Enter_the_game();
