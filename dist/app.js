"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("reflect-metadata");
require("express-async-errors");
require("dotenv/config");
require("./shared/container");
var _express = _interopRequireDefault(require("express"));
var _upload = _interopRequireDefault(require("./config/upload"));
var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));
var _swagger = _interopRequireDefault(require("./swagger.json"));
var _routes = require("./shared/infra/http/routes");
var _handleErrors = require("./shared/infra/http/middlewares/handleErrors");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const app = (0, _express.default)();
app.use(_express.default.json());
app.use('/api-docs', _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(_swagger.default)); // Nessa rota ficará nessa doc

app.use('/avatar', _express.default.static(`${_upload.default.tmpFolder}/avatar`));
app.use('/cars', _express.default.static(`${_upload.default.tmpFolder}/cars`));
app.use(_routes.router);
app.use(_handleErrors.handleErrors);
var _default = exports.default = app;