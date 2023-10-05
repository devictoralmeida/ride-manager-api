"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SendForgotPasswordMailUseCase = void 0;
require("dotenv/config");
require("reflect-metadata");
var _IUsersRepository = require("../../repositories/IUsersRepository");
var _tsyringe = require("tsyringe");
var _IUsersTokensRepository = require("../../repositories/IUsersTokensRepository");
var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));
var _path = _interopRequireDefault(require("path"));
var _uuid = require("uuid");
var _IDateProvider = require("../../../../shared/container/providers/DateProvider/IDateProvider");
var _IMailProvider = require("../../../../shared/container/providers/MailProvider/IMailProvider");
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let SendForgotPasswordMailUseCase = exports.SendForgotPasswordMailUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('UsersRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('UsersTokensRepository')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('DayjsDateProvider')(target, undefined, 2);
}, _dec5 = function (target, key) {
  return (0, _tsyringe.inject)('MailProvider')(target, undefined, 3);
}, _dec6 = Reflect.metadata("design:type", Function), _dec7 = Reflect.metadata("design:paramtypes", [typeof _IUsersRepository.IUsersRepository === "undefined" ? Object : _IUsersRepository.IUsersRepository, typeof _IUsersTokensRepository.IUsersTokensRepository === "undefined" ? Object : _IUsersTokensRepository.IUsersTokensRepository, typeof _IDateProvider.IDateProvider === "undefined" ? Object : _IDateProvider.IDateProvider, typeof _IMailProvider.IMailProvider === "undefined" ? Object : _IMailProvider.IMailProvider]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = _dec7(_class = class SendForgotPasswordMailUseCase {
  constructor(usersRepository, usersTokensRepository, dateProvider, mailProvider) {
    this.usersRepository = usersRepository;
    this.usersTokensRepository = usersTokensRepository;
    this.dateProvider = dateProvider;
    this.mailProvider = mailProvider;
  }
  async execute(email) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new _AppError.default('User not found', 404);
    }
    const token = (0, _uuid.v4)();
    const expires_date = this.dateProvider.addHours(3);
    const templatePath = _path.default.join(__dirname, '../../views/emails/forgotPassword.hbs');
    const variables = {
      name: user.name,
      link: `${process.env.FORGOT_MAIL_URL}${token}`
    };
    await this.usersTokensRepository.create({
      refresh_token: token,
      user_id: user.id,
      expires_date
    });
    await this.mailProvider.sendMail(email, 'Recuperação de senha', variables, templatePath);
  }
}) || _class) || _class) || _class) || _class) || _class) || _class) || _class);