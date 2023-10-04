"use strict";

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));
var _InMemoryCategoriesRepository = require("../../repositories/in-memory/InMemoryCategoriesRepository");
var _CreateCategoryUseCase = require("./CreateCategoryUseCase");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let categoriesRepositoryInMemory;
let createCategoryUseCase;
describe('Create Category Use Case', () => {
  beforeEach(() => {
    // Aqui vamos instanciar as nossas variáveis
    categoriesRepositoryInMemory = new _InMemoryCategoriesRepository.InMemoryCategoriesRepository();
    createCategoryUseCase = new _CreateCategoryUseCase.CreateCategoryUseCase(categoriesRepositoryInMemory);
  });
  it('should be able to create a new category', async () => {
    const newCategory = await createCategoryUseCase.execute({
      name: 'Category Test',
      description: 'Category Description Test'
    });
    const expectedResult = {
      id: expect.any(String),
      name: 'Category Test',
      description: 'Category Description Test',
      created_at: expect.any(Date)
    };
    expect(newCategory).toStrictEqual(expect.objectContaining(expectedResult));
  });
  it('should NOT be able to create a new category with name in duplicity', async () => {
    await createCategoryUseCase.execute({
      name: 'Category Test',
      description: 'Category Description Test'
    });
    const result = createCategoryUseCase.execute({
      name: 'Category Test',
      description: 'Category Description Test'
    });
    await expect(result).rejects.toThrowError(_AppError.default);
    await expect(result).rejects.toThrow('Category already exists!');
  });
});