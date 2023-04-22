const jwt = require("jsonwebtoken");
const Token = require("../entities/Token");

const JWT_SECRET = "your_jwt_secret";

module.exports = class TokenService {
  constructor(repository) {
    this.repository = repository;
  }

  signJWT(token) {
    return jwt.sign(token.toJSON(), JWT_SECRET, {
      algorithm: "HS256",
    });
  }

  verifyJWT(token) {
    return jwt.verify(token, JWT_SECRET);
  }

  decodeJWT(token) {
    return jwt.decode(token);
  }

  async create({ clientId, userId }) {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 3600;
    const iss = "http://localhost:3000";
    const aud = "protected-resource";
    const sub = userId;

    const entity = await this.repository.create({
      sub,
      clientId,
      iss,
      aud,
      iat,
      exp,
    });

    return new Token(entity);
  }

  async findById(id) {
    if (!id) {
      throw new Error("ID required");
    }

    const entity = await this.repository.find({ id });

    if (!entity) {
      throw new Error("Entity not found");
    }

    return new Token(entity);
  }

  async delete(id) {
    if (!id) {
      throw new Error("ID required");
    }

    this.repository.delete(id);

    return null;
  }
};
