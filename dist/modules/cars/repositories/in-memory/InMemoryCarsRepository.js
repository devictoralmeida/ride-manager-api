"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InMemoryCarsRepository = void 0;
var _Car = require("../../infra/typeorm/entities/Car");
var _uuid = require("uuid");
class InMemoryCarsRepository {
  constructor() {
    this.cars = [];
  }
  async create({
    brand,
    daily_rate,
    description,
    fine_amount,
    license_plate,
    name,
    category_id,
    available,
    id
  }) {
    const car = new _Car.Car();
    Object.assign(car, {
      id: id ?? (0, _uuid.v4)(),
      created_at: new Date(),
      available: available ?? true,
      brand,
      daily_rate,
      description,
      fine_amount,
      license_plate,
      name,
      category_id
    });
    this.cars.push(car);
    return car;
  }
  async findByLicensePlate(license_plate) {
    return this.cars.find(car => car.license_plate === license_plate);
  }
  async findById(id) {
    return this.cars.find(car => car.id === id);
  }
  async findAvailable(brand, category_id, name) {
    const allCars = this.cars.filter(car => {
      if (car.available === true || brand && car.brand === brand || category_id && car.category_id === category_id || name && car.name === name) {
        return car;
      }
      return null;
    });
    return allCars;
  }
  async updateAvailable(id, available) {
    const carIndex = this.cars.findIndex(car => car.id === id);
    if (carIndex >= 0) {
      this.cars[carIndex].available = available;
    }
  }
}
exports.InMemoryCarsRepository = InMemoryCarsRepository;