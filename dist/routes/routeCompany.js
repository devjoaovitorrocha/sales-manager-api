"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CompanyController_1 = __importDefault(require("../controllers/CompanyController"));
const routeCompany = express_1.default.Router();
routeCompany.post('/register/company', CompanyController_1.default.create);
exports.default = routeCompany;
//# sourceMappingURL=routeCompany.js.map