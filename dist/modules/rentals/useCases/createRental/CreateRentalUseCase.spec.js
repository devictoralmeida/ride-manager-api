"use strict";

var _InMemoryCarsRepository = require("../../../cars/repositories/in-memory/InMemoryCarsRepository");
var _dayjs = _interopRequireDefault(require("dayjs"));
var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));
var _InMemoryRentalsRepository = require("./../../repositories/in-memory/InMemoryRentalsRepository");
var _CreateRentalUseCase = require("./CreateRentalUseCase");
var _DayjsDateProvider = require("../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let createRentalUseCase;
let inMemoryRentalsRepository;
let dayjsDateProvider;
let inMemoryCarsRepository;
describe('Create Rental', () => {
  const addOneDay = (0, _dayjs.default)().add(1, 'day').toDate();
  beforeEach(() => {
    inMemoryRentalsRepository = new _InMemoryRentalsRepository.InMemoryRentalsRepository();
    dayjsDateProvider = new _DayjsDateProvider.DayjsDateProvider();
    inMemoryCarsRepository = new _InMemoryCarsRepository.InMemoryCarsRepository();
    createRentalUseCase = new _CreateRentalUseCase.CreateRentalUseCase(inMemoryRentalsRepository, dayjsDateProvider, inMemoryCarsRepository);
  });
  it('should be able to create a new Rental', async () => {
    const car = await inMemoryCarsRepository.create({
      name: 'Test',
      brand: 'Brand test',
      category_id: '1234',
      daily_rate: 50,
      description: 'Car test',
      fine_amount: 50,
      license_plate: 'TEST-123'
    });
    const rental = await createRentalUseCase.execute({
      user_id: '12345',
      car_id: car.id,
      expected_return_date: addOneDay
    });
    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
    expect(car).toHaveProperty('available', false);
  });
  it('should NOT be able to create a new Rental if there is another open to the same user', async () => {
    await inMemoryRentalsRepository.create({
      car_id: '121210',
      expected_return_date: addOneDay,
      user_id: '12346'
    });
    const rental = createRentalUseCase.execute({
      user_id: '12346',
      car_id: '121211',
      expected_return_date: addOneDay
    });
    await expect(rental).rejects.toBeInstanceOf(_AppError.default);
    await expect(rental).rejects.toThrow('There is a rental in progress for user!');
  });
  it('should NOT be able to create a new rental if there is another open to the same car', async () => {
    await inMemoryRentalsRepository.create({
      car_id: '121219',
      expected_return_date: addOneDay,
      user_id: '12349'
    });
    const rental = createRentalUseCase.execute({
      user_id: '12399',
      car_id: '121219',
      expected_return_date: addOneDay
    });
    await expect(rental).rejects.toBeInstanceOf(_AppError.default);
    await expect(rental).rejects.toThrow('Car is unavailable');
  });
  it('should NOT be able to create a new Rental with invalid return time', async () => {
    const rental = createRentalUseCase.execute({
      user_id: '3210',
      car_id: '121219',
      expected_return_date: (0, _dayjs.default)().toDate()
    });
    await expect(rental).rejects.toBeInstanceOf(_AppError.default);
    await expect(rental).rejects.toThrow('Invalid return time!');
  });
});