const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

// TODO (Manan) - Make this cors stuff work on heroku app
const io = new Server(server, {cors: {
  origin: 'http://localhost:3000'
}});

const port = process.env.PORT || 5000;

let interval;

let gameData = {
  teamData: {
    "1": {
      word: "start",
      trapCount: 3,
      traps: {
        "2": {
          0: "begin",
          1: ""
        },
        "3": {
          0: "initial",
          2: "yupperss",
        },
      },
    },
    "2": {
      word: "happiness",
      trapCount: 3,
      traps: {
        "3": {
          1: "interest",
          2: "stuff",
        },
      },
    },
    "3": {
      word: "cool",
      trapCount: 3,
      traps: {
        "2": {
          1: "interest",
          2: "stuff",
        },
      },
    },
    "4": {
      word: "interest",
      trapCount: 3,
      traps: {
        "3": {
          1: "cool",
          2: "jump",
        },
      },
    },
  },
};

const sendGameData = async (socket = null) => {
  if (socket) {
    console.log("Sending GameData to most");
    socket.broadcast.emit("gameData", gameData);
  } else {
    console.log("Sending Game Data to all");
    io.emit("gameData", gameData);
  }
};

io.on("connection", (socket) => {
  console.log("New client connected");
  sendGameData();

  if (interval) {
    clearInterval(interval);
  }

  socket.on("updateGameData", (newData) => {
    console.log("One client wants to update game data!")
    gameData = newData
    sendGameData(socket)
  })
  
});

server.listen(port, () => console.log(`Listening on port ${port}`));
