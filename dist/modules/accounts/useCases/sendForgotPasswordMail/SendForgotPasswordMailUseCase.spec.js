"use strict";

var _InMemoryUsersRepository = require("../../repositories/in-memory/InMemoryUsersRepository");
var _InMemoryUsersTokensRepository = require("../../repositories/in-memory/InMemoryUsersTokensRepository");
var _DayjsDateProvider = require("../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider");
var _SendForgotPasswordMailUseCase = require("./SendForgotPasswordMailUseCase");
var _InMemoryMailProvider = require("../../../../shared/container/providers/MailProvider/in-memory/InMemoryMailProvider");
var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let sendForgotPasswordMailUseCase;
let inMemoryUsersRepository;
let inMemoryUsersTokensRepository;
let dateProvider;
let inMemoryMailProvider;
describe('Send Forgot Email', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new _InMemoryUsersRepository.InMemoryUsersRepository();
    inMemoryUsersTokensRepository = new _InMemoryUsersTokensRepository.InMemoryUsersTokensRepository();
    dateProvider = new _DayjsDateProvider.DayjsDateProvider();
    inMemoryMailProvider = new _InMemoryMailProvider.InMemoryMailProvider();
    sendForgotPasswordMailUseCase = new _SendForgotPasswordMailUseCase.SendForgotPasswordMailUseCase(inMemoryUsersRepository, inMemoryUsersTokensRepository, dateProvider, inMemoryMailProvider);
  });
  it('Should be able to send a forgot password mail to user', async () => {
    const sendMail = jest.spyOn(inMemoryMailProvider, 'sendMail');
    await inMemoryUsersRepository.create({
      driver_license: '283070170',
      email: 'vafzu@tu.pe',
      name: 'Francisco Rowe',
      password: '1204100819'
    });
    await sendForgotPasswordMailUseCase.execute('vafzu@tu.pe');
    expect(sendMail).toHaveBeenCalled();
  });
  it('Should NOT be able to send a forgot password mail if user does not exists', async () => {
    const result = sendForgotPasswordMailUseCase.execute('123@tu.pe');
    await expect(result).rejects.toThrowError(_AppError.default);
    await expect(result).rejects.toThrow('User not found');
  });
  it('Should be able to create an users token', async () => {
    const generateTokenMail = jest.spyOn(inMemoryUsersTokensRepository, 'create');
    await inMemoryUsersRepository.create({
      driver_license: '283',
      email: 'va@tu.pe',
      name: 'Francisco Tabosa',
      password: '12041'
    });
    await sendForgotPasswordMailUseCase.execute('va@tu.pe');
    expect(generateTokenMail).toHaveBeenCalled();
  });
});