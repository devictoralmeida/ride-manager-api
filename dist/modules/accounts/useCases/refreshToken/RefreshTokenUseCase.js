"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RefreshTokenUseCase = void 0;
require("dotenv/config");
require("reflect-metadata");
var _IUsersTokensRepository = require("../../repositories/IUsersTokensRepository");
var _IDateProvider = require("../../../../shared/container/providers/DateProvider/IDateProvider");
var _tsyringe = require("tsyringe");
var _jsonwebtoken = require("jsonwebtoken");
var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));
var _dec, _dec2, _dec3, _dec4, _dec5, _class;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let RefreshTokenUseCase = exports.RefreshTokenUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('UsersTokensRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('DayjsDateProvider')(target, undefined, 1);
}, _dec4 = Reflect.metadata("design:type", Function), _dec5 = Reflect.metadata("design:paramtypes", [typeof _IUsersTokensRepository.IUsersTokensRepository === "undefined" ? Object : _IUsersTokensRepository.IUsersTokensRepository, typeof _IDateProvider.IDateProvider === "undefined" ? Object : _IDateProvider.IDateProvider]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = class RefreshTokenUseCase {
  constructor(usersTokensRepository, dateProvider) {
    this.usersTokensRepository = usersTokensRepository;
    this.dateProvider = dateProvider;
  }
  async execute(token) {
    const {
      sub,
      email
    } = (0, _jsonwebtoken.verify)(token, process.env.REFRESH_SECRET_KEY.toString());
    const user_id = sub;
    const userToken = await this.usersTokensRepository.findByUserIdAndRefreshToken(user_id, token);
    if (!userToken) {
      throw new _AppError.default('Refresh Token does not exists', 409);
    }
    await this.usersTokensRepository.deleteById(userToken.id);
    const refresh_token = (0, _jsonwebtoken.sign)({
      email
    }, process.env.REFRESH_SECRET_KEY.toString(), {
      expiresIn: process.env.REFRESH_EXPIRES_IN.toString(),
      subject: user_id
    });
    const expires_date = process.env.REFRESH_EXPIRES_IN.toString().replace(/[^\d]+/g, '');
    const expires_date_formatted = this.dateProvider.addDays(parseInt(expires_date));
    await this.usersTokensRepository.create({
      user_id,
      expires_date: expires_date_formatted,
      refresh_token
    });
    const newToken = (0, _jsonwebtoken.sign)({}, process.env.SECRET_KEY.toString(), {
      expiresIn: process.env.EXPIRES_IN.toString(),
      subject: user_id
    });
    return {
      refresh_token,
      token: newToken
    };
  }
}) || _class) || _class) || _class) || _class) || _class);