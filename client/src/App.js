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

  if (store.state === "main-form") {
    return <MainForm />;
  }

  if (store.state === "login-form") {
    return <LoginForm />;
  }

  if (store.state === "registration-form") {
    return <RegistrationForm />;
  }

  if (store.state === "create-room-form") {
    return <CreateRoomForm />;
  }

  if (store.state === "room-form") {
    return <RoomForm />;
  }

  if (store.state === "initial-form") {
    return <InitialForm />;
  }
}

export default observer(App);
