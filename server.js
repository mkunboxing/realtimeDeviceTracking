const express = require('express');
const app = express();

// socket io boilerplate
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

// ejs boilerplate
const path = require('path');
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    socket.on("sendLocation", (data) => {
        io.emit("newLocation", {id: socket.id, ...data});
    })
    
    socket.on("userdisconnect", () => {
        io.emit("disconnect", socket.id);
    })
});

app.get('/', (req, res) => {
    res.render("index");
});

// here we are starting server not app
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});