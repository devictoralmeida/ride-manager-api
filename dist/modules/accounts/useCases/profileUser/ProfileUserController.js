"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProfileUserController = void 0;
var _ProfileUserUseCase = require("./ProfileUserUseCase");
var _tsyringe = require("tsyringe");
class ProfileUserController {
  async handle(request, response) {
    const {
      id
    } = request.user;
    const profileUserUseCase = _tsyringe.container.resolve(_ProfileUserUseCase.ProfileUserUseCase);
    const user = await profileUserUseCase.execute(id);
    return response.status(200).json(user);
  }
}
exports.ProfileUserController = ProfileUserController;