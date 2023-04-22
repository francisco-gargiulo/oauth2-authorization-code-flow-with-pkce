module.exports = class Client {
  constructor({ id, secret, name, redirectUri }) {
    this.id = id;
    this.secret = secret;
    this.name = name;
    this.redirectUri = redirectUri;
  }

  verifySecret(secret) {
    return this.secret === secret;
  }
};
