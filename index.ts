// Connect canvas element and make it take up the entire screen
const canvas = <HTMLCanvasElement>document.getElementById("canvas"); // Canvas element
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create context
const ctx = <CanvasRenderingContext2D>canvas.getContext("2d"); // Context

// Interphase for Player, Projectiles, and Asteroids to implement
interface StartingParameters {
    xloc: number;
    yloc: number;
    color: string;
    xvel: number;
    yvel: number;

    draw(): void;
    update(): void;
}

class Player implements StartingParameters {
    xloc: number;
    yloc: number;
    color: string;
    xvel: number;
    yvel: number;
    ctx: CanvasRenderingContext2D;
    rotation: number;
    constructor({ xloc, yloc }: { xloc: number, yloc: number }, color: string, ctx: CanvasRenderingContext2D, { xvel, yvel }: { xvel: number, yvel: number }) {
        this.xloc = xloc;
        this.yloc = yloc;
        this.color = color;
        this.xvel = xvel;
        this.yvel = yvel;
        this.ctx = ctx;
        this.rotation = 0;
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.xloc, this.yloc);
        this.ctx.rotate(this.rotation);
        this.ctx.translate(-this.xloc, -this.yloc);
        this.ctx.beginPath();
        this.ctx.moveTo(this.xloc + 30, this.yloc);
        this.ctx.lineTo(this.xloc - 10, this.yloc - 10);
        this.ctx.lineTo(this.xloc - 10, this.yloc + 10);
        this.ctx.closePath();

        this.ctx.strokeStyle = this.color;
        this.ctx.stroke();
        this.ctx.restore();
    };

    update() {
        this.draw()
        this.xloc += this.xvel;
        this.yloc += this.yvel;
    }

    public shoot(): void {

    }

}

class Projectile implements StartingParameters {
    xloc: number;
    yloc: number;
    color: string;
    xvel: number;
    yvel: number;
    ctx: CanvasRenderingContext2D;
    radius: number;

    constructor({ xloc, yloc }: { xloc: number, yloc: number }, color: string, ctx: CanvasRenderingContext2D, { xvel, yvel }: { xvel: number, yvel: number }) {
        this.xloc = xloc;
        this.yloc = yloc;
        this.color = color;
        this.ctx = ctx;
        this.xvel = xvel;
        this.yvel = yvel;
        this.radius = 5;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.xloc, this.yloc, this.radius, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fill();
    }

    update() {
        this.draw();
        this.xloc += this.xvel;
        this.yloc += this.yvel;
    }
}


// Spawning Player to the screen
const player: Player = new Player({ xloc: canvas.width / 2, yloc: canvas.height / 2 }, "white", ctx, { xvel: 0, yvel: 0 }); // Takes Location object, color, context, and Velocity objects as arguments
player.draw();

// Moving and Rotating Player

const keys = {
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    }
}

const SPEED: number = 3;
const ROTATIONAL_SPEED: number = 0.05;
const PROJECTILE_SPEED: number = 3;
const FRICTION: number = 0.97;

const projectiles: Projectile[] = [];

function animate(): void {
    window.requestAnimationFrame(animate);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    player.update();

    for (let i: number = projectiles.length - 1; i >= 0; i--) {
        const projectile: Projectile = projectiles[i];
        projectile.update();

        // Projectiles garbage collection.
        if (projectile.xloc + projectile.radius < 0 ||
            projectile.xloc - projectile.radius > canvas.width ||
            projectile.yloc - projectile.radius > canvas.height ||
            projectile.yloc + projectile.radius < 0) {
            projectiles.splice(i, 1);
        }
    }

    if (keys.w.pressed) {
        player.xvel = Math.cos(player.rotation) * SPEED;
        player.yvel = Math.sin(player.rotation) * SPEED;
    } else if (!keys.w.pressed) {
        player.xvel *= FRICTION;
        player.yvel *= FRICTION;
    }

    if (keys.d.pressed) player.rotation += ROTATIONAL_SPEED;

    else if (keys.a.pressed) player.rotation -= ROTATIONAL_SPEED;

};

animate();

window.addEventListener("keydown", (e) => {
    switch (e.code) {
        case "KeyW":
            keys.w.pressed = true;
            break
        case "KeyA":
            keys.a.pressed = true;
            break
        case "KeyD":
            keys.d.pressed = true;
            break
        case "Space":
            projectiles.push(new Projectile({ xloc: player.xloc + Math.cos(player.rotation) * 30, yloc: player.yloc + Math.sin(player.rotation) * 30 },
                "white",
                ctx,
                { xvel: Math.cos(player.rotation) * PROJECTILE_SPEED, yvel: Math.sin(player.rotation) * PROJECTILE_SPEED }))
            break
    }
});

window.addEventListener("keyup", (e) => {
    switch (e.code) {
        case "KeyW":
            keys.w.pressed = false;
            break
        case "KeyA":
            keys.a.pressed = false;
            break
        case "KeyD":
            keys.d.pressed = false;
            break
    }
});

window.addEventListener("click", () => {
    player.shoot();
})