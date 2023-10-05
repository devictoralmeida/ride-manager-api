"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InMemorySpecificationsRepository = void 0;
var _Specification = require("../../infra/typeorm/entities/Specification");
var _uuid = require("uuid");
class InMemorySpecificationsRepository {
  constructor() {
    this.specifications = [];
  }
  async create({
    name,
    description
  }) {
    const specification = new _Specification.Specification();
    Object.assign(specification, {
      id: (0, _uuid.v4)(),
      created_at: new Date(),
      name,
      description
    });
    this.specifications.push(specification);
    return specification;
  }
  async findByName(name) {
    const findedSpecification = this.specifications.find(specification => specification.name === name);
    return findedSpecification;
  }
  async findByIds(ids) {
    const allSpecifications = this.specifications.filter(specification => ids.includes(specification.id));
    return allSpecifications;
  }
}
exports.InMemorySpecificationsRepository = InMemorySpecificationsRepository;