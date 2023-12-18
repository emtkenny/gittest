var canvas = document.getElementById("beatCanvas");
var ctx = canvas.getContext("2d");
var sidesInput = document.getElementById("sides");
var bpmInput = document.getElementById("bpm");
var playclick=document.getElementById("play");

var sides = parseInt(sidesInput.value);
var bpm = parseInt(bpmInput.value);
var interval = 240000 / bpm; // Calculate interval in milliseconds
var startTime = Date.now();
var elapsedTime = 0;
var currentEdge = 0;
var animationId;
var play=0;

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
var polygonColor = getRandomColor(); 
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 繪製多邊形
    ctx.beginPath();
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = 150;
    var angle = (2 * Math.PI) / sides;

    for (var i = 0; i < sides; i++) {
        var x = centerX + radius * Math.cos(i * angle);
        var y = centerY + radius * Math.sin(i * angle);
        ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = polygonColor;
    ctx.stroke();

    // 計算節拍和進度
    var currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    var edgeInterval = interval / sides;
    var progress = (elapsedTime % interval) / edgeInterval;

    var currentEdge = Math.floor(progress);
    var nextEdge = (currentEdge + 1) % sides;
    var edgeProgress = progress - currentEdge;

    // Current and next vertex positions
    var currentX = centerX + radius * Math.cos(currentEdge * angle);
    var currentY = centerY + radius * Math.sin(currentEdge * angle);
    var nextX = centerX + radius * Math.cos(nextEdge * angle);
    var nextY = centerY + radius * Math.sin(nextEdge * angle);

    // Interpolated position of the beat indicator
    var indicatorX = currentX + (nextX - currentX) * edgeProgress;
    var indicatorY = currentY + (nextY - currentY) * edgeProgress;

    // Draw beat indicator
    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, 10, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();

    if (elapsedTime >= interval) {
        // Play beat sound and reset start time
        playBeat();
        startTime = currentTime;
    }

    animationId = requestAnimationFrame(draw); // Call draw again for smooth animation
}



function playBeat() {
    // Add code to play beat sound
    console.log("Beat!");
}

function updateInputs() {
    // Update sides and BPM
    sides = parseInt(sidesInput.value);
    bpm = parseInt(bpmInput.value);
    interval = 240000 / bpm; // Recalculate interval
}
function plays(){
    if(play==0){
        playclick.setAttribute("src","pause.png");
        play=1;
    }else{
        playclick.setAttribute("src","play.png");
        play=0;
    }
}
// Event listeners
sidesInput.addEventListener("input", updateInputs);
bpmInput.addEventListener("input", updateInputs);
// Start animation loop
draw();
