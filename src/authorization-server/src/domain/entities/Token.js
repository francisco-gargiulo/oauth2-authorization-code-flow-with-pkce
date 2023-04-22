class Token {
  constructor({ id, sub, clientId, iss, aud, iat, exp }) {
    this.sub = sub;
    this.client_id = clientId;
    this.iss = iss;
    this.aud = aud;
    this.iat = iat;
    this.exp = exp;
    this.jti = id;
  }

  toJSON() {
    return {
      sub: this.sub,
      client_id: this.client_id,
      iss: this.iss,
      aud: this.aud,
      iat: this.iat,
      exp: this.exp,
      jti: this.jti,
    };
  }
}

module.exports = Token;
