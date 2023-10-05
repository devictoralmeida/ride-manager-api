"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureAuthenticated = void 0;
var _AppError = _interopRequireDefault(require("../../../errors/AppError"));
var _jsonwebtoken = require("jsonwebtoken");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const ensureAuthenticated = async (request, response, next) => {
  const authorization = request.headers.authorization;
  if (!authorization) {
    throw new _AppError.default('Token missing', 401);
  }
  const token = authorization.split(' ')[1];
  try {
    const {
      sub: user_id
    } = (0, _jsonwebtoken.verify)(token, process.env.SECRET_KEY);
    request.user = {
      id: user_id
    };
    return next();
  } catch (error) {
    throw new _AppError.default('Invalid token', 401);
  }
};
exports.ensureAuthenticated = ensureAuthenticated;