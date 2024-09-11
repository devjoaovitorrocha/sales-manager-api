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
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const routeUser_1 = __importDefault(require("./routes/routeUser"));
const routeClient_1 = __importDefault(require("./routes/routeClient"));
const routeSale_1 = __importDefault(require("./routes/routeSale"));
const routeProduct_1 = __importDefault(require("./routes/routeProduct"));
const routeStock_1 = __importDefault(require("./routes/routeStock"));
const routeAddress_1 = __importDefault(require("./routes/routeAddress"));
const routePhone_1 = __importDefault(require("./routes/routePhone"));
const routeSaleItem_1 = __importDefault(require("./routes/routeSaleItem"));
const routeAuth_1 = __importDefault(require("./routes/routeAuth"));
const routeCompany_1 = __importDefault(require("./routes/routeCompany"));
dotenv.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
//ROUTES
app.use(routeAuth_1.default);
app.use(routeCompany_1.default);
app.use(routeUser_1.default);
app.use(routeClient_1.default);
app.use(routeSale_1.default);
app.use(routeProduct_1.default);
app.use(routeStock_1.default);
app.use(routeAddress_1.default);
app.use(routePhone_1.default);
app.use(routeSaleItem_1.default);
app.get('/', (req, res) => {
    return res.json({ msg: 'Everything is ok now...' });
});
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    return console.log(`Server is listening on ${port}`);
}));
//# sourceMappingURL=index.js.map