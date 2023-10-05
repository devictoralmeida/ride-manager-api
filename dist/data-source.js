"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppDataSource = void 0;
require("dotenv/config");
require("reflect-metadata");
var _typeorm = require("typeorm");
const settings = () => {
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === 'test') {
    return {
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      entities: ['./src/modules/**/infra/typeorm/entities/*.{ts,js}']
    };
  }
  return {
    type: 'postgres',
    host: 'localhost' || process.env.PGHOST,
    port: 6869,
    username: 'docker',
    password: '258794613',
    database: 'rentx',
    logging: true,
    migrations: ['./src/shared/infra/typeorm/migrations/*.{ts,js}'],
    entities: ['./src/modules/**/infra/typeorm/entities/*.{ts,js}']
  };
};
const AppDataSource = exports.AppDataSource = new _typeorm.DataSource(settings());