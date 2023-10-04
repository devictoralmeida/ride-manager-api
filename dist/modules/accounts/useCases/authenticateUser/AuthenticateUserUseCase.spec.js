"use strict";

require("reflect-metadata");
var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));
var _InMemoryUsersRepository = require("../../repositories/in-memory/InMemoryUsersRepository");
var _CreateUserUseCase = require("../createUser/CreateUserUseCase");
var _AuthenticateUserUseCase = require("./AuthenticateUserUseCase");
var _jsonwebtoken = require("jsonwebtoken");
var _InMemoryUsersTokensRepository = require("../../repositories/in-memory/InMemoryUsersTokensRepository");
var _DayjsDateProvider = require("../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable @typescript-eslint/no-non-null-assertion */

let inMemoryUsersRepository;
let authenticateUserUseCase;
let createUserUseCase;
let inMemoryUsersTokensRepository;
let dateProvider;
describe('Authenticate User', () => {
  beforeAll(() => {
    process.env.SECRET_KEY = 'iabsdkjanfiasudbnaiskjomna84651365';
  });
  beforeEach(() => {
    inMemoryUsersRepository = new _InMemoryUsersRepository.InMemoryUsersRepository();
    inMemoryUsersTokensRepository = new _InMemoryUsersTokensRepository.InMemoryUsersTokensRepository();
    dateProvider = new _DayjsDateProvider.DayjsDateProvider();
    authenticateUserUseCase = new _AuthenticateUserUseCase.AuthenticateUserUseCase(inMemoryUsersRepository, inMemoryUsersTokensRepository, dateProvider);
    createUserUseCase = new _CreateUserUseCase.CreateUserUseCase(inMemoryUsersRepository);
  });
  it('should be able to authenticate an user with a valid token', async () => {
    const user = {
      name: 'User Test',
      password: '1234',
      email: 'user@test.com',
      driver_license: '00123'
    };
    const {
      id,
      isAdmin
    } = await createUserUseCase.execute(user);
    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });
    expect(result).toHaveProperty('token');
    const decodedToken = (0, _jsonwebtoken.decode)(result.token);
    expect(decodedToken).toStrictEqual(expect.objectContaining({
      sub: id.toString(),
      admin: isAdmin,
      exp: expect.any(Number),
      iat: expect.any(Number)
    }));
    const expiration = Number(new Date(decodedToken.exp));
    const issuedAt = Number(new Date(decodedToken.iat));
    const timeStampDiff = Math.abs(expiration - issuedAt);
    const hoursDiff = timeStampDiff / 3600;
    expect(hoursDiff).toStrictEqual(0.25);
  });
  it('should NOT be able to authenticate an nonexistent user', async () => {
    const result = authenticateUserUseCase.execute({
      email: 'test@mail.com',
      password: '1234'
    });
    await expect(result).rejects.toThrowError(_AppError.default);
    await expect(result).rejects.toThrow('Email or password incorrect');
  });
  it('should NOT be able to authenticate an user with wrong password', async () => {
    const user = {
      name: 'User Test',
      password: '1234',
      email: 'user@test.com',
      driver_license: '00123'
    };
    await createUserUseCase.execute(user);
    const result = authenticateUserUseCase.execute({
      email: user.email,
      password: '123456'
    });
    await expect(result).rejects.toThrowError(_AppError.default);
    await expect(result).rejects.toThrow('Email or password incorrect');
  });
});