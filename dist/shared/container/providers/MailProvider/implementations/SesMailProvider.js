"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SesMailProvider = void 0;
var _nodemailer = _interopRequireDefault(require("nodemailer"));
var _awsSdk = _interopRequireDefault(require("aws-sdk"));
var _tsyringe = require("tsyringe");
var _fs = _interopRequireDefault(require("fs"));
var _handlebars = _interopRequireDefault(require("handlebars"));
var _dec, _dec2, _dec3, _class;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let SesMailProvider = exports.SesMailProvider = (_dec = (0, _tsyringe.injectable)(), _dec2 = Reflect.metadata("design:type", Function), _dec3 = Reflect.metadata("design:paramtypes", []), _dec(_class = _dec2(_class = _dec3(_class = class SesMailProvider {
  constructor() {
    this.client = void 0;
    const ses = new _awsSdk.default.SES({
      apiVersion: '2010-12-01',
      region: process.env.AWS_REGION
    });
    this.client = _nodemailer.default.createTransport({
      SES: {
        ses,
        aws: _awsSdk.default
      }
    });
  }
  async sendMail(to, subject, variables, path) {
    const templateFileContent = _fs.default.readFileSync(path).toString('utf-8');
    const templateParse = _handlebars.default.compile(templateFileContent);
    const templateHTML = templateParse(variables);
    await this.client.sendMail({
      from: 'victoralmeida@devictoralmeida.com.br',
      to,
      subject,
      html: templateHTML
    });
  }
}) || _class) || _class) || _class);