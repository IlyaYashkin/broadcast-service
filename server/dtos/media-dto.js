module.exports = class MediaDto {
  id;
  source;
  url;
  title;

  constructor(model) {
    this.id = model._id;
    this.source = model.source;
    this.url = model.url;
    this.title = model.title;
  }
};
