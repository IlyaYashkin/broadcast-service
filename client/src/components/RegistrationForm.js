import { useContext, useState } from "react";
import { Context } from "../index";
import { observer } from "mobx-react-lite";

function RegistrationForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { store } = useContext(Context);
  return (
    <div>
      <h1>Регистрация</h1>
      <input
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        type="text"
        placeholder="Username"
      />
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        placeholder="Email"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        placeholder="Password"
      />
      <button onClick={() => store.registration(username, email, password)}>
        Регистрация
      </button>
      <button onClick={() => store.setState("initial-form")}>Назад</button>
    </div>
  );
}

export default RegistrationForm;
