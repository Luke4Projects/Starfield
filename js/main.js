/** @type{HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var timeSinceMouseClick;
var mouseDown;

function start() {
    mouseDown = false;
    timeSinceMouseClick = 0;
    canvasResize();
    setupStars();
    update();
} 

function update() {

    checkConfigVisibility();

    checkConfigChange();

    for(let i = 0; i < stars.length; i++) {
        stars[i].update();
    }

    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(rotation);
    for(let i = 0; i < stars.length; i++) {
        stars[i].draw();
    }

    ctx.resetTransform();
}

function checkConfigVisibility() {
    var div = document.getElementById("config_div")
    if(!mouseDown && timeSinceMouseClick > 300) {
        div.style.display = "none";
    } else {
        if(!div.matches(":hover")) {
            timeSinceMouseClick++;
        }
    }
}

function canvasResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function mouseDown() {
    mouseDown = true;
    document.getElementById("config_div").style.display = "block";
    timeSinceMouseClick = 0;
}

function mouseUp() {
    timeSinceMouseClick = 0;
    mouseDown = false;
}

document.body.onload = start;
document.body.onresize = canvasResize;

document.onmousedown = mouseDown;
document.onmouseup = mouseUp;