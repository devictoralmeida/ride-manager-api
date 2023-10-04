"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CarsImagesRepository = void 0;
var _CarImage = require("../entities/CarImage");
var _dataSource = require("../../../../../data-source");
class CarsImagesRepository {
  constructor() {
    this.repository = void 0;
    this.repository = _dataSource.AppDataSource.getRepository(_CarImage.CarImage);
  }
  async create(car_id, image_name) {
    const carImage = this.repository.create({
      car_id,
      image_name
    });
    await this.repository.save(carImage);
    return carImage;
  }
}
exports.CarsImagesRepository = CarsImagesRepository;