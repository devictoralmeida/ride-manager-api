"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rentalRoutes = void 0;
var _CreateRentalController = require("../../../../modules/rentals/useCases/createRental/CreateRentalController");
var _express = require("express");
var _ensureAuthenticated = require("../middlewares/ensureAuthenticated");
var _DevolutionRentalController = require("../../../../modules/rentals/useCases/devolutionRental/DevolutionRentalController");
var _ListRentalsByUserController = require("../../../../modules/rentals/useCases/listRentalsByUser/ListRentalsByUserController");
const rentalRoutes = exports.rentalRoutes = (0, _express.Router)();
const createRentalController = new _CreateRentalController.CreateRentalController();
const devolutionRentalController = new _DevolutionRentalController.DevolutionRentalController();
const listRentalsByUserController = new _ListRentalsByUserController.ListRentalsByUserController();
rentalRoutes.get('/user', _ensureAuthenticated.ensureAuthenticated, listRentalsByUserController.handle);
rentalRoutes.post('/', _ensureAuthenticated.ensureAuthenticated, createRentalController.handle);
rentalRoutes.post('/devolution/:id', _ensureAuthenticated.ensureAuthenticated, devolutionRentalController.handle);