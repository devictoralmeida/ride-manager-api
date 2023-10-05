"use strict";

require("reflect-metadata");
require("express-async-errors");
var _app = _interopRequireDefault(require("../../../app"));
var _dataSource = require("../../../data-source");
require("../../container");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const PORT = Number(process.env.PORT) || 3000;
_dataSource.AppDataSource.initialize().then(async () => {
  console.log('Server is running');
  _app.default.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
}).catch(err => {
  console.error('Error during Data Source initialization', err);
});