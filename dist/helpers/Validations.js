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
const Db_1 = __importDefault(require("../services/Db"));
const Query_1 = __importDefault(require("./Query"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const query = Query_1.default;
class Validations {
    isUnique(table, column, value, res, isUpdate, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let select;
            if (isUpdate) {
                select = yield query.select(['*'], `${table}`, [`${column} = "${value}"`, `id != ${user === null || user === void 0 ? void 0 : user.id}`]);
            }
            else {
                select = yield query.select(['*'], `${table}`, [`${column} = "${value}"`]);
            }
            const values = yield Db_1.default.query(select);
            console.log(values);
            if (values.length !== 0) {
                throw { status: 400, msg: `${column} already in use` };
            }
        });
    }
    address(table, fk_id, user_type, street, number, complement, neighborhood, city, state, country, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof number !== "number") {
                throw { status: 400, msg: `number must be a number` };
            }
            let address;
            switch (user_type) {
                case 'company':
                    address = { fk_idcompany: fk_id, street, number, complement, neighborhood, city, state, country };
                    break;
                case 'user':
                    address = { fk_iduser: fk_id, street, number, complement, neighborhood, city, state, country };
                    break;
                case 'client':
                    address = { fk_idclient: fk_id, street, number, complement, neighborhood, city, state, country };
                    break;
                default:
                    throw new Error;
            }
            const insert = yield query.insert(table, Object.assign({}, address));
            const result = yield Db_1.default.query(insert);
            if (!result.affectedRows) {
                throw new Error;
            }
        });
    }
    phone(table, fk_id, user_type, phone, is_cellphone, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (phone.length != 14) {
                throw { status: 400, msg: `phone must be at this format (00)00000-0000` };
            }
            let cellphone;
            switch (user_type) {
                case 'company':
                    cellphone = { fk_idcompany: fk_id, phone, is_cellphone };
                    break;
                case 'user':
                    cellphone = { fk_iduser: fk_id, phone, is_cellphone };
                    break;
                case 'client':
                    cellphone = { fk_idclient: fk_id, phone, is_cellphone };
                    break;
                default:
                    throw new Error;
            }
            const insert = yield query.insert(table, Object.assign({}, cellphone));
            const result = yield Db_1.default.query(insert);
            if (!result.affectedRows) {
                throw new Error;
            }
        });
    }
    code(table, code, res, isUpdate, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof code !== "number") {
                throw { status: 400, msg: `code must be a number` };
            }
            yield this.isUnique(table, 'code', code, res, isUpdate, user);
        });
    }
    identity(table, identity, res, isUpdate, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (identity.length != 14 && identity.length != 18) {
                throw { status: 400, msg: `identity must be cpf(14) or cnpj(18)` };
            }
            yield this.isUnique(table, 'identity', identity, res, isUpdate, user);
            if (identity.length == 14) {
                return 'cpf';
            }
            return 'cnpj';
        });
    }
    email(table, email, res, isUpdate, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email.includes('@')) {
                throw { status: 400, msg: `email must contain @` };
            }
            yield this.isUnique(table, 'email', email, res, isUpdate, user);
        });
    }
    name(table, name, res, isUpdate, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.isUnique(table, 'name', name, res, isUpdate, user);
        });
    }
    password(password, res, isLogin, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (password.length > 18) {
                throw { status: 400, msg: `password length must be lower than 18 characters` };
            }
            if (!password.match(/\d+/g)) {
                throw { status: 400, msg: `password must contain a number` };
            }
            if (isLogin) {
                if (!user) {
                    throw { status: 401, msg: 'user not found' };
                }
                const match = yield bcrypt_1.default.compare(password, user.password);
                if (!match) {
                    throw { status: 401, msg: 'invalid credentials' };
                }
            }
            const salt = yield bcrypt_1.default.genSalt(12);
            const passwordHash = yield bcrypt_1.default.hash(password, salt);
            return passwordHash;
        });
    }
    user_type(user_type, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user_type !== 'admin master' && user_type !== 'admin' && user_type !== 'agent') {
                throw { status: 400, msg: `user type must be "admin master" or "admin" or "agent" only` };
            }
        });
    }
}
exports.default = new Validations();
//# sourceMappingURL=Validations.js.map