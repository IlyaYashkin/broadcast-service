import { useContext, useState } from "react";
import { Context } from "../index";
import { observer } from "mobx-react-lite";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { store } = useContext(Context);
  return (
    <div>
      <h1>Авторизация</h1>
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="text"
        placeholder="Email"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        placeholder="Password"
      />
      <button onClick={() => store.login(email, password)}>
        Авторизоваться
      </button>
      <button onClick={() => store.setState("initial-form")}>Назад</button>
    </div>
  );
}

export default LoginForm;
