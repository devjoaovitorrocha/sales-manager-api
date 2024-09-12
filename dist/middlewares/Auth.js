"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const ErrorHelper_1 = __importDefault(require("../helpers/ErrorHelper"));
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
class Auth {
    checkToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            const userId = parseInt(req.params.userId) && parseInt(req.params.userId);
            try {
                if (!token || !userId) {
                    throw { status: 401, msg: 'token and userId must be provided' };
                }
                const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
                req.user = decoded;
                next();
            }
            catch (err) {
                ErrorHelper_1.default.jwtError(req, res, err);
            }
        });
    }
}
const checkRole = (roles) => (req, res, next) => {
    try {
        const user = req.user;
        if (roles && !roles.includes(user.role)) {
            throw { status: 403, msg: 'access forbidden' };
        }
        next();
    }
    catch (err) {
        ErrorHelper_1.default.standardError(req, res, err);
    }
};
exports.checkRole = checkRole;
exports.default = new Auth();
//# sourceMappingURL=Auth.js.map