import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken"
import Validations from "../helpers/Validations";
import Query from "../helpers/Query";
import Db from "../services/Db";
import Company from "../models/Company";
import * as dotenv from 'dotenv';
import ErrorHelper from "../helpers/ErrorHelper";

dotenv.config()

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
            const selectUser = await Query.select(['*'], 'Users', [`${Object.keys(username)[0]} = "${Object.values(username)[0]}"`])
            const resultUser = Object.values(await Db.query(selectUser))
            const user: User = resultUser[0]

            
            const selectCompany = await Query.select(['*'], 'Companies', [`${Object.keys(username)[0]} = "${Object.values(username)[0]}"`])
            const resultCompany = Object.values(await Db.query(selectCompany))
            const company: Company = resultCompany[0]


            if(!user && !company){
                throw { status: 400, msg: 'user not found'}
            }

            user ? await Validations.password(password, res, true, user) :  await Validations.password(password, res, true, company)

            const token = jwt.sign(
                {
                    id: user ? user.id : company.id,
                    username: Object.values(username)[0],
                    role: user ? user.user_type : 'master'
                },
                JWT_SECRET,
                { expiresIn: '1h'}
            )

            res.status(200).json({msg: 'user authenticated', token: token})
        }catch(err){
            ErrorHelper.standardError(req, res, err)
        }
    }

    
}

export default new AuthController()