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
  it('should be able to list all categories', async () => {
    const responseToken = await (0, _supertest.default)(_app.default).post(`/sessions`).send({
      email: 'admin@rentx.com.br',
      password: 'admin'
    });
    const {
      token
    } = responseToken.body;
    await (0, _supertest.default)(_app.default).post('/categories').send({
      name: 'Category Supertest',
      description: 'Category Supertest'
    }).set({
      Authorization: `Bearer ${token}`
    });
    await (0, _supertest.default)(_app.default).post('/categories').send({
      name: 'Category Supertest 2',
      description: 'Category Supertest 2'
    }).set({
      Authorization: `Bearer ${token}`
    });
    const response = await (0, _supertest.default)(_app.default).get('/categories').set({
      Authorization: `Bearer ${token}`
    });
    const expectedResult1 = {
      id: expect.any(String),
      name: 'Category Supertest',
      description: 'Category Supertest',
      created_at: expect.any(String)
    };
    const expectedResult2 = {
      id: expect.any(String),
      name: 'Category Supertest 2',
      description: 'Category Supertest 2',
      created_at: expect.any(String)
    };
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining(expectedResult1), expect.objectContaining(expectedResult2)]));
  });
});