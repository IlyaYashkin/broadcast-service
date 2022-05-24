import { useContext, useState, useEffect } from "react";
import { Context } from "../index";
import { AudioContext } from "../index";
import socketInit from "../connection/socketio";
import { toJS } from "mobx";
import PlayerForm from "./PlayerForm";

function RoomForm() {
  const [command, setCommand] = useState("");
  const [chat, setChat] = useState([]);
  const [serverMsg, setServerMsg] = useState([]);
  const { store } = useContext(Context);
  const { audio } = useContext(AudioContext);

  useEffect(() => {
    store.setSocket(socketInit(store.room.id, toJS(store.user)));
    store.socket.on("disconnect", () => {
      store.socket.disconnect();
      store.leaveRoom();
    });
    store.socket.on("message", (data) => {
      if (chat.length > 25) {
        chat.pop();
      }
      chat.unshift(data);
      const newChat = [...chat];
      setChat(newChat);
    });
    store.socket.on("server-message", (data) => {
      if (serverMsg > 50) {
        serverMsg.pop();
      }
      serverMsg.unshift(data);
      const newServerMsg = [...serverMsg];
      setServerMsg(newServerMsg);
    });
  }, []);

  function sendCommand() {
    if (command.length === 0) return;
    if (command.length > 200) {
      alert("Сообщение слишком длинное! (>200 символов)");
      return;
    }
    store.socket.emit("message", { msg: command });
    setCommand("");
  }

  return (
    <div>
      <PlayerForm />
      <div>
        <input
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              sendCommand();
            }
          }}
          onChange={(e) => {
            setCommand(e.target.value);
          }}
          value={command}
          type="text"
          placeholder="Команда"
        ></input>
        <button onClick={() => sendCommand()}>Отправить</button>
      </div>

      <div
        style={{
          display: "inline-flex",
        }}
      >
        <div
          style={{
            height: 470,
            width: 400,
            border: "1px solid",
            wordWrap: "break-word",
            overflowY: "scroll",
          }}
        >
          {chat.map((data, index) => (
            <div key={index}>
              {data.user.username}
              {data.user.isGuest ? " (guest)" : ""}: {data.msg}
            </div>
          ))}
        </div>
        <div
          style={{
            height: 470,
            width: 300,
            border: "1px solid",
            wordWrap: "break-word",
            overflowY: "scroll",
          }}
        >
          {serverMsg.map((data, index) => (
            <div key={index}>SERVER: {data.msg}</div>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          store.socket.disconnect();
          store.leaveRoom();
          audio.stop();
        }}
      >
        Назад
      </button>
    </div>
  );
}

export default RoomForm;
