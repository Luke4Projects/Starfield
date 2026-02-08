class Star {
    constructor() {
        let angle = Math.random() * Math.PI * 2;    
        this.x = Math.cos(angle) * (Math.random() * 0.95 + 0.05) * originDistance*10;
        this.y = Math.sin(angle) * (Math.random() * 0.95 + 0.05) * originDistance*10;
        this.z = Math.random() * 20;
        
        this.render = {x:0,y:0, scale: 0};
        this.color = "white";
        this.hasTail = Math.random()*100 < streaksInput;

        this.saturation = Math.random() * 0.2 + 0.8;
        this.luminosity = Math.random() * 0.4 + 0.3;
        this.hueOffset = Math.random() * 40 - 20;

        this.points = [];
        this.setupComplexShape();

    }
    setupComplexShape() {
        for(let i = 0; i < Math.PI*2; i++) {
            this.points.push( {x:Math.cos(i) * Math.random(), y: Math.sin(i) * Math.random()} );
        }
    }
    setRenderValues() {
        this.color = "white";
        if(colorInput != 360) {
            this.color = HSLtoRGB((colorInput + this.hueOffset) % 360, this.saturation, this.luminosity);
        }

        this.render = {x: this.x / this.z, y: this.y / this.z, scale: radiusInput / (this.z+1)};
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        if(document.getElementById("shapeInput").checked) {
            ctx.moveTo(this.render.x, this.render.y);
            for(let i = 0; i < this.points.length; i++) {
                ctx.lineTo( this.render.x + this.points[i].x * this.render.scale, this.render.y + this.points[i].y * this.render.scale);
            }
        } else {
            ctx.arc(this.render.x, this.render.y, radiusInput / (this.z+1), 0, 2*Math.PI, false);
        }
        ctx.fill();
        ctx.closePath();   
        
        if(this.hasTail) {
            this.drawTail();
        }
    }
    drawTail() {
        let tailLength = document.getElementById("streaksLengthInput").value / 100;
        ctx.lineWidth = this.render.scale / 2;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.render.x, this.render.y);
        ctx.lineTo(this.x / (this.z+tailLength), this.y / (this.z+tailLength));
        ctx.stroke();
    }
    update() {
        this.z-=speed;

        if(this.z <= 0) {
            this.reset();
        }

        this.setRenderValues();
    }
    reset() {
        this.z = 20;
    }
}

var stars = [];

const amountOffset = 50;
const originMin = 1;
const speedInputChange = 3000.0;

var speed;
var amount;
var originDistance;
var colorInput;
var radiusInput;
var streaksInput;

var rotation = 0;

function setupStars() {
    amount = document.getElementById("amountInput").value * amountOffset;
    originDistance = document.getElementById("originInput").value + originMin;
    streaksInput = document.getElementById("streaksInput").value;
    stars = [];
    for(let i = 0; i < amount; i++) {
        let star = new Star();
        stars.push(star);
    }
}

function checkConfigChange() {
    colorInput = document.getElementById("colorInput").value * 3.6;
    speed = document.getElementById("speedInput").value / speedInputChange;
    radiusInput = document.getElementById("radiusInput").value / 10 + 3;
    if(amount != document.getElementById("amountInput").value * amountOffset) {
        setupStars();
    }
    if(originDistance != document.getElementById("originInput").value + originMin) {
        setupStars();
    }
    if(streaksInput != document.getElementById("streaksInput").value) {
        setupStars();
    }

    rotation += document.getElementById("rotationInput").value * 0.0003;
}

function HSLtoRGB(h, s, l) {
    let chroma = (1 - Math.abs(2 * l - 1)) * s;
    let h1 = h/60.0;
    let x = chroma * (1 - Math.abs(h1 % 2 - 1));
    let color = [0,0,0];
    if(0 <= h1 && h1 < 1) {
        color = [chroma, x, 0];
    }
    if(1 <= h1 && h1 < 2) {
        color = [x, chroma, 0];
    }
    if(2 <= h1 && h1 < 3) {
        color = [0, chroma, x];
    }
    if(3 <= h1 && h1 < 4) {
        color = [0, x, chroma];
    }
    if(4 <= h1 && h1 < 5) {
        color = [x, 0, chroma];
    }
    if(5 <= h1 && h1 < 6) {
        color = [chroma, 0, x];
    }
    color[0] *= 255;
    color[1] *= 255;
    color[2] *= 255;
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
}