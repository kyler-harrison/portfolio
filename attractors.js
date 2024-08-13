class Point {
    constructor(radius, x, y, z) {
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

function generateInitPoints() {
    var points = [];

    for (var i = 0; i < N; i++) {
        var radius = Math.floor(Math.random() * (maxRadius - minRadius) + minRadius);
        var x = Math.floor(Math.random() * (xMax - xMin) + xMin);
        var y = Math.floor(Math.random() * (yMax - yMin) + yMin);
        var z = Math.floor(Math.random() * (zMax - zMin) + zMin);
        var point = new Point(radius, x, y, z);
        points.push(point);
    }

    return points;
}

function lorenz(x, y, z) {
    const sigma = 10;  // actual const
    const beta = 8 / 3;  // actual const
    const rho = 28;  // actual const
    var dxdt = sigma * (y - x);
    var dydt = x * (rho - z) - y;
    var dzdt = x * y - beta * z;

    return {"dxdt": dxdt, "dydt": dydt, "dzdt": dzdt};
}

function lorenz83(x, y, z) {
    const a = 0.95;
    const b = 7.91;
    const f = 4.83;
    const g = 4.66;
    var dxdt = -a * x - y**2 - z**2 + a * f; 
    var dydt = -y + x * y - b * x * z + g;
    var dzdt = -z + b * x * y + x * z;

    return {"dxdt": dxdt, "dydt": dydt, "dzdt": dzdt};
}

function chen(x, y, z) {
    const alpha = 5;
    const beta = -10;
    const delta = -0.38;
    var dxdt = alpha * x - y * z; 
    var dydt = beta * y + x * z;
    var dzdt = delta * z + x * y / 3;

    return {"dxdt": dxdt, "dydt": dydt, "dzdt": dzdt};
}

function fourWing(x, y, z){
    const a = 0.2;
    const b = 0.01;
    const c = -0.4;
    var dxdt = a * x + y * z; 
    var dydt = b * x + c * y - x * z;
    var dzdt = -z - x * y;

    return {"dxdt": dxdt, "dydt": dydt, "dzdt": dzdt};
}

function halvorsen(x, y, z) {
    var a = 1.89;

    var dxdt = -a * x - 4 * y - 4 * z - y**2; 
    var dydt = -a * y - 4 * z - 4 * x - z**2;
    var dzdt = -a * z - 4 * x - 4 * y - x**2;

    return {"dxdt": dxdt, "dydt": dydt, "dzdt": dzdt};
}

function RK4(point) {
    // k1 (each idx refers to k1 in x, y, z, respectively)
    var ddt = updateFunction(point.x, point.y, point.z);
    k1 = [ddt["dxdt"], ddt["dydt"], ddt["dzdt"]];

    // k2
    ddt = updateFunction(point.x + (h / 2) * k1[0], point.y + (h / 2) * k1[1], point.z + (h / 2) * k1[2]);
    k2 = [ddt["dxdt"], ddt["dydt"], ddt["dzdt"]];

    // k3
    ddt = updateFunction(point.x + (h / 2) * k2[0], point.y + (h / 2) * k2[1], point.z + (h / 2) * k2[2]);
    k3 = [ddt["dxdt"], ddt["dydt"], ddt["dzdt"]];

    // k4
    ddt = updateFunction(point.x + h * k3[0], point.y + h * k3[1], point.z + h * k3[2]);
    k4 = [ddt["dxdt"], ddt["dydt"], ddt["dzdt"]];

    point.x += (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
    point.y += (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    point.z += (h / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);

    // END
    t += h;
}

function drawPointsNoTrails() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < points.length; i++) {
        if (i % 2 == 0) {
            ctx.fillStyle = evenColor;
        } else {
            ctx.fillStyle = oddColor;
        }

        ctx.beginPath();
        ctx.arc(points[i].x * xScale + xMid, points[i].y * yScale + yMid, points[i].radius, 0, 2 * Math.PI);
        //ctx.arc(-points[i].x * xScale + xMid, points[i].y * yScale + yMid, points[i].radius, 0, 2 * Math.PI);
        ctx.fill();

        // update point positions
        RK4(points[i]);
    }

    requestAnimationFrame(drawPointsNoTrails);
}

function drawPointsTrails() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < points.length; i++) {
        history[i].push(new Point(points[i].radius, points[i].x, points[i].y, points[i].z));

        if (history[i].length > historyN) {
            history[i].shift();
        }

        if (i % 2 == 0) {
            ctx.strokeStyle = evenColor;
        } else {
            ctx.strokeStyle = oddColor;
        }

        ctx.beginPath();
        for (var j = 0; j < history[i].length - 1; j++) {
            ctx.moveTo(history[i][j].x * xScale + xMid, history[i][j].y * yScale + yMid);
            ctx.lineTo(history[i][j + 1].x * xScale + xMid, history[i][j + 1].y * yScale + yMid);
        }
        ctx.stroke();

        // update point positions
        RK4(points[i]);
    }

    requestAnimationFrame(drawPointsTrails);
}

