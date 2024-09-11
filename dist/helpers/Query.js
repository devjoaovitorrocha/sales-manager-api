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
Object.defineProperty(exports, "__esModule", { value: true });
class Query {
    select(columns, table, filters, filtersType) {
        return __awaiter(this, void 0, void 0, function* () {
            const column = columns.length > 1 ? columns.join(', ') : columns[0];
            if (filters && filters.length > 1) {
                const filterConditions = filters.map((filter, index) => {
                    const operator = index > 0 && filtersType && filtersType[index - 1] ? filtersType[index - 1] : '';
                    return `${operator} ${filter}`.trim();
                }).join(' ');
                return `select ${column} from ${table} where ${filterConditions};`;
            }
            else if (filters && filters.length === 1) {
                return `select ${column} from ${table} where ${filters[0]};`;
            }
            return `select ${column} from ${table};`;
        });
    }
    insert(table, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const formatedValues = Object.values(values).map(value => `${typeof (value) == 'string' ? `"${value}"` : value}`).join(',');
            const columns = Object.keys(values).join(', ');
            return `insert into ${table} (${columns}) values (${formatedValues});`;
        });
    }
}
exports.default = new Query();
//# sourceMappingURL=Query.js.map