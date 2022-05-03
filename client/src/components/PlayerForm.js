import { useContext, useState } from "react";
import { AudioContext } from "../index";

function PlayerForm() {
  const { audio } = useContext(AudioContext);

  return (
    <div>
      <button
        onClick={() => {
          audio.play();
        }}
      >
        Play
      </button>
      <button
        onClick={() => {
          audio.pause();
        }}
      >
        Pause
      </button>
      <button
        onClick={() => {
          audio.stop();
        }}
      >
        Stop
      </button>
    </div>
  );
}

export default PlayerForm;