function drawPointsTrailsReflect() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < points.length; i++) {
        history[i].push(new Point(points[i].radius, points[i].x, points[i].y, points[i].z));

        if (history[i].length > historyN) {
            history[i].shift();
        }

        if (i % 2 == 0) {
            ctx.strokeStyle = evenColor;
        } else {
            ctx.strokeStyle = oddColor;
        }

        ctx.beginPath();
        for (var j = 0; j < history[i].length - 1; j++) {
            ctx.moveTo(history[i][j].x * xScale + xMid, history[i][j].y * yScale + yMid);
            ctx.lineTo(history[i][j + 1].x * xScale + xMid, history[i][j + 1].y * yScale + yMid);
            ctx.moveTo(-history[i][j].x * xScale + xMid, history[i][j].y * yScale + yMid);
            ctx.lineTo(-history[i][j + 1].x * xScale + xMid, history[i][j + 1].y * yScale + yMid);
        }
        ctx.stroke();

        // update point positions
        RK4(points[i]);
    }

    requestAnimationFrame(drawPointsTrailsReflect);
}

const originalWidth = screen.width;
const smallScaleWidth = 800;  // change animation scaling if screen less than this many px
const smallScaleFactor = 0.5;  // multiply x and y scale terms by this factor
var simBox = document.getElementById("sim-box");
var simBoxInfo = simBox.getBoundingClientRect();
const canvas = document.getElementById("sim-canvas");
const ctx = canvas.getContext("2d");
canvas.width = simBoxInfo.width;
canvas.height = simBoxInfo.height;

const minRadius = 1;
const maxRadius = 1;
var xMid = canvas.width / 2;
var yMid = canvas.height / 2;
const xMin = -10;
const xMax = 10;
const yMin = -10;
const yMax = 10;
const zMin = -10;
const zMax = 10;
var t = 0;
//const evenColor = "#8000ff";  // purple homebase
//const evenColor = "#66b3ff";  
const evenColor = "#1a1aff";
const oddColor = "#4d4dff";  // blue homebase
//const oddColor = "#c266ff";  // purple
//const oddColor = "red";
//const oddColor = "red";

var attChoice = Math.random();

if (attChoice < 0.33) {
    var updateFunction = lorenz;
} else if ((attChoice >= 0.33) && (attChoice < 0.66)) {
    var updateFunction = chen;
} else {
    var updateFunction = fourWing;
}

console.log(updateFunction);

if (updateFunction == lorenz) {
    var N = 250;
    var xScale = 12;
    var yScale = xScale;
    var h = 0.003;
    var historyN = 30;

    if (originalWidth < smallScaleWidth) {
        xScale *= 0.75;
        yScale *= 0.75;
    }
} else if (updateFunction == chen) {
    var N = 500;
    var xScale = 14;
    var yScale = 14;
    var h = 0.001;
    var historyN = 30;

    if (originalWidth < smallScaleWidth) {
        xScale *= 0.9;
        yScale *= 0.9;
    }
} else if (updateFunction == fourWing) {
    var N = 500;
    var xScale = 150;
    var yScale = 150;
    var h = 0.01;
    var historyN = 30;

    if (originalWidth < smallScaleWidth) {
        xScale *= 0.6;
        yScale *= 0.6;
    }
} else if (updateFunction == halvorsen) {
    var N = 500;
    var xScale = 30;
    var yScale = 30;
    var h = 0.01;
    var historyN = 30;
} else {
    var N = 100;
    var xScale = 10;
    var yScale = 10;
    var h = 0.001;
    var historyN = 30;
}


var points = generateInitPoints();

const history = [];
for (var i = 0; i < N; i++) {
    history.push([]);
}

if (updateFunction == lorenz){
    drawPointsTrails();
} else {
    drawPointsTrailsReflect();
}
