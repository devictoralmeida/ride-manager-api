"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = void 0;
var _express = require("express");
var _categories = require("./categories.routes");
var _specifications = require("./specifications.routes");
var _users = require("./users.routes");
var _authenticate = require("./authenticate.routes");
var _cars = require("./cars.routes");
var _rental = require("./rental.routes");
var _password = require("./password.routes");
const router = exports.router = (0, _express.Router)();
router.use('/categories', _categories.categoriesRoutes);
router.use('/specifications', _specifications.specificationsRoutes);
router.use('/users', _users.usersRoutes);
router.use('/sessions', _authenticate.authenticateRoutes);
router.use('/cars', _cars.carsRoutes);
router.use('/rentals', _rental.rentalRoutes);
router.use('/password', _password.passwordRoutes);