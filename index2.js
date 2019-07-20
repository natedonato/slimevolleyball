document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas")
    const ctx = canvas.getContext("2d");
    canvas.width = 640;
    canvas.height = 300;

 
    
    const game = new Game(ctx, canvas);

});

class Game {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.keys = {};

        this.Engine = Matter.Engine;
        this.World = Matter.World;
        this.Bodies = Matter.Bodies;

        this.engine = this.Engine.create();
        this.world = this.engine.world;
        this.box1 = this.Bodies.rectangle(400, 200, 80, 80);
        this.World.add(this.world, this.box1);
        this.Engine.run(this.engine);
        
        this.update = this.update.bind(this);
        this.update();
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillRect(this.box1.position.x, this.box1.position.y, 80, 80);
        window.requestAnimationFrame(this.update);
    }
}
