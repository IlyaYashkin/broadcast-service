import { Howl } from "howler";
import { Buffer } from "buffer";

export default class Audio {
  audio;
  isPlaying = false;
  nowPlaying = "";

  play(buffer = undefined) {
    if ((!this.audio || this.audio.state() === "unloaded") && buffer) {
      this.stop();
      const base64Str = Buffer.from(buffer).toString("base64");
      const contentType = "audio/ogg";
      this.audio = new Howl({
        src: [`data:${contentType};base64,${base64Str}`],
        html5: true,
      });
      this.audio.on("end", () => {
        this.isPlaying = false;
      });
    }
    if (this.audio && !this.isPlaying) {
      this.audio.play();
      this.isPlaying = true;
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  stop() {
    if (this.audio) {
      this.audio.unload();
      this.isPlaying = false;
    }
  }
}
