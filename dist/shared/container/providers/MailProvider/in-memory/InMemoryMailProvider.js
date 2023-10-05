"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InMemoryMailProvider = void 0;
class InMemoryMailProvider {
  constructor() {
    this.message = [];
  }
  async sendMail(to, subject, variables, path) {
    this.message.push({
      to,
      subject,
      variables,
      path
    });
  }
}
exports.InMemoryMailProvider = InMemoryMailProvider;