"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UsersTokensRepository = void 0;
var _UserTokens = require("../entities/UserTokens");
var _dataSource = require("../../../../../data-source");
class UsersTokensRepository {
  constructor() {
    this.repository = void 0;
    this.repository = _dataSource.AppDataSource.getRepository(_UserTokens.UserTokens);
  }
  async create({
    expires_date,
    user_id,
    refresh_token
  }) {
    const userToken = this.repository.create({
      expires_date,
      user_id,
      refresh_token
    });
    await this.repository.save(userToken);
    return userToken;
  }
  async findByUserIdAndRefreshToken(user_id, refresh_token) {
    const usersTokens = await this.repository.findOne({
      where: {
        user_id,
        refresh_token
      }
    });
    return usersTokens;
  }
  async deleteById(id) {
    await this.repository.delete(id);
  }
  async findByRefreshToken(refresh_token) {
    const userToken = await this.repository.findOne({
      where: {
        refresh_token
      }
    });
    return userToken;
  }
}
exports.UsersTokensRepository = UsersTokensRepository;