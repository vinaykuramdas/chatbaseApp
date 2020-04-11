const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set front end folder
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

const botname = "chatbase bot";

//runs when client is connected
io.on("connection", socket => {
  // console.log("new connection...");

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);
    //welcome note
    socket.emit("message", formatMessage(botname, "hey this is chatbase!!!"));

    //new user connected
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(
          botname,
          `${user.username} has joined the ${user.room} room.`
        )
      );

    //send live users
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  //getting a message
  socket.on("chatmsg", msg => {
    const user = getCurrentUser(socket.id);
    //console.log(msg);

    //send to all users
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  //user disconnected
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botname, `${user.username} has disconnected`)
      );
      //send live users
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
