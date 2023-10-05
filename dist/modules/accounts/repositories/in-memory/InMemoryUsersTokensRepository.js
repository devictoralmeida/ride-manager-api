"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InMemoryUsersTokensRepository = void 0;
var _UserTokens = require("../../infra/typeorm/entities/UserTokens");
class InMemoryUsersTokensRepository {
  constructor() {
    this.usersTokens = [];
  }
  async create({
    expires_date,
    user_id,
    refresh_token
  }) {
    const userToken = new _UserTokens.UserTokens();
    Object.assign(userToken, {
      expires_date,
      user_id,
      refresh_token
    });
    this.usersTokens.push(userToken);
    return userToken;
  }
  async findByUserIdAndRefreshToken(user_id, refresh_token) {
    const userToken = this.usersTokens.find(token => token.user_id === user_id && token.refresh_token === refresh_token);
    return userToken;
  }
  async deleteById(id) {
    const userToken = this.usersTokens.find(token => token.id === id);
    this.usersTokens.splice(this.usersTokens.indexOf(userToken), 1);
  }
  async findByRefreshToken(refresh_token) {
    return this.usersTokens.find(token => token.refresh_token === refresh_token);
  }
}
exports.InMemoryUsersTokensRepository = InMemoryUsersTokensRepository;