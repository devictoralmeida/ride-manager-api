"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleErrors = void 0;
var _AppError = _interopRequireDefault(require("../../../errors/AppError"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const handleErrors = (err, request, response, next) => {
  if (err instanceof _AppError.default) {
    return response.status(err.statusCode).json({
      message: err.message
    });
  }
  console.error(err);
  return response.status(500).json({
    message: `Internal server error - ${err.message}`
  });
};
exports.handleErrors = handleErrors;