import { useContext, useState } from "react";
import { Context } from "../index";
import RoomListForm from "./RoomListForm";

function MainForm() {
  const { store } = useContext(Context);

  return (
    <div>
      <h1>
        Добро пожаловать,{" "}
        {store.guestAuth
          ? `${store.user.username} (Гость)`
          : store.user.username}
      </h1>
      {!store.guestAuth && (
        <button onClick={() => store.setState("create-room-form")}>
          Создать комнату
        </button>
      )}
      <button
        onClick={() => {
          store.logout();
        }}
      >
        Выйти
      </button>
      <RoomListForm />
    </div>
  );
}

export default MainForm;
