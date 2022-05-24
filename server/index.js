require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 53304;
const DB_URL = process.env.DB_URL;
const CLIENT_URL = process.env.CLIENT_URL;
const API_URL = process.env.API_URL;

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});
const rooms = new Map();
module.exports.rooms = rooms;
module.exports.io = io;

const router = require("./router/router");
const errorMiddleware = require("./middlewares/error-middleware");
const onConnection = require("./socket/socket-manager");
const broadcastService = require("./services/broadcast-service");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: CLIENT_URL,
  })
);
app.use("/api", router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    io.on("connection", onConnection);
    server.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
    broadcastService.start();
  } catch (e) {
    console.log(e);
  }
};
start();

// setInterval(() => {
//   console.log(rooms);
// }, 1000);
