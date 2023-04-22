const AuthorizationCode = require("../entities/AuthorizationCode");

module.exports = class AuthorizationCodeService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(entity) {
    if (!entity) {
      throw new Error("Entity required");
    }

    const newEntity = this.repository.create(entity);

    return new AuthorizationCode(newEntity);
  }

  async redeem(id, codeVerifier) {
    if (!id) {
      throw new Error("ID required");
    }

    const entity = await this.repository.find({
      id,
    });

    if (!entity) {
      throw new Error("Entity not found");
    }

    const authorizationCode = new AuthorizationCode(entity);

    if (!authorizationCode.active) {
      throw new Error("Entity expired");
    }

    authorizationCode.redeem(codeVerifier);

    const updatedEntity = this.repository.update({
      ...authorizationCode,
      id,
    });

    return new AuthorizationCode(updatedEntity);
  }
};
