const express = require('express')
const app = express()
const port = 3000

var dataURL_saving = "";
var server = require("http").Server(app);
var io = require("socket.io")(server)

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");


server.listen(process.env.PORT||port);

io.on ("connection", function(socket){
    console.log(socket.id," vua ket noi");
    socket.emit("Server-send-dataURL", dataURL_saving);
    socket.on("disconnect", function(){
        console.log(socket.id," vua ngat ket noi");
    });
    socket.on("Client-send-dataURL", function(dataURL){
        dataURL_saving = dataURL;
    });
    socket.on("Client-send-context-as-json", function (data){
        socket.broadcast.emit("Server-send-context-as-json", data);
        // console.log("server send ctx");
    });
    socket.on("s", (data) => {console.log(data);});
    socket.on("Client-clear-all", () => {
        socket.broadcast.emit("Clear-all");
        console.log("clear all");
    })
    socket.on("Client-send-dot-as-json", (data) => {
        console.log("send dot");
        socket.broadcast.emit("Server-send-dot-as-json", data);
    })
});

app.get("/", function(req, res){
    res.render("home");
});

