"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InMemoryUsersRepository = void 0;
var _User = require("../../infra/typeorm/entities/User");
var _uuid = require("uuid");
class InMemoryUsersRepository {
  constructor() {
    this.users = [];
  }
  async create({
    driver_license,
    email,
    name,
    password,
    isAdmin
  }) {
    const newUser = new _User.User();
    Object.assign(newUser, {
      id: (0, _uuid.v4)(),
      created_at: new Date(),
      driver_license,
      email,
      name,
      password,
      isAdmin: isAdmin ?? false
    });
    this.users.push(newUser);
    return newUser;
  }
  async findByEmail(email) {
    const foundedUser = this.users.find(user => user.email === email);
    if (!foundedUser) {
      return;
    }
    return foundedUser;
  }
  async findById(id) {
    const foundedUser = this.users.find(user => user.id === id);
    if (!foundedUser) {
      return;
    }
    return foundedUser;
  }
}
exports.InMemoryUsersRepository = InMemoryUsersRepository;