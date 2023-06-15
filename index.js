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
    Player.prototype.shoot = function () {
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
    };
    Projectile.prototype.update = function () {
        this.draw();
        this.xloc += this.xvel;
        this.yloc += this.yvel;
    };
    return Projectile;
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
function animate() {
    window.requestAnimationFrame(animate);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    for (var i = projectiles.length - 1; i >= 0; i--) {
        var projectile = projectiles[i];
        projectile.update();
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
window.addEventListener("click", function () {
    player.shoot();
});
