"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
// models/user.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class User extends sequelize_1.Model {}
User.init(
  {
    id: {
      type: sequelize_1.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: database_1.default,
    modelName: "User",
    timestamps: false,
  },
);
exports.default = User;
//# sourceMappingURL=user.js.map
