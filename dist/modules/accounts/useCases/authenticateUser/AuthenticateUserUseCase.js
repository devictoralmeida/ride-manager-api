"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthenticateUserUseCase = void 0;
require("dotenv/config");
require("reflect-metadata");
var _tsyringe = require("tsyringe");
var _bcryptjs = require("bcryptjs");
var _jsonwebtoken = require("jsonwebtoken");
var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));
var _IUsersRepository = require("../../repositories/IUsersRepository");
var _IUsersTokensRepository = require("../../repositories/IUsersTokensRepository");
var _IDateProvider = require("../../../../shared/container/providers/DateProvider/IDateProvider");
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let AuthenticateUserUseCase = exports.AuthenticateUserUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('UsersRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('UsersTokensRepository')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('DayjsDateProvider')(target, undefined, 2);
}, _dec5 = Reflect.metadata("design:type", Function), _dec6 = Reflect.metadata("design:paramtypes", [typeof _IUsersRepository.IUsersRepository === "undefined" ? Object : _IUsersRepository.IUsersRepository, typeof _IUsersTokensRepository.IUsersTokensRepository === "undefined" ? Object : _IUsersTokensRepository.IUsersTokensRepository, typeof _IDateProvider.IDateProvider === "undefined" ? Object : _IDateProvider.IDateProvider]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = class AuthenticateUserUseCase {
  constructor(usersRepository, usersTokensRepository, dateProvider) {
    this.usersRepository = usersRepository;
    this.usersTokensRepository = usersTokensRepository;
    this.dateProvider = dateProvider;
  }
  async execute({
    email,
    password
  }) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new _AppError.default('Email or password incorrect', 401);
    }
    const passwordMatch = (0, _bcryptjs.compareSync)(password, user.password);
    if (!passwordMatch) {
      throw new _AppError.default('Email or password incorrect', 401);
    }
    const token = (0, _jsonwebtoken.sign)({
      admin: user.isAdmin
    }, process.env.SECRET_KEY.toString(), {
      expiresIn: process.env.EXPIRES_IN.toString(),
      subject: user.id
    });
    const refresh_token = (0, _jsonwebtoken.sign)({
      email: user.email
    }, process.env.REFRESH_SECRET_KEY.toString(), {
      expiresIn: process.env.REFRESH_EXPIRES_IN.toString(),
      subject: user.id
    });
    const expires_date = process.env.REFRESH_EXPIRES_IN.toString().replace(/[^\d]+/g, '');
    const expires_date_formatted = this.dateProvider.addDays(parseInt(expires_date));
    await this.usersTokensRepository.create({
      user_id: user.id,
      expires_date: expires_date_formatted,
      refresh_token
    });
    const tokenReturn = {
      token,
      refresh_token,
      user: {
        name: user.name,
        email: user.email
      }
    };
    return tokenReturn;
  }
}) || _class) || _class) || _class) || _class) || _class) || _class);