"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DevolutionRentalUseCase = void 0;
var _ICarsRepository = require("../../../cars/repositories/ICarsRepository");
var _IRentalsRepository = require("../../repositories/IRentalsRepository");
var _IDateProvider = require("../../../../shared/container/providers/DateProvider/IDateProvider");
var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));
var _tsyringe = require("tsyringe");
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let DevolutionRentalUseCase = exports.DevolutionRentalUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('RentalsRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('DayjsDateProvider')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('CarsRepository')(target, undefined, 2);
}, _dec5 = Reflect.metadata("design:type", Function), _dec6 = Reflect.metadata("design:paramtypes", [typeof _IRentalsRepository.IRentalsRepository === "undefined" ? Object : _IRentalsRepository.IRentalsRepository, typeof _IDateProvider.IDateProvider === "undefined" ? Object : _IDateProvider.IDateProvider, typeof _ICarsRepository.ICarsRepository === "undefined" ? Object : _ICarsRepository.ICarsRepository]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = class DevolutionRentalUseCase {
  constructor(rentalsRepository, dateProvider, carsRepository) {
    this.rentalsRepository = rentalsRepository;
    this.dateProvider = dateProvider;
    this.carsRepository = carsRepository;
  }
  async execute({
    id,
    user_id
  }) {
    const rental = await this.rentalsRepository.findById(id);
    const car = await this.carsRepository.findById(rental.car_id);
    if (!rental) {
      throw new _AppError.default('Rental does not exists.');
    }
    if (!car) {
      throw new _AppError.default('Car does not exists.');
    }
    const minimum_daily = 1;
    const dateNow = this.dateProvider.dateNow();
    let dailiesNumber = this.dateProvider.compareInDays(rental.start_date, this.dateProvider.dateNow());
    if (dailiesNumber <= 0) {
      dailiesNumber = minimum_daily;
    }
    const delay = this.dateProvider.compareInDays(dateNow, rental.expected_return_date);
    let total = 0;
    if (delay > 0) {
      const calculate_fine = delay * car.fine_amount;
      total = calculate_fine;
    }
    total += dailiesNumber * car.daily_rate;
    rental.end_date = this.dateProvider.dateNow();
    rental.total = total;
    await this.rentalsRepository.create(rental);
    await this.carsRepository.updateAvailable(car.id, true);
    return rental;
  }
}) || _class) || _class) || _class) || _class) || _class) || _class);