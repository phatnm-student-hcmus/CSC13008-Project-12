var socket = io("http://localhost:3000/");

var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

var x = "black",
    y = 2;

function init() {
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;

    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);
}

function color(obj) {
    switch (obj.id) {
        case "green":
            x = "green";
            break;
        case "blue":
            x = "blue";
            break;
        case "red":
            x = "red";
            break;
        case "yellow":
            x = "yellow";
            break;
        case "orange":
            x = "orange";
            break;
        case "black":
            x = "black";
            break;
        case "white":
            x = "white";
            break;
    }
    if (x == "white") y = 14;
    else y = 2;

}
function sendDataURL() {
    let dataURL_ = canvas.toDataURL();
    socket.emit("Client-send-dataURL", dataURL_);
}
function sendContext(line) {
    socket.emit("Client-send-context", line);
}
function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();

    //console.log("Client send data");
    sendDataURL();
    sendContextJson();
}

function erase() {
    var m = confirm("Want to clear");
    if (m) {
        ctx.clearRect(0, 0, w, h);
        document.getElementById("canvasimg").style.display = "none";
        console.log("clear all");
        sendDataURL();
    }
}

function save() {
    document.getElementById("canvasimg").style.border = "2px solid";
    var dataURL = canvas.toDataURL();
    document.getElementById("canvasimg").src = dataURL;
    document.getElementById("canvasimg").style.display = "inline";
}

function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            draw();
        }
    }
}

function deserialize(data, canvas) {
    var img = new Image();
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
    };

    img.src = data;
}
function applyContext(data) {
    let pX, pY, cX, cY;
    pX = data.prevX;
    pY = data.prevY;
    cX = data.currX;
    cY = data.currY;

    ctx.beginPath();
    ctx.moveTo(pX, pY);
    ctx.lineTo(cX, cY);
    ctx.strokeStyle = data.strokeStyle;
    ctx.lineWidth = data.lineWidth;
    ctx.stroke();
    ctx.closePath();

    // console.log("apply ctx successfully");
}
function sendContextJson() {
    socket.emit("Client-send-context-as-json",
        {
            "prevX": prevX,
            "prevY": prevY,
            "currX": currX,
            "currY": currY,
            "strokeStyle": x,
            "lineWidth": y
        });
    // console.log("client send ctx json");
}

$(document).ready(function () {
    socket.on("Server-send-ctx", function (ctx) {
        // console.log("receive ctx")
        ctx.stroke();
    });

    socket.on("Server-send-dataURL", function (dataURL) {
        deserialize(dataURL, canvas);
    });

    socket.on("Server-send-context-as-json", function (data) {
        // console.log("Client receive ctx json");
        applyContext(data);
    });
});