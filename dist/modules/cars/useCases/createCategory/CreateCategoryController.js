"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateCategoryController = void 0;
var _tsyringe = require("tsyringe");
var _CreateCategoryUseCase = require("./CreateCategoryUseCase");
class CreateCategoryController {
  async handle(request, response) {
    const {
      name,
      description
    } = request.body;
    const createCategoryUseCase = _tsyringe.container.resolve(_CreateCategoryUseCase.CreateCategoryUseCase); // Injetando todas as dependências aqui

    const newCategory = await createCategoryUseCase.execute({
      name,
      description
    });
    return response.status(201).json(newCategory);
  }
}
exports.CreateCategoryController = CreateCategoryController;