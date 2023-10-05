"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usersRoutes = void 0;
var _upload = _interopRequireDefault(require("../../../../config/upload"));
var _CreateUserController = require("../../../../modules/accounts/useCases/createUser/CreateUserController");
var _UpdateUserAvatarController = require("../../../../modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController");
var _express = require("express");
var _multer = _interopRequireDefault(require("multer"));
var _ensureAuthenticated = require("../middlewares/ensureAuthenticated");
var _ProfileUserController = require("../../../../modules/accounts/useCases/profileUser/ProfileUserController");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const usersRoutes = exports.usersRoutes = (0, _express.Router)();
const uploadAvatar = (0, _multer.default)(_upload.default);
const createUserController = new _CreateUserController.CreateUserController();
const updateUserAvatarController = new _UpdateUserAvatarController.UpdateUserAvatarController();
const profileUserController = new _ProfileUserController.ProfileUserController();
usersRoutes.get('/profile', _ensureAuthenticated.ensureAuthenticated, profileUserController.handle);
usersRoutes.post('/', createUserController.handle);
usersRoutes.patch('/avatar', _ensureAuthenticated.ensureAuthenticated, uploadAvatar.single('avatar'), updateUserAvatarController.handle);