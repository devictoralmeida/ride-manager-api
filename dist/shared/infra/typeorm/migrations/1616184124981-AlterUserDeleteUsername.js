"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlterUserDeleteUsername1616184124981 = void 0;
var _typeorm = require("typeorm");
class AlterUserDeleteUsername1616184124981 {
  async up(queryRunner) {
    await queryRunner.dropColumn('users', 'username');
  }
  async down(queryRunner) {
    await queryRunner.addColumn('users', new _typeorm.TableColumn({
      name: 'username',
      type: 'varchar'
    }));
  }
}
exports.AlterUserDeleteUsername1616184124981 = AlterUserDeleteUsername1616184124981;