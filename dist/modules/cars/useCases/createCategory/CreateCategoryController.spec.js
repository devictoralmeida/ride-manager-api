"use strict";

var _app = _interopRequireDefault(require("../../../../app"));
var _supertest = _interopRequireDefault(require("supertest"));
var _bcryptjs = require("bcryptjs");
var _uuid = require("uuid");
var _dataSource = require("../../../../data-source");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
describe('Create Category Controller', () => {
  let connection;
  beforeAll(async () => {
    process.env.SECRET_KEY = 'testing';
    process.env.EXPIRES_IN = '24h';
    connection = await _dataSource.AppDataSource.initialize();
    const password = (0, _bcryptjs.hashSync)('admin', 8);
    const id = (0, _uuid.v4)();
    await connection.query(`
      INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
        values('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'XXXXXX');
    `);
  });
  afterAll(async () => {
    await connection.destroy();
  });
  it('should be able to create a new category', async () => {
    const responseToken = await (0, _supertest.default)(_app.default).post(`/sessions`).send({
      email: 'admin@rentx.com.br',
      password: 'admin'
    });
    const {
      token
    } = responseToken.body;
    const response = await (0, _supertest.default)(_app.default).post('/categories').send({
      name: 'Category Supertest',
      description: 'Category Supertest'
    }).set({
      Authorization: `Bearer ${token}`
    });
    const expectedResult = {
      id: expect.any(String),
      name: 'Category Supertest',
      description: 'Category Supertest',
      created_at: expect.any(String)
    };
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual(expectedResult);
  });
  it('should NOT be able to create a new category with name in duplicity', async () => {
    const responseToken = await (0, _supertest.default)(_app.default).post(`/sessions`).send({
      email: 'admin@rentx.com.br',
      password: 'admin'
    });
    const {
      token
    } = responseToken.body;
    const response = await (0, _supertest.default)(_app.default).post('/categories').send({
      name: 'Category Supertest',
      description: 'Category Supertest'
    }).set({
      Authorization: `Bearer ${token}`
    });
    expect(response.status).toBe(409);
    expect(response.body).toStrictEqual({
      message: 'Category already exists!'
    });
  });
});