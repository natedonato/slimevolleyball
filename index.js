class Game{
    constructor(ctx, canvas){
        this.ctx = ctx;
        this.canvas = canvas;
        this.keys = {};
        this.gravity = 1;

        
        this.floorLevel = canvas.height - 15;
        this.slimeRadius = 40;
        this.ballRadius = 25;
        this.bgColor = 'rgb(135, 206, 250)';

        this.player1 = new Slime(this.slimeRadius, 40, this.floorLevel, "blue" );
        this.player2 = new Slime(this.slimeRadius, canvas.width - 40, this.floorLevel);
        this.ball = new Ball(this.ballRadius, canvas.width / 2, canvas.height / 2, "green");

        this.bindKeys();
        this.spawnBall();
        this.update = this.update.bind(this);
        this.update();
    }

    
    bindKeys() {
        let game = this;
        window.addEventListener("keydown", function (e) {
            if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 13) {
                e.preventDefault();
            }
            game.keys[e.keyCode] = true;
        });

        window.addEventListener("keyup", function (e) {
            game.keys[e.keyCode] = false;
        });
    }

    spawnBall(left = Math.random() < 0.5){
        
        if(left === true){
            this.ball.pos.x = this.player1.pos.x;
            this.ball.pos.y = this.player1.pos.y - 200;
        }else{
            this.ball.pos.x = this.player2.pos.x;
            this.ball.pos.y = this.player2.pos.y - 200;}
        
    }

    handleKeys(){
        if(this.keys[37]){
            this.player1.moveLeft();
        }
        if(this.keys[39]){
            this.player1.moveRight();
        }
        if(this.keys[38]){
            this.player1.jump();
        }
        if(this.keys[80]){
            debugger;
        }
    }


    draw(){
        this.drawBackground();
        this.drawFloor();
        this.drawSlime(this.player1);
        this.drawSlime(this.player2);
        this.drawBall();
    }

    drawBackground(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawFloor(){
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, this.floorLevel, this.canvas.width, 15);

    }

    drawSlime(slime){
        this.ctx.fillStyle = slime.color;
        this.ctx.beginPath();
        this.ctx.arc(slime.pos.x, slime.pos.y + slime.radius, slime.radius, 0, Math.PI, true);
        this.ctx.fill();
        this.ctx.fillStyle = "#000000";
        this.ctx.stroke();
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(slime.pos.x, slime.pos.y, 2, 2);
    }

    drawBall(){
        this.ctx.fillStyle = this.ball.color;
        this.ctx.beginPath();
        this.ctx.arc(this.ball.pos.x, this.ball.pos.y + this.ball.radius, this.ball.radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(this.ball.pos.x, this.ball.pos.y, 2, 2);

    }

    updatePositions(){
        this.updateSlimePosition(this.player1);
        if(this.player1.pos.x < 0 + this.player1.radius){this.player1.pos.x = this.player1.radius;}
        this.updateSlimePosition(this.player2);

        this.detectBallCollision(this.player1);
        this.detectBallCollision(this.player2);

        this.updateBallPosition();
    }

    updateBallPosition(){
        this.ball.pos.x += this.ball.vel.x;
        this.ball.pos.y += this.ball.vel.y;
        if(this.ball.pos.y > this.floorLevel - 2 * this.ballRadius) {
            this.ball.pos.y = this.floorLevel - 2 * this.ballRadius;
            this.ball.vel.y = -this.ball.vel.y;
        }
        if(this.ball.pos.x < 0 + this.ballRadius){
            this.ball.pos.x = this.ballRadius;
            this.ball.vel.x = -this.ball.vel.x;
        }
        if (this.ball.pos.x > this.canvas.width - this.ballRadius) { 
            this.ball.pos.x = this.canvas.width - this.ballRadius;
            this.ball.vel.x = -this.ball.vel.x;
        }


        this.ball.vel.y += this.gravity;

    }

    updateSlimePosition(slime){
        if(slime.vel.x > slime.maxSpeed){slime.vel.x = slime.maxSpeed;}
        if(slime.vel.x < -slime.maxSpeed){slime.vel.x = -slime.maxSpeed;}
        slime.pos.x += slime.vel.x;
        slime.pos.y += slime.vel.y;
        slime.vel.x *= 0.68;
        if(slime.pos.y > 245){
            slime.pos.y = 245;
            slime.grounded = true;
        }
        if(!slime.grounded){slime.vel.y += this.gravity;}

    }

    rotate(vel,  angle) {
        
    const rotatedVelocities = {
        x: vel.x * Math.cos(angle) - vel.y * Math.sin(angle),
        y: vel.x * Math.sin(angle) + vel.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

    resolveCollision(particle, otherParticle) {
        

    const xvelDiff = particle.vel.x - otherParticle.vel.x;
    const yvelDiff = particle.vel.y - otherParticle.vel.y;

    const xDist = otherParticle.pos.x - particle.pos.x;
    const yDist = otherParticle.pos.y - particle.pos.y;

    // Prevent accidental overlap of particles
    if (xvelDiff * xDist + yvelDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.pos.y - particle.pos.y, otherParticle.pos.x - particle.pos.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // vel before equation
        const u1 = this.rotate(particle.vel, angle);
        const u2 = this.rotate(otherParticle.vel, angle);

        // vel after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final vel after rotating axis back to original location
        const vFinal1 = this.rotate(v1, -angle);
        const vFinal2 = this.rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.vel.x = vFinal1.x;
        particle.vel.y = vFinal1.y;

        otherParticle.vel.x = vFinal2.x;
        otherParticle.vel.y = vFinal2.y;
        }
    }
    detectBallCollision(slime){
        let dx = slime.pos.x - this.ball.pos.x;
        let dy = slime.pos.y - this.ball.pos.y;  
        let radii = slime.radius + this.ballRadius;

        if (((dx * dx) + (dy * dy)) < (radii * radii)) {

            this.resolveCollision(slime, this.ball);

        }

    }

    update(){
        this.handleKeys();
        this.updatePositions();
        this.draw();
        window.requestAnimationFrame(this.update);
    }

}

class MovingObject{
    constructor(radius, x, y, color = "red") {
        this.radius = radius;
        this.pos = {
            x: x,
            y: y
        };

        this.vel = {
            x: 0,
            y: 0
        };
        this.color = color;

        this.mass = 1;
    }
}

class Slime extends MovingObject{
    constructor(radius, x, y, color = "red"){
        super(radius, x, y - radius, color);
        this.grounded = true;
        this.maxSpeed = 10;
    }

    moveLeft(){
        this.vel.x -= 2;        
    }

    moveRight(){
        this.vel.x+= 2;
    }

    jump(){
        if(this.pos.y === 245){
            this.vel.y = -12;
            this.grounded = false;
        }
    }


}

class Ball extends MovingObject{
    constructor(radius, x, y, color){
        super(radius, x, y, color);
    }
}





document.addEventListener("DOMContentLoaded", () =>{
    const canvas = document.getElementById("gameCanvas")
    const ctx = canvas.getContext("2d");
    canvas.width = 640;
    canvas.height = 300;

    const game = new Game(ctx, canvas);
});


