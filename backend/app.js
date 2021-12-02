const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const _ = require("lodash")
// TODO (Manan) - Make this cors stuff work on heroku app
const io = new Server(server, {cors: {
  origin: 'http://localhost:3000'
}});

const port = process.env.PORT || 5000;

const path = require("path");
// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", function (req, res) {
  res.sendFile("index.html", {
    root: path.join(__dirname, "../frontend/build"),
  });
});


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

const sendGameData = async (excludeSocket = null) => {
  if (excludeSocket) {
    console.log("Sending GameData to most");
    excludeSocket.broadcast.emit("gameData", gameData);
  } else {
    console.log("Sending Game Data to all");
    io.emit("gameData", gameData);
  }
};

io.on("connection", (socket) => {
  console.log("New client connected. Sending initial data");
  io.emit("gameData", gameData);

  if (interval) {
    clearInterval(interval);
  }

  socket.on("updateGameData", (newData) => {
    console.log("One client wants to update game data!")
    gameData = newData
    sendGameData(socket)
  })
  socket.on("addTrap", (payload) => {
    console.log("Someone added a trap!")
    const dataToMerge = {
      teamData: {
        [payload.targetTeam]: {
          traps: {
            [payload.fromTeam]: {
              [payload.index]: payload.word,
            },
          },
        },
      },
    };
    gameData = _.merge(
      dataToMerge,
      gameData
    )
    gameData.teamData[payload.targetTeam].traps[
      payload.fromTeam
    ][payload.index] = payload.word;
    sendGameData(socket)
  })
  socket.on("setWord", (payload) => {
    gameData = _.merge(
      gameData,
      {
        teamData: {
          [payload.team]: {
            word: payload.word
          }
        }
      },
      
    )
    sendGameData(socket)
  })
  
});

server.listen(port, () => console.log(`Listening on port ${port}`));
