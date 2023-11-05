import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);
app.use("/public", express.static(`${__dirname}/public`));
app.get("/", (req, res) => res.render("home"));

// app.listen(3000);

const httpServer = http.createServer(app); // http 서버 생성
const wsServer = new Server(httpServer);

wsServer.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });

  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    console.log(socket.rooms);
    done();
    socket.to(roomName).emit("welcome");
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye"));
  });

  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", msg);
    done();
  });
});

// const wss = new WebSocket.Server({ server }); // http 서버위에 만듦 http, ws 둘다 가능 - 같은 포트 사용 위해

// const sockets = [];

// wss.on("connection", (socket) => { // 연결된 브라우저
//     sockets.push(socket);
//     socket["nickname"] = "Anno";

//     socket.on("close", () => console.log("disconnected"));

//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg);
//         switch (message.type) {
//             case "new_message":
//                 sockets.forEach((aSocket) => {
//                     aSocket.send(`${socket.nickname}: ${message.payload}`);
//                 });
//             case "nickname":
//                 console.log(message.payload);
//                 socket["nickname"] = message.payload;
//         }
//     })

//     socket.send("hello");
// });

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
