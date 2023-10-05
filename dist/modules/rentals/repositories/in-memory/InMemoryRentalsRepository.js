"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InMemoryRentalsRepository = void 0;
var _Rental = require("../../infra/typeorm/entities/Rental");
var _uuid = require("uuid");
class InMemoryRentalsRepository {
  constructor() {
    this.rentals = [];
  }
  async create({
    car_id,
    user_id,
    expected_return_date
  }) {
    const rental = new _Rental.Rental();
    Object.assign(rental, {
      id: (0, _uuid.v4)(),
      created_at: new Date(),
      start_date: new Date(),
      car_id,
      user_id,
      expected_return_date
    });
    this.rentals.push(rental);
    return rental;
  }
  async findOpenRentalByCar(car_id) {
    return this.rentals.find(rental => rental.car_id === car_id && !rental.end_date);
  }
  async findOpenRentalByUser(user_id) {
    return this.rentals.find(rental => rental.user_id === user_id && !rental.end_date);
  }
  async findById(id) {
    return this.rentals.find(rental => rental.id === id);
  }
  async findByUser(user_id) {
    return this.rentals.filter(rental => rental.user_id === user_id);
  }
}
exports.InMemoryRentalsRepository = InMemoryRentalsRepository;