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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Validations_1 = __importDefault(require("../helpers/Validations"));
const Query_1 = __importDefault(require("../helpers/Query"));
const Db_1 = __importDefault(require("../services/Db"));
const dotenv = __importStar(require("dotenv"));
const ErrorHelper_1 = __importDefault(require("../helpers/ErrorHelper"));
dotenv.config();
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
                const selectUser = yield Query_1.default.select(['*'], 'Users', [`${Object.keys(username)[0]} = "${Object.values(username)[0]}"`]);
                const resultUser = Object.values(yield Db_1.default.query(selectUser));
                const user = resultUser[0];
                const selectCompany = yield Query_1.default.select(['*'], 'Companies', [`${Object.keys(username)[0]} = "${Object.values(username)[0]}"`]);
                const resultCompany = Object.values(yield Db_1.default.query(selectCompany));
                const company = resultCompany[0];
                if (!user && !company) {
                    throw { status: 400, msg: 'user not found' };
                }
                user ? yield Validations_1.default.password(password, res, true, user) : yield Validations_1.default.password(password, res, true, company);
                const token = jsonwebtoken_1.default.sign({
                    id: user ? user.id : company.id,
                    username: Object.values(username)[0],
                    role: user ? user.user_type : 'master'
                }, JWT_SECRET, { expiresIn: '1h' });
                res.status(200).json({ msg: 'user authenticated', token: token });
            }
            catch (err) {
                ErrorHelper_1.default.standardError(req, res, err);
            }
        });
    }
}
exports.default = new AuthController();
//# sourceMappingURL=AuthController.js.map