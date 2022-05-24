import { useContext, useState, useEffect } from "react";
import { Context } from "../index";
import { AudioContext } from "../index";
import { observer } from "mobx-react-lite";

function PlayerForm() {
  const { store } = useContext(Context);
  const { audio } = useContext(AudioContext);

  useEffect(() => {
    audio.play(store.room.id);
  }, []);

  let buttonText;
  switch (audio.state) {
    case "sleeping":
      buttonText = "Play";
      break;
    case "playing":
      buttonText = "Stop";
      break;
    case "loading":
      buttonText = "Loading...";
      break;
  }

  return (
    <div>
      <button
        onClick={() => {
          switch (audio.state) {
            case "sleeping":
              audio.play(store.room.id);
              break;
            case "loading":
            case "playing":
              audio.stop();
              break;
          }
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default observer(PlayerForm);
