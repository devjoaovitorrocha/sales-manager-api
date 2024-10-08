"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const auth = express_1.default.Router();
auth.post('/auth/login', AuthController_1.default.login);
exports.default = auth;
//# sourceMappingURL=auth.js.map