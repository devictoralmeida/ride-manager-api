"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CarsRepository = void 0;
var _Car = require("../entities/Car");
var _uuid = require("uuid");
var _dataSource = require("../../../../../data-source");
class CarsRepository {
  constructor() {
    this.repository = void 0;
    this.repository = _dataSource.AppDataSource.getRepository(_Car.Car);
  }
  async create({
    brand,
    daily_rate,
    description,
    fine_amount,
    license_plate,
    name,
    category_id,
    specifications,
    id
  }) {
    const car = this.repository.create({
      brand,
      daily_rate,
      description,
      fine_amount,
      license_plate,
      name,
      category_id,
      specifications,
      id: id ?? (0, _uuid.v4)()
    });
    await this.repository.save(car);
    return car;
  }
  async findByLicensePlate(license_plate) {
    const car = await this.repository.findOneBy({
      license_plate
    });
    if (!car) {
      return;
    }
    return car;
  }
  async findById(id) {
    const car = await this.repository.findOneBy({
      id
    });
    if (!car) {
      return;
    }
    return car;
  }
  async findAvailable(brand, category_id, name) {
    const carsQuery = this.repository.createQueryBuilder('c').where('available = :available', {
      available: true
    });
    if (brand) {
      carsQuery.andWhere('brand = :brand', {
        brand
      });
    }
    if (name) {
      carsQuery.andWhere('name = :name', {
        name
      });
    }
    if (category_id) {
      carsQuery.andWhere('category_id = :category_id', {
        category_id
      });
    }
    const cars = await carsQuery.getMany();
    return cars;
  }
  async updateAvailable(id, available) {
    const car = await this.repository.createQueryBuilder().update().set({
      available
    }).where('id = :id').setParameters({
      id
    }).execute();
  }
}
exports.CarsRepository = CarsRepository;