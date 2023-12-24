var canvas = document.getElementById("beatCanvas");
var ctx = canvas.getContext("2d");
var bpmInput = document.getElementById("bpm");
var volInput = document.getElementById("vol");
var playclick=document.getElementById("play");
var question = document.getElementById("question");
var daymode = document.getElementById("daymode");
var threelines = document.getElementById("threeline");
var bpmWord = document.getElementById("bpmWord");
var sides = parseInt(0);
var bpm = parseInt(bpmInput.value);
var interval = 240000 / bpm; // Calculate interval in milliseconds
var startTime = Date.now();
var elapsedTime = 0;
var currentEdge = 0;
var animationId;
var play=0;
var nightmode=1;
var vo=document.getElementById("BeatSound");
var vol=parseFloat(volInput.value/100);

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
        polygons.push({ 
            sides: sidesNum, 
            color: color, 
            startTime: Date.now(), 
            indicatorX: null, // 初始化圓點的 X 坐標
            indicatorY: null, // 初始化圓點的 Y 坐標
            currentEdge: 0 // 初始化當前邊
        });
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

    // 更新 elapsedTime
    if (isAnimating) {
        elapsedTime = Date.now() - startTime;
    }

    // 绘制所有多边形和圆点
    polygons.forEach(polygon => {
        drawPolygon(polygon.sides, polygon.color);
        drawBeatIndicator();
    });

    animationId = requestAnimationFrame(draw);
}

function drawBeatIndicator() {
    var currentTime = Date.now();
    polygons.forEach(polygon => {
        var elapsedTime = currentTime - startTime;
        var edgeInterval = interval / polygon.sides;
        var progress = (elapsedTime % interval) / edgeInterval;
        var nextEdge = Math.floor(progress);
        
        vo.volume=vol;
        if (nextEdge != polygon.currentEdge) {
            polygon.currentEdge = nextEdge;
            playBeat();
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
function updateInputs() {
    // Update sides and BPM
    vol = parseFloat(volInput.value/100);
    bpm = parseInt(bpmInput.value);
    interval = 240000 / bpm; // Recalculate interval
}
var isAnimating = false; // 用於控制動畫的全局變量

function plays() {
    if (!isAnimating) {
        if(nightmode){
            playclick.setAttribute("src", "pause.png");
        }else{
            playclick.setAttribute("src", "bpause.png");
        }
        isAnimating = true;
        startTime = Date.now() - elapsedTime; // 从暂停的地方开始
        animate(); // 开始动画
    } else {
        if(nightmode){
            playclick.setAttribute("src", "play.png");
        }else{
            playclick.setAttribute("src", "bplay.png");
        }
        isAnimating = false;
        elapsedTime = Date.now() - startTime; // 记录当前已过时间
        // 不再调用 animate，使得动画停止
    }
}

function whatmode() {
    if (!nightmode) {
        document.getElementById('title').setAttribute("src","https://images.cooltext.com/5683812.png");
        if (isAnimating) {
            playclick.setAttribute("src", "pause.png");
        }else{
            playclick.setAttribute("src", "play.png");
        }
        daymode.setAttribute("src", "sun.png");
        question.setAttribute("src","question.png");
        canvas.setAttribute("border-color","black")
        threelines.setAttribute("src","threeline.jpg")
        document.getElementById('plus').setAttribute("src","plus.jpg");
        document.getElementById('minus').setAttribute("src","minus.jpg");
        document.getElementById('volImg').setAttribute("src","volume.png");
        nightmode = true;
        document.body.style.backgroundColor = 'black';
        document.getElementById("bpmWord").style.color = "white";
    } else {
        document.getElementById('title').setAttribute("src","https://images.cooltext.com/5683816.png");
        if (isAnimating) {
            playclick.setAttribute("src", "bpause.png");
        }else{
            playclick.setAttribute("src", "bplay.png");
        }
        daymode.setAttribute("src", "moon.png");
        question.setAttribute("src","bquestion.png");
        canvas.setAttribute("border-color","white");
        threelines.setAttribute("src","bthreeline.jpg");
        document.getElementById('plus').setAttribute("src","bplus.jpg");
        document.getElementById('minus').setAttribute("src","bminus.jpg");
        document.getElementById('volImg').setAttribute("src","bvolume.png");
        nightmode = false;
        document.body.style.backgroundColor = 'white';
        document.getElementById("bpmWord").style.color = "black";
    }
}

function animate() {
    if (!isAnimating) return; // 如果不應該動畫，則退出函數
        draw();
        requestAnimationFrame(animate); // 繼續動畫循環
}

function removePolygons() {
    if (polygons.length === 0) {
        alert("沒有多邊形！");
        return;
    }

    var choices = polygons.map((p, index) => (index + 1) + ': ' + p.sides + ' 邊').join('\n');
    var choice = prompt("選擇要刪除的多邊形：\n" + choices);

    var indexToRemove = parseInt(choice) - 1;
    if (indexToRemove >= 0 && indexToRemove < polygons.length) {
        polygons.splice(indexToRemove, 1);
        draw();
    }
}



document.getElementById('plus').onclick = addPolygon;
bpmInput.addEventListener("input", updateInputs);
volInput.addEventListener("input", updateInputs);
draw();
