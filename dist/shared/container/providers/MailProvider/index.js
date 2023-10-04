"use strict";

require("dotenv/config");
var _tsyringe = require("tsyringe");
var _EtherealMailProvider = require("./implementations/EtherealMailProvider");
var _SesMailProvider = require("./implementations/SesMailProvider");
const mailProvider = {
  ethereal: _tsyringe.container.resolve(_EtherealMailProvider.EtherealMailProvider),
  ses: _tsyringe.container.resolve(_SesMailProvider.SesMailProvider)
};
_tsyringe.container.registerInstance('MailProvider', mailProvider[process.env.MAIL_PROVIDER]);