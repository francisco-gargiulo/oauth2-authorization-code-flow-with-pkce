const User = require("./User");

module.exports = class UserService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(entity) {
    if (!entity) {
      throw new Error("Entity required");
    }

    const newEntity = this.repository.create(entity);

    return new User(newEntity);
  }

  async update({ id, ...entity }) {
    if (!id) {
      throw new Error("ID required");
    }

    const updatedEntity = this.repository.update({ id, ...entity });

    if (!updatedEntity) {
      throw new Error("Entity not found");
    }

    return new User(updatedEntity);
  }

  async delete(id) {
    if (!id) {
      throw new Error("ID required");
    }

    const deletedEntity = this.repository.delete(id);

    if (!deletedEntity) {
      throw new Error("Entity not found");
    }

    return new User(deletedEntity);
  }

  async findById(id) {
    if (!id) {
      throw new Error("ID required");
    }

    const entity = await this.repository.find({ id });

    if (!entity) {
      throw new Error("Entity not found");
    }

    return new User(entity);
  }

  async findByEmail(email) {
    if (!email) {
      throw new Error("email required");
    }

    const entity = await this.repository.find({ email });

    if (!entity) {
      throw new Error("Entity not found");
    }

    return new User(entity);
  }

  async findAll() {
    return await this.repository.filter().map((entity) => new User(entity));
  }
};
