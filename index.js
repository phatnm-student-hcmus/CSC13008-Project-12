const express = require('express')
const app = express()
const port = 3000

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server)
var counter = 0;
server.listen(process.env.PORT||port);

io.on ("connection", function(socket){
    console.log(socket.id," vua ket noi");
    socket.emit("Server-send-dataURL", dataURL_saving);
    socket.on("disconnect", function(){
        console.log(socket.id," vua ngat ket noi");
    });
    //sokcet send data to all client
    // socket.on("Client-send-data", function(data){
    //     console.log(socket.id, data);
    //     io.sockets.emit("Server-send-data", data+"123");
    // });

    //sokcet sendback data to client sended
    // socket.on("Client-send-data", function(data){
    //     console.log(socket.id, data);
    //     socket.emit("Server-send-data", data+"123");
    // });

    //sokcet broascast data 
    // socket.on("Client-send-data", function(data){
    //     console.log(socket.id, data);
    //     socket.broadcast.emit("Server-send-data", data+"\n");
    // });
    socket.on("Client-send-dataURL", function(dataURL){
        dataURL_saving = dataURL;
        //socket.broadcast.emit("Server-send-dataURL", dataURL_saving);
    });
    socket.on("Client-send-context-as-json", function (data){
        
        socket.broadcast.emit("Server-send-context-as-json", data);

        // console.log("Send ")
    });
});


app.get("/", function(req, res){
    res.render("home");
});



var counter2 = 0;
var dataURL_saving = "";