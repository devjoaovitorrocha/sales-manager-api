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
const Query_1 = __importDefault(require("../helpers/Query"));
const Validations_1 = __importDefault(require("../helpers/Validations"));
const query = Query_1.default;
class CompanyController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, identity, email, password, phone, is_cellphone, street, number, complement, neighborhood, city, state, country } = req.body;
            if (!name || !identity || !email || !password || !phone || !is_cellphone || !street || !number || !neighborhood || !city || !state || !country) {
                return res.status(400).json({ msg: 'something is null' });
            }
            try {
                yield Validations_1.default.name('Companies', name, res, false);
                const identity_type = yield Validations_1.default.identity('Companies', identity, res, false);
                yield Validations_1.default.email('Companies', email, res, false);
                const passwordHash = yield Validations_1.default.password(password, res, false);
                const company = { name, identity, identity_type, email, password: passwordHash };
                const insertCompany = yield query.insert('Companies', Object.assign({}, company));
                const resultInsert = yield Db_1.default.query(insertCompany);
                if (!resultInsert) {
                    throw new Error;
                }
                const selectCompany = yield query.select(['id'], 'Companies', [`name = "${name}"`]);
                const resultSelect = Object.values(yield Db_1.default.query(selectCompany));
                const fk_id = resultSelect[0].id;
                yield Validations_1.default.address('CompaniesAddresses', fk_id, 'company', street, number, complement, neighborhood, city, state, country, res);
                yield Validations_1.default.phone('CompaniesPhones', fk_id, 'company', phone, is_cellphone, res);
                return res.status(200).json({ msg: "company registered" });
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
exports.default = new CompanyController();
//# sourceMappingURL=CompanyController.js.map