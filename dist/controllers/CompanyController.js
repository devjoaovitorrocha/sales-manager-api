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
const ErrorHelper_1 = __importDefault(require("../helpers/ErrorHelper"));
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
                const resultSelect = Object.values(yield Db_1.default.query(selectCompany))[0];
                const fk_id = resultSelect.id;
                yield Validations_1.default.address('CompaniesAddresses', fk_id, 'company', street, number, complement, neighborhood, city, state, country, res, false);
                yield Validations_1.default.phone('CompaniesPhones', fk_id, 'company', phone, is_cellphone, res, false);
                return res.status(200).json({ msg: "company registered" });
            }
            catch (err) {
                ErrorHelper_1.default.standardError(req, res, err);
            }
        });
    }
    view(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.params.userId) && parseInt(req.params.userId);
                const selectCompany = yield query.select(['name, identity, identity_type, email'], 'Companies', [`id = ${userId}`]);
                const resultCompany = Object.values(yield Db_1.default.query(selectCompany))[0];
                const selectAddress = yield query.select(['street, number, complement, neighborhood, city, state, country'], 'CompaniesAddresses', [`fk_idcompany = ${userId}`]);
                const resultAddress = Object.values(yield Db_1.default.query(selectAddress))[0];
                const selectPhone = yield query.select(['phone, is_cellphone'], 'CompaniesPhones', [`fk_idcompany = ${userId}`]);
                const resultPhone = Object.values(yield Db_1.default.query(selectPhone))[0];
                return res.status(200).json(Object.assign(Object.assign(Object.assign({}, resultCompany), resultPhone), resultAddress));
            }
            catch (err) {
                ErrorHelper_1.default.standardError(req, res, err);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.params.userId) && parseInt(req.params.userId);
                const { name, identity, email, current_password, confirm_password, new_password, phone, is_cellphone, street, number, complement, neighborhood, city, state, country } = req.body;
                const selectCompany = yield query.select(['*'], 'Companies', [`id = ${userId}`]);
                const company = Object.values(yield Db_1.default.query(selectCompany))[0];
                if ((name || email || identity) && (!name || !email || !identity)) {
                    throw { status: 400, msg: 'name, email and identity neded' };
                }
                else if (name && email && identity) {
                    name && (yield Validations_1.default.name('Companies', name, res, true, company));
                    const identity_type = identity && (yield Validations_1.default.identity('Companies', identity, res, true, company));
                    email && (yield Validations_1.default.email('Companies', email, res, true, company));
                    if (name || identity || email) {
                        const updateCompanie = yield query.update('Companies', {
                            name,
                            identity,
                            identity_type,
                            email
                        }, [`id = ${userId}`]);
                        yield Db_1.default.query(updateCompanie);
                    }
                }
                if ((!street || !number || !complement || !neighborhood || !city || !state || !country) && (street || number || complement || neighborhood || city || state || country)) {
                    throw { status: 400, msg: 'all address info needed' };
                }
                else if (street && number && complement && neighborhood && city && state && country) {
                    yield Validations_1.default.address('CompaniesAddresses', userId, 'company', street, number, complement, neighborhood, city, state, country, res, true, company);
                    const updateAddress = yield query.update('CompaniesAddresses', {
                        street, number, complement, neighborhood, city, state, country
                    }, [`fk_idcompany = ${userId}`]);
                    yield Db_1.default.query(updateAddress);
                }
                if ((!phone || (is_cellphone != 0 && is_cellphone != 1)) && (phone || is_cellphone == 0 || is_cellphone == 1)) {
                    throw { status: 400, msg: 'all phone info needed' };
                }
                else if (phone && (is_cellphone == 0 || is_cellphone == 1)) {
                    yield Validations_1.default.phone('CompaniesPhones', userId, 'company', phone, is_cellphone, res, true, company);
                    const updatePhone = yield query.update('CompaniesPhones', {
                        phone,
                        is_cellphone,
                    }, [`fk_idcompany = ${userId}`]);
                    yield Db_1.default.query(updatePhone);
                }
                if ((!new_password || !current_password || !confirm_password) && (new_password || current_password || confirm_password)) {
                    throw { status: 400, msg: 'current, new and confirm passwords needed' };
                }
                else if (new_password && confirm_password && current_password) {
                    const passwordHash = yield Validations_1.default.updatePassword(current_password, new_password, confirm_password, res, company);
                    const updatePassword = yield query.update('Companies', {
                        password: passwordHash
                    }, [`id = ${userId}`]);
                    yield Db_1.default.query(updatePassword);
                }
                return res.status(200).json({ msg: 'info updated' });
            }
            catch (err) {
                ErrorHelper_1.default.standardError(req, res, err);
            }
        });
    }
}
exports.default = new CompanyController();
//# sourceMappingURL=CompanyController.js.map