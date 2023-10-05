"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureAdmin = void 0;
var _AppError = _interopRequireDefault(require("../../../errors/AppError"));
var _UsersRepository = require("../../../../modules/accounts/infra/typeorm/repositories/UsersRepository");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const ensureAdmin = async (request, response, next) => {
  const {
    id
  } = request.user;
  const usersRepository = new _UsersRepository.UsersRepository();
  const user = await usersRepository.findById(id);
  if (user && user.isAdmin !== true) {
    throw new _AppError.default('User is not admin!');
  } else {
    return next();
  }
};
exports.ensureAdmin = ensureAdmin;