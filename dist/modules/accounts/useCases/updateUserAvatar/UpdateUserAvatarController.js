"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpdateUserAvatarController = void 0;
var _tsyringe = require("tsyringe");
var _UpdateUserAvatarUseCase = require("./UpdateUserAvatarUseCase");
class UpdateUserAvatarController {
  async handle(request, response) {
    const {
      id
    } = request.user;
    const avatar_file = request.file.filename; // Pegando o fileName obtido pelo middleware do multer

    const updateUserAvatarUseCase = _tsyringe.container.resolve(_UpdateUserAvatarUseCase.UpdateUserAvatarUseCase);
    await updateUserAvatarUseCase.execute({
      user_id: id,
      avatar_file
    });
    return response.status(204).json();
  }
}
exports.UpdateUserAvatarController = UpdateUserAvatarController;