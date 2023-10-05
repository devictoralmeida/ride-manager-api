"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ImportCategoryController = void 0;
var _ImportCategoryUseCase = require("./ImportCategoryUseCase");
var _tsyringe = require("tsyringe");
/* eslint-disable @typescript-eslint/no-non-null-assertion */

class ImportCategoryController {
  async handle(request, response) {
    const {
      file
    } = request;
    const importCategoryUseCase = _tsyringe.container.resolve(_ImportCategoryUseCase.ImportCategoryUseCase);
    await importCategoryUseCase.execute(file);
    return response.status(201).json(file);
  }
}
exports.ImportCategoryController = ImportCategoryController;