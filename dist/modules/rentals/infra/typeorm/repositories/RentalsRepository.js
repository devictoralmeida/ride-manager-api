"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RentalsRepository = void 0;
var _dataSource = require("../../../../../data-source");
var _Rental = require("../entities/Rental");
class RentalsRepository {
  constructor() {
    this.repository = void 0;
    this.repository = _dataSource.AppDataSource.getRepository(_Rental.Rental);
  }
  async findOpenRentalByCar(car_id) {
    const foundedOpenByCar = await this.repository.findOne({
      where: {
        car_id,
        end_date: null
      }
    });
    return foundedOpenByCar;
  }
  async findOpenRentalByUser(user_id) {
    const foundedOpenByUser = await this.repository.findOne({
      where: {
        user_id,
        end_date: null
      }
    });
    return foundedOpenByUser;
  }
  async create({
    car_id,
    user_id,
    expected_return_date,
    id,
    end_date,
    total
  }) {
    const rental = this.repository.create({
      car_id,
      expected_return_date,
      user_id,
      id,
      end_date,
      total
    });
    await this.repository.save(rental);
    return rental;
  }
  async findById(id) {
    const foundedCar = await this.repository.findOneBy({
      id
    });
    return foundedCar;
  }
  async findByUser(user_id) {
    const rentals = await this.repository.find({
      where: {
        user_id
      },
      relations: ['car']
    });
    return rentals;
  }
}
exports.RentalsRepository = RentalsRepository;