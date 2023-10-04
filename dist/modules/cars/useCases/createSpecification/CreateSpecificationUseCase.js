"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateSpecificationUseCase = void 0;
require("reflect-metadata");
var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));
var _ISpecificationsRepository = require("../../repositories/ISpecificationsRepository");
var _tsyringe = require("tsyringe");
var _dec, _dec2, _dec3, _dec4, _class;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let CreateSpecificationUseCase = exports.CreateSpecificationUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('SpecificationsRepository')(target, undefined, 0);
}, _dec3 = Reflect.metadata("design:type", Function), _dec4 = Reflect.metadata("design:paramtypes", [typeof _ISpecificationsRepository.ISpecificationRepository === "undefined" ? Object : _ISpecificationsRepository.ISpecificationRepository]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = class CreateSpecificationUseCase {
  constructor(specificationsRepository) {
    this.specificationsRepository = specificationsRepository;
  }
  async execute({
    name,
    description
  }) {
    const specificationAlreadyExists = await this.specificationsRepository.findByName(name);
    if (specificationAlreadyExists) throw new _AppError.default('Specification already exists', 409);
    const specification = await this.specificationsRepository.create({
      name,
      description
    });
    return specification;
  }
}) || _class) || _class) || _class) || _class);