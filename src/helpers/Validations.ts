import { Response } from "express";
import Db from "../services/Db";
import mysql from 'mysql2/promise';
import QueryConfig from "./Query";
import User from "../models/User";
import Client from "../models/Client";
import bcrypt from "bcrypt"
import Company from "../models/Company";

const query = QueryConfig;

class Validations {

    async isUnique(table: string, column: string, value: any, res: Response, isUpdate: boolean, columnException?: string, user?: User | Client | Company) {

        let select;

        if (isUpdate) {
            select = await query.select(['*'], `${table}`, [`${column} = "${value}"`, `${columnException} != ${user?.id}`], ['AND']);
        } else {
            select = await query.select(['*'], `${table}`, [`${column} = "${value}"`]);
        }

        const values: mysql.QueryResult = Object.values(await Db.query(select));

        if (values.length !== 0) {
            throw { status: 400, msg: `${column} already in use` };
        }
    }

    async address(table: string, fk_id: number, user_type: string, street: string, number: any, complement: string, neighborhood: string, city: string, state: string, country: string, res: Response, isUpdate: boolean, user?: User | Company | Client){
        if (typeof number !== "number") {
            throw { status: 400, msg: `number must be a number` };
        }

        let address

        switch(user_type){
            case 'company':
                address = {fk_idcompany: fk_id, street, number, complement, neighborhood, city, state, country}
                break
            case 'user':
                address = {fk_iduser: fk_id, street, number, complement, neighborhood, city, state, country}
                break
            case 'client':
                address = {fk_idclient: fk_id, street, number, complement, neighborhood, city, state, country}
                break
            default:
                throw new Error
        }

        

        if(!isUpdate){
            await this.isUnique(table, 'fk_idcompany', fk_id, res, isUpdate);
            
            const insert = await query.insert(table, {...address})
            const result: mysql.QueryResult = await Db.query(insert)

            if(!result){
                throw new Error
            }
        }else{
            await this.isUnique(table, 'fk_idcompany', fk_id, res, isUpdate, `${'fk_id' + user_type}`, user);
        }
    }

    async phone(table: string, fk_id: number, user_type: string, phone: string, is_cellphone: boolean, res: Response, isUpdate: boolean, user?: User | Company | Client){
        if (phone.length != 14) {
            throw { status: 400, msg: `phone must be at this format (00)00000-0000` };
        }

        let cellphone

        switch(user_type){
            case 'company':
                cellphone = {fk_idcompany: fk_id, phone, is_cellphone}
                break
            case 'user':
                cellphone = {fk_iduser: fk_id, phone, is_cellphone}
                break
            case 'client':
                cellphone = {fk_idclient: fk_id, phone, is_cellphone}
                break
            default:
                throw new Error
        }

        if(!isUpdate){
            await this.isUnique(table, 'phone', phone, res, isUpdate);
            
            const insert = await query.insert(table, {...cellphone})
            const result: mysql.QueryResult = await Db.query(insert)

            if(!result){ 
                throw new Error
            }
        }else{
            await this.isUnique(table, 'phone', phone, res, isUpdate, `${'fk_id' + user_type}`, user);
        }
    }

    async code(table: string, code: any, res: Response, isUpdate: boolean, user?: User | Client | Company) {
        if (typeof code !== "number") {
            throw { status: 400, msg: `code must be a number` };
        }

        await this.isUnique(table, 'code', code, res, isUpdate, 'id', user);
    }

    async identity(table: string, identity: string, res: Response, isUpdate: boolean, user?: User | Client | Company) {
        if (identity.length != 14 && identity.length != 18) {
            throw { status: 400, msg: `identity must be cpf(14) or cnpj(18)` };
        }

        await this.isUnique(table, 'identity', identity, res, isUpdate, 'id', user);

        if(identity.length == 14){
            return 'cpf'
        }

        return 'cnpj'
    }

    async email(table: string, email: string, res: Response, isUpdate: boolean, user?: User | Client | Company) {
        if (!email.includes('@')) {
            throw { status: 400, msg: `email must contain @` };
        }

        await this.isUnique(table, 'email', email, res, isUpdate, 'id', user);
    }

    async name(table: string, name: string, res: Response, isUpdate: boolean, user?: User | Client | Company) {
        await this.isUnique(table, 'name', name, res, isUpdate, 'id', user);
    }

    async updatePassword(current_password: string, new_password: string, confirm_password: string, res: Response, user?: User | Company){
        if (current_password.length > 18 || new_password.length > 18 || confirm_password.length > 18 ) {
            throw { status: 400, msg: `password length must be lower than 18 characters` };
        }

        if (!current_password.match(/\d+/g) || !new_password.match(/\d+/g) || !confirm_password.match(/\d+/g)) {
            throw { status: 400, msg: `password must contain a number` };
        }

        if(!current_password || !confirm_password){
            throw {status: 401, msg: 'current or confirm password is missing'}
        }

        if(new_password != confirm_password){
            throw {status: 401, msg: 'new and confirm passwords must be the same'}
        }
        
        const matchNew = await bcrypt.compare(new_password, user.password)

        if(new_password == current_password || matchNew){
            throw {status: 401, msg: 'new and current passwords must be the diferent'}
        }

        const match = await bcrypt.compare(current_password, user.password)

        if(!match){
            throw {status: 401, msg: 'invalid credentials'}
        }
 
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(new_password, salt)

        return passwordHash

    }

    async password(password: string, res: Response, isLogin: boolean, user?: User | Company) {
        if (password.length > 18) {
            throw { status: 400, msg: `password length must be lower than 18 characters` };
        }

        if (!password.match(/\d+/g)) {
            throw { status: 400, msg: `password must contain a number` };
        }

        if(isLogin){
            if(!user){
                throw {status: 401, msg: 'user not found'}
            }

            const match = await bcrypt.compare(password, user.password)

            if(!match){
                throw {status: 401, msg: 'invalid credentials'}
            }

            if(!match){
                throw {status: 401, msg: 'invalid credentials'}
            }
        }

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        return passwordHash
    }

    async user_type(user_type: string, res: Response) {
        if (user_type !== 'admin master' && user_type !== 'admin' && user_type !== 'agent') {
            throw { status: 400, msg: `user type must be "admin master" or "admin" or "agent" only` };
        }
    }
}

export default new Validations();
