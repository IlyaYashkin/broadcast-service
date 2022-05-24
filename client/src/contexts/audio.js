import { Howl } from "howler";
import { API_URL } from "../connection/index";
import { makeAutoObservable } from "mobx";

export default class Audio {
  audio;
  state = "sleeping";

  constructor() {
    makeAutoObservable(this);
  }

  setState(state) {
    switch (state) {
      case "loading":
        this.state = state;
        break;
      case "playing":
        this.state = state;
        break;
      case "sleeping":
        this.state = state;
        break;
    }
  }

  play(roomId) {
    this.audio = new Howl({
      src: `${API_URL}/play/${roomId}`,
      html5: true,
      format: ["mp3"],
    });
    this.setState("loading");
    this.audio.once("load", () => {
      this.setState("playing");
    });
    this.audio.play();
  }

  stop() {
    if (this.audio || this.audio.state !== "unloaded") {
      this.audio.unload();
      this.setState("sleeping");
    }
  }
}

// Проигрывать из буффера

// play(buffer = undefined) {
//   if ((!this.audio || this.audio.state() === "unloaded") && buffer) {
//     this.stop();
//     const base64Str = Buffer.from(buffer).toString("base64");
//     const contentType = "audio/ogg";
//     this.audio = new Howl({
//       src: [`data:${contentType};base64,${base64Str}`],
//       html5: true,
//     });
//     this.audio.on("end", () => {
//       this.isPlaying = false;
//     });
//   }
//   if (this.audio && !this.isPlaying) {
//     this.audio.play();
//     this.isPlaying = true;
//   }
// }
