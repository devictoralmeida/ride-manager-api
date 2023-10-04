"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InMemoryCategoriesRepository = void 0;
var _Category = require("../../infra/typeorm/entities/Category");
var _uuid = require("uuid");
class InMemoryCategoriesRepository {
  constructor() {
    this.categories = [];
  }
  async findByName(name) {
    const foundedCategory = this.categories.find(category => category.name === name);
    if (!foundedCategory) {
      return;
    }
    return foundedCategory;
  }
  async list() {
    const categoriesList = this.categories;
    return categoriesList;
  }
  async create({
    name,
    description
  }) {
    const newCategory = new _Category.Category();
    Object.assign(newCategory, {
      id: (0, _uuid.v4)(),
      created_at: new Date(),
      name,
      description
    });
    this.categories.push(newCategory);
    return newCategory;
  }
}
exports.InMemoryCategoriesRepository = InMemoryCategoriesRepository;