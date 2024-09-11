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
const Query_1 = __importDefault(require("../helpers/Query"));
const Validations_1 = __importDefault(require("../helpers/Validations"));
const query = Query_1.default;
class UserController {
    registerAdminMaster(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fk_idcompany, code, identity, name, email, password, user_type } = req.body;
            if (!code || !identity || !name || !email || !password || !user_type) {
                return res.status(400).json({ msg: 'something is null' });
            }
            try {
                yield Validations_1.default.code('Users', code, res, false);
                const identity_type = yield Validations_1.default.identity('Users', identity, res, false);
                yield Validations_1.default.name('Users', name, res, false);
                yield Validations_1.default.email('Users', email, res, false);
                yield Validations_1.default.user_type(user_type, res);
                const passwordHash = yield Validations_1.default.password(password, res, false);
                const User = { code, identity, identity_type, name, email, password: passwordHash, user_type };
                const insert = yield query.insert('Users', Object.assign({}, User));
                // const result: mysql.ResultSetHeader = await Db.query(insert)
                // if(!result.affectedRows){
                //     throw new Error
                // }
                // return res.status(200).json({msg: "user registered"})
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
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code, identity, name, email, user_type } = req.body;
        });
    }
}
exports.default = new UserController();
//# sourceMappingURL=UserController.js.map