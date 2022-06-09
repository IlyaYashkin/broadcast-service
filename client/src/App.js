import { useContext, useEffect } from "react";
import { Context } from "./index";
import LoginForm from "./components/LoginForm";
import InitialForm from "./components/InitialForm";
import RegistrationForm from "./components/RegistrationForm";
import MainForm from "./components/MainForm";
import CreateRoomForm from "./components/CreateRoomForm";
import RoomForm from "./components/RoomForm";
import { observer } from "mobx-react-lite";

function App() {
  const { store } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, []);

  if (store.isLoading) {
    return <div>Загрузка...</div>;
  }

  switch (store.state) {
    case "main-form":
      return <MainForm />;
    case "login-form":
      return <LoginForm />;
    case "registration-form":
      return <RegistrationForm />;
    case "create-room-form":
      return <CreateRoomForm />;
    case "room-form":
      return <RoomForm />;
    case "initial-form":
      return <InitialForm />;
  }
}

export default observer(App);
