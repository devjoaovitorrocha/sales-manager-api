import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string;

interface JwtPayload {
    id: number;
    username: string;
    role: string;
}

declare module 'express-serve-static-core' {
    interface Request {
      user?: JwtPayload; // Add the user property to Request
    }
}

class Auth{
    async checkToken(req: Request, res: Response, next: NextFunction){
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        const userId: number = parseInt(req.params.userId) && parseInt(req.params.userId)

        try{ 
            if (!token || !userId){
                throw { status: 401, msg: 'token and userId must be provided'}
            }

            const decoded = jwt.verify(token, JWT_SECRET);

            req.user = decoded as JwtPayload;

            next()
        }catch(err){
            if (!res.headersSent) {
                const status = err.status || 500; // Padrão para 500 se o status não for fornecido
                const message = err.msg || 'server error'; // Mensagem padrão se não for especificada
                return res.status(status).json({ msg: message });
            }
        }
    }
}

export const checkRole = (roles?: Array<string>) => (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload
    if(roles && !roles.includes(user.role)){
        throw {status: 403, msg: 'access forbidden'}
    }

    next()
}

export default new Auth()