"use strict";

var _InMemorySpecificationsRepository = require("./../../repositories/in-memory/InMemorySpecificationsRepository");
var _InMemoryCarsRepository = require("../../repositories/in-memory/InMemoryCarsRepository");
var _createCarSpecificationUseCase = require("./createCarSpecificationUseCase");
var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let createCarSpecificationUseCase;
let inMemoryCarsRepository;
let inMemorySpecificationsRepository;
describe('Create Car Specifications', () => {
  beforeEach(() => {
    inMemoryCarsRepository = new _InMemoryCarsRepository.InMemoryCarsRepository();
    inMemorySpecificationsRepository = new _InMemorySpecificationsRepository.InMemorySpecificationsRepository();
    createCarSpecificationUseCase = new _createCarSpecificationUseCase.CreateCarSpecificationUseCase(inMemoryCarsRepository, inMemorySpecificationsRepository);
  });
  it('Should NOT be able to add a new specification to a non-existent car', async () => {
    const car_id = '123';
    const specifications_id = ['54321'];
    const result = createCarSpecificationUseCase.execute({
      car_id,
      specifications_id
    });
    await expect(result).rejects.toBeInstanceOf(_AppError.default);
  });
  it('Should be able to add a new specification to a car', async () => {
    const car = await inMemoryCarsRepository.create({
      brand: 'Brand',
      daily_rate: 100,
      description: 'Description Car',
      fine_amount: 60,
      license_plate: 'ABC-1234',
      name: 'Name Car',
      category_id: 'category'
    });
    const specification = await inMemorySpecificationsRepository.create({
      description: 'Teste',
      name: 'Teste'
    });
    const specifications_id = [specification.id];
    const specificationsCars = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id
    });
    expect(specificationsCars).toHaveProperty('specifications');
    expect(specificationsCars.specifications.length).toBe(1);
  });
});