import { useState } from "react";
import UserService from "../services/UserService";

function UsersForm() {
  const [users, setUsers] = useState([]);

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <div>
        <button onClick={() => getUsers()}>Получить пользователей</button>
      </div>
      {users.map((user) => (
        <div key={user.email}>{user.email}</div>
      ))}
    </div>
  );
}

export default UsersForm;
