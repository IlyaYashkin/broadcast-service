import { useContext, useState, useEffect } from "react";
import { Context } from "../index";
import { AudioContext } from "../index";
import socketInit from "../connection/socketio";
import { toJS } from "mobx";
import PlayerForm from "./PlayerForm";

function RoomForm() {
  const [command, setCommand] = useState("");
  const [broadcastInfo, setBroadcastInfo] = useState({
    state: "sleeping",
    title: " ",
  });
  const [chat, setChat] = useState([]);
  const [serverMsg, setServerMsg] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
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
      console.log(data);
      serverMsg.unshift(`SERVER: ${data.msg}`);
      if (data.searchResult) {
        setSearchResult(data.searchResult);
      }
      const newServerMsg = [...serverMsg];
      setServerMsg(newServerMsg);
    });
    store.socket.on("broadcast-info", (data) => {
      setBroadcastInfo(data);
    });
  }, []);

  function sendCommand(specificCommand = null) {
    if (specificCommand) {
      store.socket.emit("message", { msg: specificCommand });
      return;
    }
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
        <div>Статус: {broadcastInfo.state}</div>
        <div>Сейчас играет: {broadcastInfo.title}</div>
      </div>
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
            width: 600,
            border: "1px solid",
            wordWrap: "break-word",
            overflowY: "scroll",
          }}
        >
          {serverMsg.map((data, index) => (
            <div key={index}>{data}</div>
          ))}
        </div>
        <div>
          {searchResult.map((data, index) => (
            <div key={index}>
              <a
                href="#"
                onClick={() => {
                  sendCommand(`!url ${data.url}`);
                  setSearchResult([]);
                }}
              >
                {index + 1}.{data.title}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RoomForm;
