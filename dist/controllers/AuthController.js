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
const Validations_1 = __importDefault(require("../helpers/Validations"));
const Query_1 = __importDefault(require("../helpers/Query"));
const Db_1 = __importDefault(require("../services/Db"));
const JWT_SECRET = process.env.JWT_SECRET;
class AuthController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code, identity, email, password } = req.body;
            if ((!code && !identity && !email) || !password) {
                return res.status(400).json({ msg: 'something is null' });
            }
            let username;
            if (code) {
                username = { code };
            }
            else if (identity) {
                username = { identity };
            }
            else {
                username = { email };
            }
            try {
                const select = yield Query_1.default.select(['*'], 'Users', [`${Object.keys(username)[0]} = "${Object.values(username)[0]}"`]);
                const result = yield Db_1.default.query(select);
                const user = result[0];
                yield Validations_1.default.password(password, res, true, user);
                const token = jsonwebtoken_1.default.sign({
                    id: user.id,
                    username: Object.values(username)[0],
                    role: user.user_type
                }, JWT_SECRET, { expiresIn: '1h' });
                res.status(200).json({ msg: 'user authenticated', token: token });
            }
            catch (err) {
                if (!res.headersSent) {
                    const status = err.status || 500;
                    const message = err.msg || 'server error';
                    return res.status(status).json({ msg: message });
                }
            }
        });
    }
}
exports.default = new AuthController();
//# sourceMappingURL=AuthController.js.map