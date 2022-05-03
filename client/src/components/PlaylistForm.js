import { useEffect, useState } from "react";
import PlaylistService from "../services/PlaylistService";
import utf8 from "utf8";

function PlaylistForm() {
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    getPlaylist();
  });

  async function getPlaylist() {
    try {
      const response = await PlaylistService.getPlaylist();
      setPlaylist(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <button
        onClick={() => {
          const url = prompt("Добавить в плейлист: Url");
          if (!url) return;
          PlaylistService.add(url).then(() => {
            getPlaylist();
          });
        }}
      >
        Добавить в плейлист
      </button>
      {/* <button onClick={() => getPlaylist()}>Получить плейлист</button> */}
      <div>
        {playlist.map((media) => (
          <div key={media._id}>
            <div>{media.title}</div>
            <button
              onClick={() => {
                PlaylistService.remove(media._id).then(() => {
                  getPlaylist();
                });
              }}
            >
              Удалить из плейлиста
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaylistForm;
