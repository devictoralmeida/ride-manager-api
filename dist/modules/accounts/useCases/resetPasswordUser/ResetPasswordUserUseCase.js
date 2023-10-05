"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResetPasswordUserUseCase = void 0;
require("reflect-metadata");
var _IUsersTokensRepository = require("../../repositories/IUsersTokensRepository");
var _tsyringe = require("tsyringe");
var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));
var _IDateProvider = require("../../../../shared/container/providers/DateProvider/IDateProvider");
var _IUsersRepository = require("../../repositories/IUsersRepository");
var _bcryptjs = require("bcryptjs");
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let ResetPasswordUserUseCase = exports.ResetPasswordUserUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('UsersTokensRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('DayjsDateProvider')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('UsersRepository')(target, undefined, 2);
}, _dec5 = Reflect.metadata("design:type", Function), _dec6 = Reflect.metadata("design:paramtypes", [typeof _IUsersTokensRepository.IUsersTokensRepository === "undefined" ? Object : _IUsersTokensRepository.IUsersTokensRepository, typeof _IDateProvider.IDateProvider === "undefined" ? Object : _IDateProvider.IDateProvider, typeof _IUsersRepository.IUsersRepository === "undefined" ? Object : _IUsersRepository.IUsersRepository]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = class ResetPasswordUserUseCase {
  constructor(usersTokensRepository, dateProvider, usersRepository) {
    this.usersTokensRepository = usersTokensRepository;
    this.dateProvider = dateProvider;
    this.usersRepository = usersRepository;
  }
  async execute({
    token,
    password
  }) {
    const userToken = await this.usersTokensRepository.findByRefreshToken(token);
    if (!userToken) {
      throw new _AppError.default('Invalid token', 409);
    }
    if (this.dateProvider.compareIfBefore(userToken.expires_date, this.dateProvider.dateNow())) {
      throw new _AppError.default('Invalid expired', 409);
    }
    const user = await this.usersRepository.findById(userToken.user_id);
    if (!user) {
      throw new _AppError.default('User not found', 404);
    }
    const newPassword = (0, _bcryptjs.hashSync)(password, 8);
    user.password = newPassword;
    await this.usersRepository.create(user);
    await this.usersTokensRepository.deleteById(userToken.id);
  }
}) || _class) || _class) || _class) || _class) || _class) || _class);