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
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv = __importStar(require("dotenv"));
const DbConfig_1 = __importDefault(require("../configs/DbConfig"));
dotenv.config();
class Db {
    createConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield promise_1.default.createConnection({
                    host: DbConfig_1.default.host,
                    user: DbConfig_1.default.user,
                    password: DbConfig_1.default.password,
                    database: DbConfig_1.default.database
                });
                return conn;
            }
            catch (err) {
                throw { status: 500, msg: 'server error', err };
            }
        });
    }
    closeConnection(conn) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield conn.end();
            }
            catch (err) {
                throw { status: 500, msg: 'server error', err };
            }
        });
    }
    query(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield this.createConnection();
                const [rows, fields] = yield conn.query(query);
                yield this.closeConnection(conn);
                return rows;
            }
            catch (err) {
                throw { status: 500, msg: 'server error', err };
            }
        });
    }
}
exports.default = new Db;
//# sourceMappingURL=Db.js.map