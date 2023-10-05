"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nodeCrypto = _interopRequireDefault(require("node:crypto"));
var _multer = _interopRequireDefault(require("multer"));
var _path = require("path");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const tmpFolder = (0, _path.resolve)(__dirname, '..', '..', 'tmp'); // Voltando 2 arquivos do atual diretório para acessar a raiz do documento.
var _default = exports.default = {
  tmpFolder,
  storage: _multer.default.diskStorage({
    destination: tmpFolder,
    filename: (request, file, callback) => {
      const fileHash = _nodeCrypto.default.randomBytes(16).toString('hex'); // Vamos sobrescrever o filename por um hash para não termos arquivos com nomes duplicados
      const fileName = `${fileHash}-${file.originalname}`;
      return callback(null, fileName); // O 1º parâmetro é o erro que ela deixou como null, e o seguindo é o fileName
    }
  })
};