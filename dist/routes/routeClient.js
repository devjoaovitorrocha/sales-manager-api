"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routeClient = express_1.default.Router();
routeClient.get('/ping', (req, res) => {
    res.status(200).json({ msg: 'Ping...' });
});
exports.default = routeClient;
//# sourceMappingURL=routeClient.js.map