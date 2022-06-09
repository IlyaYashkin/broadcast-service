const { rooms, io } = require("../index");
const ytdlp = require("yt-dlp-exec");
const ytsr = require("ytsr");
const FFmpeg = require("fluent-ffmpeg");
const Throttle = require("throttle");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const { PassThrough } = require("stream");
const ApiError = require("../exceptions/api-error");
const lamejs = require("lamejs");

class BroadcastService {
  constructor() {
    this.silenceBuffer = this.generateSilence(1);
    this.broadcasts = new Map();

    this.silenceStream = new PassThrough();
    this.silenceStream.on("data", (chunk) => {
      for (const [, room] of rooms) {
        if (room.state !== "broadcasting") {
          for (const sink of room.sinks) {
            sink.write(chunk);
          }
        }
      }
    });
  }

  start() {
    setTimeout(() => {
      this.playSilence();
      this.start();
    }, 1000);
  }

  async download(url, roomId) {
    try {
      const room = rooms.get(roomId);
      room.setState("downloading");
      io.to(roomId).emit("broadcast-info", {
        state: room.state,
        title: "",
      });

      const filePath = path.join(process.cwd(), "downloads", roomId);

      const [info] = await Promise.all([
        ytdlp
          .exec(url, {
            dumpSingleJson: true,
            f: "ba",
          })
          .then((data) => {
            return JSON.parse(data.stdout);
          }),
        ytdlp.exec(url, {
          f: "ba",
          o: filePath,
          noPlaylist: true,
          forceOverwrites: true,
        }),
      ]);

      const that = this;
      play();
      function play() {
        room.setState("broadcasting");
        io.to(roomId).emit("broadcast-info", {
          state: room.state,
          title: info.fulltitle,
        });
        const throttle = new Throttle(16000); //bitrate = 128k / 8 Пропускная способность (байты/сек)
        const readable = fs.createReadStream(filePath);
        const ffmpeg = new FFmpeg(readable);
        const formatted = ffmpeg
          .audioBitrate("128")
          .audioFrequency(48000)
          .format("mp3")
          .pipe();
        formatted.pipe(throttle);

        that.broadcasts.set(roomId, {
          throttle,
          readable,
          ffmpeg,
          formatted,
        });

        ffmpeg.on("error", () => {
          //console.log("ffmpeg has been killed");
        });
        throttle.on("data", (chunk) => {
          for (const sink of room.sinks) {
            sink.write(chunk);
          }
        });
        throttle.on("finish", () => {
          console.log("FINISH");
          if (!rooms.has(roomId)) return;
          if (room.repeat) {
            setImmediate(play);
            return;
          } else if (room.playlist.length > 0) {
            room.playlist.shift();
            if (room.playlist.length === 0) {
              room.setState("sleeping");
              io.to(roomId).emit("broadcast-info", {
                state: room.state,
                title: "",
              });
              return;
            }
            setImmediate(() => {
              that.download(room.playlist[0], roomId);
            });
          }
        });
      }
    } catch (e) {
      console.log(e);
      io.to(roomId).emit("server-message", {
        msg: "Неверный URL",
      });
      if (!rooms.has(roomId)) return;
      const room = rooms.get(roomId);
      if (room.playlist.length > 0) {
        room.playlist.shift();
        if (room.playlist.length === 0) {
          room.setState("sleeping");
          io.to(roomId).emit("broadcast-info", {
            state: room.state,
            title: "",
          });
          return;
        }
      }
      setImmediate(() => {
        this.download(room.playlist[0], roomId);
      });
    }
  }

  terminate(roomId) {
    const broadcast = this.broadcasts.get(roomId);
    if (!broadcast) return;
    broadcast.readable.close();
    broadcast.ffmpeg.kill();
    broadcast.formatted.end();
    broadcast.throttle.end();
    this.broadcasts.delete(roomId);
  }

  async deleteFile(roomId) {
    try {
      const filePath = path.join(process.cwd(), "downloads", roomId);
      fs.unlink(filePath, (err) => {
        if (err) {
          return; //console.error(err);
        }
        //console.log('Файл удален');
      });
    } catch (e) {
      console.log(e);
    }
  }

  playSilence() {
    this.silenceStream.write(new Uint8Array(this.silenceBuffer));
  }

  generateSilence(duration) {
    const data = [];
    const encoder = new lamejs.Mp3Encoder(2, 48000, 128);
    const left = new Int16Array(48000 * duration); //one second of silence (get your data from the source you have)
    const right = new Int16Array(48000 * duration);
    let tmp = encoder.encodeBuffer(left, right);
    data.push(tmp);
    encoder.flush();
    data.push(tmp);
    return Uint8Array.from(data[0]).buffer;
  }
}

module.exports = new BroadcastService();
