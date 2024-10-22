//IMPORTS:
const express = require("express");
const app = express();
const { Server } = require("socket.io");
const http = require("http");
const ACTIONS = require("./src/Actions");


//INITIALIZATIONS:
const server = http.createServer(app);
const io = new Server(server);


//MIDDLEWARES:
app.use(express.static('build'));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


//CREATING A MAP FOR MAPPING SOCKET ID WITH USERNAME:
const userSocketMap = {};


//FUNCTION TO GET LIST OF ALL THE USERS PRESENT IN THE ROOM:
function getAllConnectedClients(roomId) {
  // Map
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}


//SOCKET CONNECTION:
io.on("connection", (socket) => {
  console.log("Socket Connected Successfully", socket.id);

  //EMITTING EVENT WHEN A NEW USER JOINS THE ROOM:
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  //EMITTING EVENT WHEN CODE IS CHANGES IN THE ROOM:
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  //EMITTING EVENT FOR SYNCING THE CODE FOR ALL
  //THE USERS IN THE ROOM:
  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  //EMITTING EVENT WHEN A USER LEAVES THE ROOM:
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});


//PORT:
const PORT = process.env.PORT || 4000;

//LISTENING ON PORT:
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
