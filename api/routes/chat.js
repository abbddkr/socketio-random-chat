const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const io = require("../services/io");

const randomChatQueue = [];

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    randomChatQueue.push({ userId: userId, socket: socket });
    if (randomChatQueue.length >= 2) {
      const user1 = randomChatQueue.shift();
      const user2 = randomChatQueue.shift();
      const roomId = crypto.randomUUID();
      user1.socket.join(roomId);
      user2.socket.join(roomId);
      user1.socket.emit("matched", { roomId: roomId, partner: user2.userId });
      user2.socket.emit("matched", { roomId: roomId, partner: user1.userId });
      // emit `waiting` to user1 , TODO: alert-badge
      user1.socket.emit("waiting");
      // emit `waiting` to user2 , TODO: alert-badge
      user2.socket.emit("waiting");
    }
  });
  socket.on("message", (data) => {
    console.log("Received message:", data);
    socket.to(data.roomId).emit("message", data);
  });

  socket.on("typing", (data) => {
    socket.to(data.roomId).emit("typing", data.typing);
  });


  socket.on('userDisconnected', (data) => {
    socket.to(data.roomId).emit("userDisconnected",data);
  })

});

router.post("/guest", function (req, res, next) {
  const { nickname, gender } = req.body || false;
  const userId = crypto.randomUUID();
  const data = { userId, nickname, gender };
  if (nickname && gender) {
    res.status(200).json({ data });
  }
  res.status(400).json({ message: "Nickname and Gender cannot be empty" });
});

router.post("/verify_guest", (req, res, next) => {
  // write your verification method or middleware
  const { id, nickname } = req.body;
  const user = [id, nickname];
  res.status(200).json({ user });
});

module.exports = router;
