"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorHelper {
    standardError(req, res, err) {
        console.log(err);
        res.status(err.status || 500).json({ msg: err.msg || 'server error' });
    }
    jwtError(req, res, err) {
        console.log(err);
        if (err.name != 'TokenExpiredError') {
            this.standardError(req, res, err);
        }
        res.status(401).json({ msg: `token exipred at ${err.expiredAt}` });
    }
}
exports.default = new ErrorHelper();
//# sourceMappingURL=ErrorHelper.js.map