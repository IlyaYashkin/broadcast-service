class Room {
  id;
  name;
  owner;
  sinks;
  playing;
  state;
  playlist;
  repeat;

  constructor(id, name, owner) {
    this.id = id;
    this.name = name;
    this.owner = owner;
    this.sinks = [];
    this.playing = "";
    this.state = "sleeping";
    this.playlist = [];
    this.repeat = false;
  }

  setState(state) {
    switch (state) {
      case "sleeping":
      case "downloading":
      case "broadcasting":
        this.state = state;
    }
  }
}

module.exports = Room;
