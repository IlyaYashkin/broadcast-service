import { useContext, useState } from "react";
import { Context } from "../index";
import { observer } from "mobx-react-lite";

function CreateRoomForm() {
  const [roomName, setRoomName] = useState("");
  const { store } = useContext(Context);
  return (
    <div>
      <h1>Создать комнату</h1>
      <input
        onChange={(e) => setRoomName(e.target.value)}
        value={roomName}
        type="text"
        placeholder="Название комнаты"
      />
      <button
        onClick={() => {
          store.createRoom(roomName).then((room) => {
            store.joinRoom(room);
          });
        }}
      >
        Создать
      </button>
      <button
        onClick={() => {
          store.setState("main-form");
        }}
      >
        Назад
      </button>
    </div>
  );
}

export default CreateRoomForm;
