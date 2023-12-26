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
// 创建一个包含多个 Audio 对象的数组
var audioPool = [];
for (var k = 0; k < 20; k++){
    audioPool[k]=[];
}

for (var i = 0; i < 20; i++) {
    audioPool[i][2] = new Audio('2.mp3');
    audioPool[i][3] = new Audio('3.mp3');
    audioPool[i][4] = new Audio('4.mp3');
    audioPool[i][5] = new Audio('5.mp3');
    audioPool[i][6] = new Audio('6.mp3');
    audioPool[i][7] = new Audio('7.mp3');
    audioPool[i][8] = new Audio('8.mp3');
    audioPool[i][9] = new Audio('9.mp3');
}

// 用于跟踪当前使用哪个音频对象
var currentAudioIndex = 0;



var polygonColor = getRandomColor(); 
var polygons = []; // 存儲多邊形的數組

function addPolygon() {
    var sides = prompt("請輸入您想要的圖形的邊數：", "4");
    var sidesNum = parseInt(sides);

    if (sidesNum < 2) {
        alert("無法創建少於2邊的圖形！");
        return;
    }

    if (sidesNum > 9) {
        alert("最多只能生成9邊的圖形！");
        return;
    }

    if (polygons.length >= 8) {
        alert("最多只能添加8個圖形");
        return;
    }

    var color = getRandomColor();
    polygons.push({ 
        sides: sidesNum, 
        color: color, 
        startTime: Date.now(), 
        indicatorX: null,
        indicatorY: null, 
        currentEdge: 0,
        firstBeat: true // 新添加的多邊形標誌為第一次撥放
    });
    resetStartTime();
    draw();
}



function resetStartTime() {
    var newStartTime = Date.now();
    polygons.forEach(polygon => {
        polygon.startTime = newStartTime;
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    polygons.forEach(polygon => {
        drawPolygon(polygon.sides, polygon.color);
        if (!isAnimating) {
            drawStaticIndicator(polygon); // 绘制静态圆点
        } else {
            drawBeatIndicator(polygon); // 绘制动态圆点
        }
    });
    if (isAnimating) {
        animationId = requestAnimationFrame(draw);
    }
}
function drawStaticIndicator(polygon) {
    // 计算起始位置的圆点坐标
    var angle = (2 * Math.PI) / polygon.sides;
    var x = canvas.width / 2 + 150 * Math.cos(0);
    var y = canvas.height / 2 + 150 * Math.sin(0);

    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = polygon.color;
    ctx.fill();
}


function drawBeatIndicator() {

    if (!isAnimating) return;  // 如果动画未进行，不更新圆点位置

    var currentTime = Date.now();
    polygons.forEach(polygon => {
        var elapsedTime = currentTime - startTime;
        var edgeInterval = interval / polygon.sides;
        var progress = (elapsedTime % interval) / edgeInterval;
        var nextEdge = Math.floor(progress);

        if (nextEdge != polygon.currentEdge || polygon.firstBeat) {
            if(polygon.firstBeat) {
                polygon.firstBeat = false; // 取消第一次撥放的標誌
            }
            polygon.currentEdge = nextEdge;
            var sound = audioPool[currentAudioIndex][polygon.sides];
            sound.volume = vol;
            sound.play();
            currentAudioIndex = (currentAudioIndex + 1) % audioPool.length;
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


var isAnimating = false; // 用於控制動畫的全局變量

function plays() {
    if (!isAnimating) {
        if(nightmode){
            playclick.setAttribute("src", "pause.png");
        } else {
            playclick.setAttribute("src", "bpause.png");
        }
        isAnimating = true;
        startTime = Date.now();
        animate(); // 开始动画
    } else {
        if(nightmode){
            playclick.setAttribute("src", "play.png");
        } else {
            playclick.setAttribute("src", "bplay.png");
        }
        isAnimating = false;
        elapsedTime = 0;
        resetStartTime(); // 重置开始时间和圆点位置
        draw(); // 重绘一次以确保动画处于初始状态
    }
}

function resetStartTime() {
    var newStartTime = Date.now();
    polygons.forEach(polygon => {
        polygon.startTime = newStartTime;
        polygon.currentEdge = -1; // 重置当前边
    });
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
function playBeat() {
    // 获取当前的音频对象
    var sound = audioPool[currentAudioIndex][polygon.sides];
    // 播放音频
    sound.play();
    // 移至下一个音频对象
    currentAudioIndex = (currentAudioIndex + 1) % audioPool.length;
}

function beatVolume() {
    // 确保 vol 在 0 到 1 之间
    var adjustedVolume = Math.min(Math.max(vol, 0), 1);

    for (var i = 0; i < audioPool.length; i++) {
        for (var j = 2; j <= 9; j++) {
            if (audioPool[i][j]) {
                audioPool[i][j].volume = adjustedVolume;
            }
        }
    }
}


function updateInputs() {
    // 获取并解析 BPM 输入值

    beatVolume();
    bpm = parseInt(bpmInput.value);

    // 检查 BPM 是否在允许的范围内，或者输入是否为空
    if (isNaN(bpm) || bpm < 1) {
        bpm = 1;  // 小于 1 或为空时，设置 BPM 为 1
    } else if (bpm > 500) {
        bpm = 500;  // 大于 500 时，设置 BPM 为 500
    }

    vol = parseFloat(volInput.value);
    if (isNaN(vol) || vol < 0) {
        vol = 0;
    } else if (vol > 100) {
        vol = 100;
    }
    volInput.value = vol;
    vol = vol / 100; // 转换为 0 到 1 的范围

    beatVolume(); // 更新音频池中的音量
    interval = 240000 / bpm; // 重新计算间隔
    resetStartTime(); // 重置开始时间
    draw(); // 重新绘制
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
