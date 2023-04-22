const { randomUUID } = require("crypto");

const database = require("./database");

module.exports = class Repository {
  constructor(entity) {
    if (database[entity] === undefined) {
      database[entity] = [];
    }

    this.data = database[entity];
  }

  create(entity) {
    if (!entity || Object.keys(entity).length === 0) {
      return null;
    }

    const id = randomUUID();

    const newEntity = { ...entity, id };

    this.data.push(newEntity);

    return newEntity;
  }

  find(query = {}) {
    if (Object.keys(query).length === 0) {
      return null;
    }

    return this.data.find((entity) => {
      let match = [];

      for (let key in query) {
        if (entity[key] !== query[key]) {
          match.push(false);
        } else {
          match.push(true);
        }
      }

      return match.every((value) => value === true);
    });
  }

  filter(query = {}) {
    if (Object.keys(query).length === 0) {
      return this.data;
    }

    return this.data.filter((entity) => {
      let match = [];

      for (let key in query) {
        if (entity[key] !== query[key]) {
          match.push(false);
        } else {
          match.push(true);
        }
      }

      return match.every((value) => value === true);
    });
  }

  update({ id, ...entity }) {
    const index = this.data.findIndex((_entity) => _entity.id === id);

    if (index >= 0) {
      this.data[index] = { ...entity, id };

      return this.data[index];
    }

    return null;
  }

  delete(id) {
    const index = this.data.findIndex((entity) => entity.id === id);

    if (index >= 0) {
      this.data.splice(index, 1);

      return this.data[index];
    }

    return null;
  }
};
