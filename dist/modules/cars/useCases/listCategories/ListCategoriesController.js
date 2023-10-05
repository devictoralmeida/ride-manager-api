"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListCategoriesController = void 0;
var _tsyringe = require("tsyringe");
var _ListCategoriesUseCase = require("./ListCategoriesUseCase");
class ListCategoriesController {
  async handle(request, response) {
    const listCategoriesUseCase = _tsyringe.container.resolve(_ListCategoriesUseCase.ListCategoriesUseCase);
    const categories = await listCategoriesUseCase.execute();
    return response.status(200).json(categories);
  }
}
exports.ListCategoriesController = ListCategoriesController;