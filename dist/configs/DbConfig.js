"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class DbConfig {
    constructor() {
        this.host = process.env.DATABASE_HOST;
        this.user = process.env.DATABASE_USER;
        this.password = process.env.DATABASE_PASSWORD;
        this.database = process.env.DATABASE;
    }
}
exports.default = new DbConfig();
//# sourceMappingURL=DbConfig.js.map