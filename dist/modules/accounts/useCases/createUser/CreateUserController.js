"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateUserController = void 0;
var _tsyringe = require("tsyringe");
var _CreateUserUseCase = require("./CreateUserUseCase");
class CreateUserController {
  async handle(request, response) {
    const {
      name,
      email,
      password,
      driver_license
    } = request.body;
    const createUserUseCase = _tsyringe.container.resolve(_CreateUserUseCase.CreateUserUseCase);
    const newUser = await createUserUseCase.execute({
      name,
      email,
      password,
      driver_license
    });
    return response.status(201).json(newUser);
  }
}
exports.CreateUserController = CreateUserController;