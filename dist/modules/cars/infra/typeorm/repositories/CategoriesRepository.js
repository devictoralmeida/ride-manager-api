"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CategoriesRepository = void 0;
var _Category = require("../entities/Category");
var _dataSource = require("../../../../../data-source");
class CategoriesRepository {
  // Assim só teremos acesso aos métodos do typeORM aqui dentro

  constructor() {
    this.repository = void 0;
    this.repository = _dataSource.AppDataSource.getRepository(_Category.Category);
  }
  async create({
    name,
    description
  }) {
    const category = this.repository.create({
      name,
      description
    });
    await this.repository.save(category);
    return category;
  }
  async list() {
    const categories = await this.repository.find();
    return categories;
  }
  async findByName(name) {
    const category = await this.repository.findOneBy({
      name
    });
    return category;
  }
}
exports.CategoriesRepository = CategoriesRepository;