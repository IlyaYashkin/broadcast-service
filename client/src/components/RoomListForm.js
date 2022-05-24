import { useContext, useState, useEffect } from "react";
import { Context } from "../index";
import { observer } from "mobx-react-lite";
import RoomService from "../services/RoomService";

function RoomListForm() {
  const [roomList, setRoomList] = useState([]);
  const { store } = useContext(Context);

  function getRoomList() {
    RoomService.fetchRooms().then((response) => {
      setRoomList(response.data);
    });
  }

  useEffect(() => {
    getRoomList();
  }, []);

  return (
    <div>
      <button onClick={() => getRoomList()}>Обновить список комнат</button>
      {roomList.map((room) => (
        <div key={room.id}>
          <div>ID: {room.id}</div>
          <div>Название: {room.name}</div>
          <button
            onClick={() => {
              store.joinRoom(room);
            }}
          >
            Войти
          </button>
        </div>
      ))}
    </div>
  );
}

export default RoomListForm;
