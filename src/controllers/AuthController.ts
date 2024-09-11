import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken"
import Validations from "../helpers/Validations";
import Query from "../helpers/Query";
import Db from "../services/Db";

const JWT_SECRET = process.env.JWT_SECRET as string;

class AuthController{

    async login(req: Request, res: Response){
        const {code, identity, email, password } = req.body

        if((!code && !identity && !email) || !password){
            return res.status(400).json({msg: 'something is null'})
        }

        let username: object

        if(code){
            username = {code}
        }else if(identity){
            username = {identity}
        }else{
            username = {email}
        }

        try{
            const select = await Query.select(['*'], 'Users', [`${Object.keys(username)[0]} = "${Object.values(username)[0]}"`])
            const result = await Db.query(select)
            const user: User = result[0]

            await Validations.password(password, res, true, user)

            const token = jwt.sign(
                {
                    id: user.id,
                    username: Object.values(username)[0],
                    role: user.user_type
                },
                JWT_SECRET,
                { expiresIn: '1h'}
            )

            res.status(200).json({msg: 'user authenticated', token: token})
        }catch(err){
            if (!res.headersSent) {
                const status = err.status || 500; 
                const message = err.msg || 'server error'; 
                return res.status(status).json({ msg: message });
            }
        }
    }
}

export default new AuthController()