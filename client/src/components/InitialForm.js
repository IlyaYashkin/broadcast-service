import { useContext, useState } from "react";
import { Context } from "../index";
import { observer } from "mobx-react-lite";

function InitialForm() {
  const [name, setName] = useState("");
  const { store } = useContext(Context);

  return (
    <div>
      <h1>Добро пожаловать</h1>
      <input
        onChange={(e) => setName(e.target.value)}
        value={name}
        type="text"
        placeholder="Имя"
      ></input>
      <button
        onClick={() => {
          if (name.length <= 3) {
            alert("Имя пользователя от 4-х букв!");
            return;
          }
          store.guest(name);
        }}
      >
        Войти как гость
      </button>
      <button
        onClick={() => {
          store.setState("login-form");
        }}
      >
        Авторизоваться
      </button>
      <button
        onClick={() => {
          store.setState("registration-form");
        }}
      >
        Зарегистрироваться
      </button>
    </div>
  );
}

export default InitialForm;
