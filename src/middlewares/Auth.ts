import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

interface JwtPayload {
    id: number;
    username: string;
    role: string;
}

class Auth{
    async checkToken(req: Request, res: Response, next: NextFunction, roles?: Array<string>){
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        const userId: number = parseInt(req.params.userId) && parseInt(req.params.userId)

        try{ 
            if (!token || !userId){
                throw { status: 401, msg: 'token and userId must be provided'}
            }

            jwt.verify(token, JWT_SECRET, (err, user: JwtPayload) => {

                if (err || userId != user.id){
                    throw {status: 401, msg: 'invalid token'};
                }

                if(roles){
                    this.checkRole(roles, user, req, res, next)
                }

                next();
            });

        }catch(err){
            if (!res.headersSent) {
                const status = err.status || 500; // Padrão para 500 se o status não for fornecido
                const message = err.msg || 'server error'; // Mensagem padrão se não for especificada
                return res.status(status).json({ msg: message });
            }
        }
    }

    private async checkRole(roles: Array<string>, user: JwtPayload, req: Request, res: Response, next: NextFunction){
        if(!roles.includes(user.role)){
            throw {status: 403, msg: 'access forbidden'}
        }

        next()
    }


}

export default new Auth()