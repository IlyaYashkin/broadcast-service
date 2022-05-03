import { useContext, useEffect } from "react";
import { Context } from "./index";
import LoginForm from "./components/LoginForm";
import SearchForm from "./components/SearchForm";
import PlaylistForm from "./components/PlaylistForm";
import PlayerForm from "./components/PlayerForm";
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

  if (!store.isAuth) {
    // return <LoginForm />;
    return (
      <div>
        <h1>Авторизуйтесь</h1>
        <LoginForm />
      </div>
    );
  }

  return (
    <div>
      <h1>{`Пользователь авторизован ${store.user.email}`}</h1>
      <button onClick={() => store.logout()}>Выйти</button>
      <SearchForm />
      <PlaylistForm />
      <PlayerForm />
    </div>
  );
}

export default observer(App);
