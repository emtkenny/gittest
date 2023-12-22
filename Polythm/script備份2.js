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
function playBeat() {
    var sound = document.getElementById('BeatSound');
    sound.play();
}

var polygonColor = getRandomColor(); 
var polygons = []; // 存儲多邊形的數組

function addPolygon() {
    var sides = prompt("請輸入您想要的圖形的邊數：", "4");
    var sidesNum = parseInt(sides);

    if (sidesNum < 2) {
        alert("無法創建少於2邊的圖形！");
        return;
    }

    if (sidesNum && polygons.length < 8) {
        var color = getRandomColor();
        polygons.push({ sides: sidesNum, color: color, startTime: Date.now() });
        resetStartTime();
        draw();
    } else if (polygons.length >= 8) {
        alert("最多只能添加8個圖形");
    }
    
}

// 其他函數保持不變


function resetStartTime() {
    var newStartTime = Date.now();
    polygons.forEach(polygon => {
        polygon.startTime = newStartTime;
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 繪製所有多邊形
    polygons.forEach(polygon => {
        drawPolygon(polygon.sides, polygon.color);
    });

    // 繪製圓點
    drawBeatIndicator();

    animationId = requestAnimationFrame(draw);
}

function drawBeatIndicator() {
 //   if (!isAnimating) return;
    var currentTime = Date.now();
    polygons.forEach(polygon => {
        var elapsedTime = currentTime - polygon.startTime;
        var edgeInterval = interval / polygon.sides;
        var progress = (elapsedTime % interval) / edgeInterval;

        var nextEdge = Math.floor(progress);
        if (nextEdge != polygon.currentEdge) {
            playBeat(); // 當圓點到達新的頂點時播放音效
            polygon.currentEdge = nextEdge;
        }

        var currentEdge = Math.floor(progress);
        var nextEdge = (currentEdge + 1) % polygon.sides;
        var edgeProgress = progress - currentEdge;

        var offsetAngle = Math.PI / 2; // 順時針轉90度
        var angle = (2 * Math.PI) / polygon.sides;
        
        var currentX = canvas.width / 2 + 150 * Math.cos(currentEdge * angle);
        var currentY = canvas.height / 2 + 150 * Math.sin(currentEdge * angle);
        var nextX = canvas.width / 2 + 150 * Math.cos(nextEdge * angle);
        var nextY = canvas.height / 2 + 150 * Math.sin(nextEdge * angle);

        var indicatorX = currentX + (nextX - currentX) * edgeProgress;
        var indicatorY = currentY + (nextY - currentY) * edgeProgress;

        ctx.beginPath();
        ctx.arc(indicatorX, indicatorY, 10, 0, Math.PI * 2);
        ctx.fillStyle = polygon.color;
        ctx.fill();
    });
}



function drawPolygon(sides, color) {
    ctx.beginPath();
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = 150;
    var offsetAngle = Math.PI / 2; // 順時針轉90度
    var angle = (2 * Math.PI) / sides;
    for (var i = 0; i < sides; i++) {
        var x = centerX + radius * Math.cos(i * angle);
        var y = centerY + radius * Math.sin(i * angle);
        ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.stroke();
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
//var isAnimating = false; // 用於控制動畫的全局變量

//function plays() {
//    if (!isAnimating) {
//        playclick.setAttribute("src", "pause.png");
 //       isAnimating = true;
 ////       startTime = Date.now() - elapsedTime;
 //       animate(); // 啟動動畫循環
 //   } else {
 //       playclick.setAttribute("src", "play.png");
 //       isAnimating = false;
 //   }
//}

//function animate() {
//    if (!isAnimating) return; // 如果不應該動畫，則退出函數
//    draw();
 //   requestAnimationFrame(animate); // 繼續動畫循環
//}
function plays(){
    if(play==0){
        playclick.setAttribute("src","pause.png");
        play=1;
    }else{
        playclick.setAttribute("src","play.png");
        play=0;
    }
}

document.getElementById('plus').onclick = addPolygon;
// Event listeners
sidesInput.addEventListener("input", updateInputs);
bpmInput.addEventListener("input", updateInputs);
// Start animation loop
draw();
