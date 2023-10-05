"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.specificationsRoutes = void 0;
var _express = require("express");
var _CreateSpecificationController = require("../../../../modules/cars/useCases/createSpecification/CreateSpecificationController");
var _ensureAuthenticated = require("../middlewares/ensureAuthenticated");
var _ensureAdmin = require("../middlewares/ensureAdmin");
const specificationsRoutes = exports.specificationsRoutes = (0, _express.Router)();
const createSpecificationController = new _CreateSpecificationController.CreateSpecificationController();
specificationsRoutes.post('/', _ensureAuthenticated.ensureAuthenticated, _ensureAdmin.ensureAdmin, createSpecificationController.handle);