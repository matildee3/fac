// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

// Adjust canvas size to fit the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Update canvas size on window resize
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    reset();
});

// Subject
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/monster.png";

// Flowers
var monsterImages = [];
var monsterImageIndex = 0;

var monsterImagePaths = [];
for (var i = 1; i <= 14; i++) {
    monsterImagePaths.push("images/ff/f" + i + ".png");
}

var imagesToLoad = monsterImagePaths.length;
var imagesLoaded = 0;

monsterImagePaths.forEach(function (path) {
    var img = new Image();
    img.onload = function () {
        imagesLoaded++;
        if (imagesLoaded === imagesToLoad) {
            reset();
            main();
        }
    };
    img.src = path;
    monsterImages.push(img);
});

// Game objects
var hero = {
    speed: 256 // movement in pixels per second
};
var monster = {};
var monstersCaught = 0;

// Message to display
var message = "Buon compleanno Fac <3";
var messageToShow = "";

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a flower
var reset = function () {
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

    // Throw the flower somewhere on the screen randomly
    monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 32 + (Math.random() * (canvas.height - 64));

    // Select a random flower image
    monsterImageIndex = Math.floor(Math.random() * monsterImages.length);
};

// Update game objects
var update = function (modifier) {
    if (38 in keysDown) { // Player holding up
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown) { // Player holding down
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown) { // Player holding left
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown) { // Player holding right
        hero.x += hero.speed * modifier;
    }

    // Ensure hero stays within the canvas boundaries
    if (hero.x < 0) hero.x = 0;
    if (hero.x > canvas.width - 32) hero.x = canvas.width - 32;
    if (hero.y < 0) hero.y = 0;
    if (hero.y > canvas.height - 32) hero.y = canvas.height - 32;

    // Are they touching?
    if (
        hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) {
        ++monstersCaught;
        if (monstersCaught <= message.length) {
            messageToShow = message.substr(0, monstersCaught);
        }
        reset();
    }
};

// Draw everything
var render = function () {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterImages.length > 0) {
        ctx.drawImage(monsterImages[monsterImageIndex], monster.x, monster.y);
    }

    // Score
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(messageToShow, canvas.width / 2, canvas.height / 2);
};

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
