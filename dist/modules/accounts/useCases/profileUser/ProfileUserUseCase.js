"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProfileUserUseCase = void 0;
var _UserMap = require("../../mapper/UserMap");
var _IUsersRepository = require("../../repositories/IUsersRepository");
var _IStorageProvider = require("../../../../shared/container/providers/StorageProvider/IStorageProvider");
var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));
var _tsyringe = require("tsyringe");
var _dec, _dec2, _dec3, _dec4, _dec5, _class;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let ProfileUserUseCase = exports.ProfileUserUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('UsersRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('StorageProvider')(target, undefined, 1);
}, _dec4 = Reflect.metadata("design:type", Function), _dec5 = Reflect.metadata("design:paramtypes", [typeof _IUsersRepository.IUsersRepository === "undefined" ? Object : _IUsersRepository.IUsersRepository, typeof _IStorageProvider.IStorageProvider === "undefined" ? Object : _IStorageProvider.IStorageProvider]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = class ProfileUserUseCase {
  constructor(usersRepository, storageProvider) {
    this.usersRepository = usersRepository;
    this.storageProvider = storageProvider;
  }
  async execute(id) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new _AppError.default('User not found', 404);
    }
    return _UserMap.UserMap.toDTO(user);
  }
}) || _class) || _class) || _class) || _class) || _class);