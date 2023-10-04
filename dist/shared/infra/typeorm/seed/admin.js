"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = void 0;
var _bcryptjs = require("bcryptjs");
var _dataSource = require("../../../../data-source");
var _uuid = require("uuid");
let connection;
const create = async () => {
  await _dataSource.AppDataSource.initialize().then(res => connection = res).catch(error => console.error(error));
  const password = await (0, _bcryptjs.hash)('admin', 8);
  const id = (0, _uuid.v4)();
  await connection.query(`
    INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
      values('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'XXXXXX');
  `);
  await connection.destroy();
};
exports.create = create;
create().then(() => {
  console.log('User admin created successfully!');
});