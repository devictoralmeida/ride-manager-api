"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RefreshTokenController = void 0;
var _tsyringe = require("tsyringe");
var _RefreshTokenUseCase = require("./RefreshTokenUseCase");
class RefreshTokenController {
  async handle(request, response) {
    const token = request.body.token || request.headers['x-access-token'] || request.query.token;
    const refreshTokenUseCase = _tsyringe.container.resolve(_RefreshTokenUseCase.RefreshTokenUseCase);
    const refreshToken = await refreshTokenUseCase.execute(token);
    return response.status(200).json(refreshToken);
  }
}
exports.RefreshTokenController = RefreshTokenController;