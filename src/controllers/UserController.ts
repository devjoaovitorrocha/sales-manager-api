import { Request, Response } from "express";
import Db from "../services/Db";
import mysql from 'mysql2/promise';
import Query from "../helpers/Query";
import Validations from "../helpers/Validations";
import User from "../models/User";
import ErrorHelper from "../helpers/ErrorHelper";

const query = Query

class UserController{

    async registerAdminMaster(req: Request, res: Response){
        const { 
            fk_idcompany,
            code,
            identity,
            name,
            email,
            password,
            user_type 
        } = req.body


        if(!code || !identity  || !name || !email || !password || !user_type){
            return res.status(400).json({msg: 'something is null'})
        }
          
        try{
            await Validations.code('Users', code, res, false);
            const identity_type = await Validations.identity('Users', identity, res, false);
            await Validations.name('Users', name, res, false);
            await Validations.email('Users', email, res, false);
            await Validations.user_type(user_type, res);
            
            const passwordHash: string = await Validations.password(password, res, false);

            const User: User = {code, identity, identity_type, name, email, password: passwordHash, user_type}
            
            const insert = await query.insert('Users', { ...User })
            // const result: mysql.ResultSetHeader = await Db.query(insert)

            // if(!result.affectedRows){
            //     throw new Error
            // }
           
            // return res.status(200).json({msg: "user registered"})

        }catch(err){
            ErrorHelper.standardError(req, res, err)
        }
    }

    async create(req: Request, res: Response){
        const { 
            code,
            identity,
            name,
            email,
            user_type 
        } = req.body


        
    }
}

export default new UserController()