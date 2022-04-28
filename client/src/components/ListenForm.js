import ListenService from "../services/ListenService";
import { Howl } from "howler";
import { Buffer } from "buffer";

function ListenForm() {
  async function getMedia(url) {
    const response = await ListenService.fetchMedia(url);
    return response.data;
  }
  let audio;
  return (
    <div>
      <button
        onClick={() => {
          getMedia(
            "https://www.youtube.com/watch?v=HVdM5fFgyDs&ab_channel=fanki1911"
          ).then((buffer) => {
            const base64Str = Buffer.from(buffer).toString("base64");
            const contentType = "audio/ogg";
            audio = new Howl({
              src: [`data:${contentType};base64,${base64Str}`],
              html5: true,
            });
            console.log(audio);
            audio.play();
          });
        }}
      >
        Play
      </button>
      <button
        onClick={() => {
          if (audio) {
            audio.unload();
          }
        }}
      >
        Stop
      </button>
    </div>
  );
}

export default ListenForm;
