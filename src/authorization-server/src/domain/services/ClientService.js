const Client = require("../entities/Client");

module.exports = class ClientService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(entity) {
    const newEntity = this.repository.create(entity);

    return new Client(newEntity);
  }

  async update(entity) {
    if (!entity.id) {
      throw new Error("Entity id undefined");
    }

    const updatedEntity = this.repository.update(entity);

    if (!updatedEntity) {
      throw new Error("Entity not found");
    }

    return new Client(updatedEntity);
  }

  async delete(id) {
    const entity = await this.repository.find({ id });

    if (!entity) {
      throw new Error("Entity not found");
    }

    this.repository.delete(id);

    return new Client(entity);
  }

  async findById(id) {
    const entity = await this.repository.find({ id });

    if (!entity) {
      throw new Error("Entity not found");
    }

    return new Client(entity);
  }

  async findAll() {
    return await this.repository.filter().map((entity) => new Client(entity));
  }
};
