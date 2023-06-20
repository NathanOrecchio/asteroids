// Connect canvas element and make it take up the entire screen
var canvas = document.getElementById("canvas"); // Canvas element
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Create context
var ctx = canvas.getContext("2d"); // Context
var Player = /** @class */ (function () {
    function Player(_a, color, ctx, _b) {
        var xloc = _a.xloc, yloc = _a.yloc;
        var xvel = _b.xvel, yvel = _b.yvel;
        this.xloc = xloc;
        this.yloc = yloc;
        this.color = color;
        this.xvel = xvel;
        this.yvel = yvel;
        this.ctx = ctx;
        this.rotation = 0;
    }
    Player.prototype.draw = function () {
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
    ;
    Player.prototype.update = function () {
        this.draw();
        this.xloc += this.xvel;
        this.yloc += this.yvel;
    };
    return Player;
}());
var Projectile = /** @class */ (function () {
    function Projectile(_a, color, ctx, _b) {
        var xloc = _a.xloc, yloc = _a.yloc;
        var xvel = _b.xvel, yvel = _b.yvel;
        this.xloc = xloc;
        this.yloc = yloc;
        this.color = color;
        this.ctx = ctx;
        this.xvel = xvel;
        this.yvel = yvel;
        this.radius = 5;
    }
    Projectile.prototype.draw = function () {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.xloc, this.yloc, this.radius, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.closePath();
    };
    Projectile.prototype.update = function () {
        this.draw();
        this.xloc += this.xvel;
        this.yloc += this.yvel;
    };
    return Projectile;
}());
var Asteroid = /** @class */ (function () {
    function Asteroid(_a, color, ctx, _b, radius) {
        var xloc = _a.xloc, yloc = _a.yloc;
        var xvel = _b.xvel, yvel = _b.yvel;
        this.xloc = xloc;
        this.yloc = yloc;
        this.color = color;
        this.ctx = ctx;
        this.xvel = xvel;
        this.yvel = yvel;
        this.radius = radius;
    }
    Asteroid.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.xloc, this.yloc, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();
    };
    Asteroid.prototype.update = function () {
        this.draw();
        this.xloc += this.xvel;
        this.yloc += this.yvel;
    };
    return Asteroid;
}());
// Spawning Player to the screen
var player = new Player({ xloc: canvas.width / 2, yloc: canvas.height / 2 }, "white", ctx, { xvel: 0, yvel: 0 }); // Takes Location object, color, context, and Velocity objects as arguments
player.draw();
// Moving and Rotating Player
var keys = {
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    }
};
var SPEED = 3;
var ROTATIONAL_SPEED = 0.05;
var PROJECTILE_SPEED = 3;
var FRICTION = 0.97;
var projectiles = [];
var asteroids = [];
window.setInterval(function () {
    var index = Math.floor(Math.random() * 4);
    var x, y;
    var velx, vely;
    var radius = 50 * Math.random() + 10;
    try {
        switch (index) { // Where to spawn Asteroids
            case 0: // left of screen
                x = 0 - radius;
                y = Math.random() * canvas.height;
                velx = 1;
                vely = 0;
                break;
            case 1: // bottom of screen
                x = Math.random() * canvas.width;
                y = canvas.height + radius;
                velx = 0;
                vely = -1;
                break;
            case 2: // right of screen
                x = canvas.width + radius;
                y = Math.random() * canvas.height;
                velx = -1;
                vely = 0;
                break;
            case 3: // top of screen
                x = Math.random() * canvas.width;
                y = 0 - radius;
                velx = 0;
                vely = 1;
                break;
        }
    }
    catch (error) {
        console.log(error);
    }
    finally {
        asteroids.push(new Asteroid({ xloc: x, yloc: y }, "white", ctx, { xvel: velx, yvel: vely }, radius));
    }
}, 3000);
function animate() {
    window.requestAnimationFrame(animate);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    for (var i = projectiles.length - 1; i >= 0; i--) {
        var projectile = projectiles[i];
        projectile.update();
        // Projectiles garbage collection.
        if (projectile.xloc + projectile.radius < 0 ||
            projectile.xloc - projectile.radius > canvas.width ||
            projectile.yloc - projectile.radius > canvas.height ||
            projectile.yloc + projectile.radius < 0) {
            projectiles.splice(i, 1);
        }
    }
    for (var i = asteroids.length - 1; i >= 0; i--) {
        var asteroid = asteroids[i];
        asteroid.update();
        // Asteroid garbage collection.
        if (asteroid.xloc + asteroid.radius < 0 ||
            asteroid.xloc - asteroid.radius > canvas.width ||
            asteroid.yloc - asteroid.radius > canvas.height ||
            asteroid.yloc + asteroid.radius < 0) {
            asteroids.splice(i, 1);
        }
    }
    if (keys.w.pressed) {
        player.xvel = Math.cos(player.rotation) * SPEED;
        player.yvel = Math.sin(player.rotation) * SPEED;
    }
    else if (!keys.w.pressed) {
        player.xvel *= FRICTION;
        player.yvel *= FRICTION;
    }
    if (keys.d.pressed)
        player.rotation += ROTATIONAL_SPEED;
    else if (keys.a.pressed)
        player.rotation -= ROTATIONAL_SPEED;
}
;
animate();
window.addEventListener("keydown", function (e) {
    switch (e.code) {
        case "KeyW":
            keys.w.pressed = true;
            break;
        case "KeyA":
            keys.a.pressed = true;
            break;
        case "KeyD":
            keys.d.pressed = true;
            break;
        case "Space":
            projectiles.push(new Projectile({ xloc: player.xloc + Math.cos(player.rotation) * 30, yloc: player.yloc + Math.sin(player.rotation) * 30 }, "white", ctx, { xvel: Math.cos(player.rotation) * PROJECTILE_SPEED, yvel: Math.sin(player.rotation) * PROJECTILE_SPEED }));
            break;
    }
});
window.addEventListener("keyup", function (e) {
    switch (e.code) {
        case "KeyW":
            keys.w.pressed = false;
            break;
        case "KeyA":
            keys.a.pressed = false;
            break;
        case "KeyD":
            keys.d.pressed = false;
            break;
    }
});
