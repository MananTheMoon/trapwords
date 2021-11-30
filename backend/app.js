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

let wavelengthData = {
  activeTeam: "admin",
  dialAngle: 0,
  targetRange: 0,
  covered: true,
  prompt: {
    left: "Left",
    right: "right",
  },
  teams: {
    team1: {
      name: "Team 1",
      score: 0,
      position: "left", // or right or center
      shown: true,
    },
    team2: {
      name: "Team 2",
      score: 0,
      position: "left", // or right or center
      shown: true,
    },
    team3: {
      name: "Team 3",
      score: 0,
      position: "right", // or right or center
      shown: true,
    },
    team4: {
      name: "Team 4",
      score: 0,
      position: "right", // or right or center
      shown: false,
    },
  },
};

let players = {};

const sendGameData = async (socket = null) => {
  if (socket) {
    console.log("Sending GameData to most");
    socket.broadcast.emit("wavelengthData", wavelengthData);
  } else {
    console.log("Sending Game Data to all");
    io.emit("wavelengthData", wavelengthData);
  }
};

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.emit("listPlayers", players);
  sendGameData();

  if (interval) {
    clearInterval(interval);
  }

  
});

server.listen(port, () => console.log(`Listening on port ${port}`));
