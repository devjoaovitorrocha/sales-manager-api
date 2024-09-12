import { Request, Response } from "express";
import Db from "../services/Db";
import mysql from 'mysql2/promise';
import Query from "../helpers/Query";
import Validations from "../helpers/Validations";
import Company from "../models/Company";
import ErrorHelper from '../helpers/ErrorHelper'
import Address from "../models/Address";
import Phone from "../models/Phone";

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
            const resultSelect: Company = Object.values(await Db.query(selectCompany))[0]
            const fk_id = resultSelect.id

            await Validations.address('CompaniesAddresses', fk_id, 'company', street, number, complement, neighborhood, city, state, country, res, false)
            await Validations.phone('CompaniesPhones', fk_id, 'company', phone, is_cellphone, res, false)
           
            return res.status(200).json({msg: "company registered"})

        }catch(err){
            ErrorHelper.standardError(req, res, err)
        }
    }

    async view(req: Request, res: Response){
        try{
            const userId: number = parseInt(req.params.userId) && parseInt(req.params.userId)

            const selectCompany = await query.select(['name, identity, identity_type, email'], 'Companies', [`id = ${userId}`])
            const resultCompany: mysql.QueryResult = Object.values(await Db.query(selectCompany))[0]

            const selectAddress = await query.select(
                ['street, number, complement, neighborhood, city, state, country'], 
                'CompaniesAddresses', 
                [`fk_idcompany = ${userId}`]
            )
            const resultAddress: mysql.QueryResult = Object.values(await Db.query(selectAddress))[0]

            const selectPhone = await query.select(
                ['phone, is_cellphone'], 
                'CompaniesPhones', 
                [`fk_idcompany = ${userId}`]
            )
            const resultPhone: mysql.QueryResult = Object.values(await Db.query(selectPhone))[0]

            return res.status(200).json({...resultCompany,...resultPhone,...resultAddress})
        }catch(err){
            ErrorHelper.standardError(req, res, err)
        }
    }

    async update(req: Request, res: Response){
        try{
            const userId: number = parseInt(req.params.userId) && parseInt(req.params.userId)

            const {
                name,
                identity,
                email,
                current_password,
                confirm_password,
                new_password,
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

            const selectCompany = await query.select(['*'], 'Companies', [`id = ${userId}`])
            const company: Company = Object.values(await Db.query(selectCompany))[0]

            if((name || email || identity) && (!name || !email || !identity)){
                throw { status: 400, msg: 'name, email and identity neded'}

            }else if(name && email && identity){
                name && await Validations.name('Companies', name, res, true, company)
                const identity_type = identity && await Validations.identity('Companies', identity, res, true, company)
                email && await Validations.email('Companies', email, res, true, company)

                if(name || identity || email){
                    const updateCompanie = await query.update(
                        'Companies',
                        {
                            name,
                            identity,
                            identity_type,
                            email
                        },
                        [`id = ${userId}`]
                    )
                    await Db.query(updateCompanie)
                }
            }

            if((!street || !number || !complement || !neighborhood || !city || !state || !country) && (street || number || complement || neighborhood || city || state || country)){
                throw {status: 400, msg: 'all address info needed'}

            }else if(street && number && complement && neighborhood && city && state && country){
                await Validations.address('CompaniesAddresses', userId, 'company', street, number, complement, neighborhood, city, state, country, res, true, company)

                const updateAddress = await query.update(
                    'CompaniesAddresses',
                    {
                        street, number, complement, neighborhood, city, state, country
                    },
                    [`fk_idcompany = ${userId}`]
                )
                await Db.query(updateAddress)
            }

            
            if((!phone || (is_cellphone != 0 && is_cellphone != 1)) && (phone || is_cellphone == 0 || is_cellphone == 1)){
                throw {status: 400, msg: 'all phone info needed'}

            }else if(phone && (is_cellphone == 0 || is_cellphone == 1)){
                await Validations.phone('CompaniesPhones', userId, 'company', phone, is_cellphone, res, true, company)

                const updatePhone = await query.update(
                    'CompaniesPhones',
                    {
                        phone,
                        is_cellphone,
                    },
                    [`fk_idcompany = ${userId}`]
                )
                await Db.query(updatePhone)
            }
            
            if((!new_password || !current_password || !confirm_password) && (new_password || current_password || confirm_password)){
                throw {status: 400, msg: 'current, new and confirm passwords needed'}

            }else if(new_password && confirm_password && current_password){
                const passwordHash = await Validations.updatePassword(current_password, new_password, confirm_password, res, company)

                const updatePassword = await query.update(
                    'Companies',
                    {
                        password: passwordHash
                    },
                    [`id = ${userId}`]
                )
                await Db.query(updatePassword)
            }

            return res.status(200).json({msg: 'info updated'})
        }catch(err){
            ErrorHelper.standardError(req, res, err)
        }
    }
}

export default new CompanyController()