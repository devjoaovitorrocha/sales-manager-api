"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routePhone = express_1.default.Router();
routePhone.get('/ping', (req, res) => {
    res.status(200).json({ msg: 'Ping...' });
});
exports.default = routePhone;
//# sourceMappingURL=routePhone.js.map