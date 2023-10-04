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
      entities: ['./dist/modules/**/infra/typeorm/entities/*.js']
    };
  }
  return {
    type: 'postgres',
    host: 'localhost' || process.env.PGHOST,
    port: 5432,
    username: 'docker',
    password: 'docker',
    database: 'rentx',
    logging: true,
    migrations: ['./dist/shared/infra/typeorm/migrations/*.js'],
    entities: ['./dist/modules/**/infra/typeorm/entities/*.js']
  };
};
const AppDataSource = exports.AppDataSource = new _typeorm.DataSource(settings());