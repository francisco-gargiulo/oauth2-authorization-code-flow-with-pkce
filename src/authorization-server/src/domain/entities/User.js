module.exports = class User {
  constructor({ id, nickname, email }) {
    this.id = id;
    this.email = email;
    this.nickname = nickname;
  }
};
