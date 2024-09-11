"use strict";
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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
class Auth {
    checkToken(req, res, next, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            const userId = parseInt(req.params.userId) && parseInt(req.params.userId);
            try {
                if (!token || !userId) {
                    throw { status: 401, msg: 'token and userId must be provided' };
                }
                jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
                    if (err || userId != user.id) {
                        throw { status: 401, msg: 'invalid token' };
                    }
                    if (roles) {
                        this.checkRole(roles, user, req, res, next);
                    }
                    next();
                });
            }
            catch (err) {
                if (!res.headersSent) {
                    const status = err.status || 500; // Padrão para 500 se o status não for fornecido
                    const message = err.msg || 'server error'; // Mensagem padrão se não for especificada
                    return res.status(status).json({ msg: message });
                }
            }
        });
    }
    checkRole(roles, user, req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!roles.includes(user.role)) {
                throw { status: 403, msg: 'access forbidden' };
            }
            next();
        });
    }
}
exports.default = new Auth();
//# sourceMappingURL=Auth.js.map