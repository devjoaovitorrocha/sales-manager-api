import { Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";

class ErrorHelper{
    standardError(req: Request, res: Response, err: any){
        console.log(err)
        res.status(err.status || 500).json({msg: err.msg || 'server error'})
    }

    jwtError(req: Request, res: Response, err: JsonWebTokenError | any){
        console.log(err)
        if(err.name != 'TokenExpiredError'){
            this.standardError(req, res, err)
        }

        res.status(401).json({msg: `token exipred at ${err.expiredAt}`})
    }
}

export default new ErrorHelper()