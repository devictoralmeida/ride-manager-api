"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpecificationsRepository = void 0;
var _typeorm = require("typeorm");
var _dataSource = require("../../../../../data-source");
var _Specification = require("../entities/Specification");
class SpecificationsRepository {
  constructor() {
    this.repository = void 0;
    this.repository = _dataSource.AppDataSource.getRepository(_Specification.Specification);
  }
  async findByIds(ids) {
    const specifications = await this.repository.find({
      where: {
        id: (0, _typeorm.In)(ids)
      }
    });
    return specifications;
  }
  async create({
    name,
    description
  }) {
    const specification = this.repository.create({
      name,
      description
    });
    await this.repository.save(specification);
    return specification;
  }
  async findByName(name) {
    const specification = await this.repository.findOneBy({
      name
    });
    return specification;
  }
}
exports.SpecificationsRepository = SpecificationsRepository;