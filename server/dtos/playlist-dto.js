module.exports = class PlaylistDto {
  id;
  name;
  user;

  constructor(model) {
    this.id = model._id;
    this.name = model.name;
  }
};
