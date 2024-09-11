import { Request, Response } from "express";
import Db from "../services/Db";
import mysql from 'mysql2/promise';
import Query from "../helpers/Query";
import Validations from "../helpers/Validations";
import User from "../models/User";
import Company from "../models/Company";

const query = Query

class CompanyController{

    async create(req: Request, res: Response){
        const {
            name,
            identity,
            email,
            password,
            phone,
            is_cellphone,
            street,
            number,
            complement,
            neighborhood,
            city,
            state,
            country
        } = req.body


        if(!name || !identity  || !email || !password || !phone || !is_cellphone || !street  || !number || !neighborhood || !city || !state || !country){
            return res.status(400).json({msg: 'something is null'})
        }
          
        try{
            
            await Validations.name('Companies', name, res, false);
            const identity_type = await Validations.identity('Companies', identity, res, false);
            await Validations.email('Companies', email, res, false);
            
            const passwordHash: string = await Validations.password(password, res, false);
            const company: Company = {name, identity, identity_type, email, password: passwordHash}
            
            const insertCompany = await query.insert('Companies', { ...company })
            const resultInsert = await Db.query(insertCompany)
            if(!resultInsert){
                throw new Error
            }

            const selectCompany = await query.select(['id'], 'Companies', [`name = "${name}"`])
            const resultSelect = Object.values(await Db.query(selectCompany))
            const fk_id = resultSelect[0].id

            await Validations.address('CompaniesAddresses', fk_id, 'company', street, number, complement, neighborhood, city, state, country, res)
            await Validations.phone('CompaniesPhones', fk_id, 'company', phone, is_cellphone, res)
           
            return res.status(200).json({msg: "company registered"})

        }catch(err){
            if (!res.headersSent) {
                const status = err.status || 500; 
                const message = err.msg || 'server error';
                return res.status(status).json({ msg: message });
            }
        }
    }
}

export default new CompanyController()