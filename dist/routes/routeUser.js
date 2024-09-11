"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
const routeUser = express_1.default.Router();
routeUser.post('/register/adminMaster', UserController_1.default.registerAdminMaster);
exports.default = routeUser;
//# sourceMappingURL=routeUser.js.map