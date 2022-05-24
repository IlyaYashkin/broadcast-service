import axios from "axios";
import { makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";
import { API_URL } from "../connection";
import RoomService from "../services/RoomService";

export default class Store {
  user = {};
  room = {};
  socket = {};
  guestAuth = false;
  isLoading = false;
  state = "initial-form";

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user) {
    this.user = user;
  }

  setRoom(room) {
    this.room = room;
  }

  setSocket(socket) {
    this.socket = socket;
  }

  setGuestAuth(bool) {
    this.guestAuth = bool;
  }

  setLoading(bool) {
    this.isLoading = bool;
  }

  setState(state) {
    switch (state) {
      case "initial-form":
      case "main-form":
      case "login-form":
      case "registration-form":
      case "create-room-form":
      case "room-form":
        this.state = state;
    }
  }

  guest(name) {
    this.setGuestAuth(true);
    this.setUser({ username: name });
    this.setState("main-form");
  }

  joinRoom(room) {
    this.setRoom(room);
    this.setState("room-form");
  }

  leaveRoom() {
    this.setRoom({});
    this.setState("main-form");
  }

  async createRoom(roomName) {
    try {
      const response = await RoomService.create(roomName);
      return response.data;
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }

  async login(email, password) {
    try {
      const response = await AuthService.login(email, password);
      console.log(response);
      localStorage.setItem("token", response.data.accessToken);
      this.setUser(response.data.user);
      this.setState("main-form");
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }

  async registration(username, email, password) {
    try {
      const response = await AuthService.registration(
        username,
        email,
        password
      );
      localStorage.setItem("token", response.data.accessToken);
      this.setUser(response.data.user);
      this.setState("main-form");
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }

  async logout() {
    try {
      /*const response = */ await AuthService.logout();
      localStorage.removeItem("token");
      this.setUser({});
      this.setGuestAuth(false);
      this.setState("initial-form");
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/refresh`, {
        withCredentials: true,
      });
      console.log(response);
      localStorage.setItem("token", response.data.accessToken);
      this.setState("main-form");
      this.setUser(response.data.user);
    } catch (e) {
      console.log(e.response?.data?.message);
    } finally {
      this.setLoading(false);
    }
  }
}
