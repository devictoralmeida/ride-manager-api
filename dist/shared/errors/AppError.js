"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.message = void 0;
    this.statusCode = void 0;
    this.statusCode = statusCode;
  }
}
exports.default = AppError;