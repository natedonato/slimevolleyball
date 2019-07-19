class Game{
    constructor(ctx, canvas){
        this.ctx = ctx;
        this.canvas = canvas;
        this.slimeRadius = 40;
        this.player1 = new Slime(this.slimeRadius, 40, "blue" );
        this.player2 = new Slime(this.slimeRadius, canvas.width - 40);
        this.ball = new Ball(this.ballRadius, "green");

        this.update = this.update.bind(this);
        this.update();
    }





    draw(){
        this.drawSlime(this.player1);
        this.drawSlime(this.player2);

    }

    drawSlime(slime){
        this.ctx.fillRect(slime.pos.x, slime.pos.y, slime.radius, slime.radius);
    }


    update(){
        this.draw();
        console.log(this.player1);
        this.player1.pos.x += 1;
        window.requestAnimationFrame(this.update);
    }

}

class MovingObject{
    constructor(radius, x, color = "red") {
        this.radius = radius;
        this.pos = {
            x: x,
            y: 0
        };

        this.vel = {
            x: 0,
            y: 0
        };
        this.color = color;
    }
}

class Slime extends MovingObject{
    constructor(radius, color = "red"){
        super(radius, color);
    }

    jump(){
        if(this.pos.y === 0){
            this.vel.y = 15;
        }
    }


}

class Ball extends MovingObject{
    constructor(radius, color){
        super(radius, color);
    }
}





document.addEventListener("DOMContentLoaded", () =>{
    const canvas = document.getElementById("gameCanvas")
    const ctx = canvas.getContext("2d");
    canvas.width = 640;
    canvas.height = 300;

    const game = new Game(ctx, canvas);
});


