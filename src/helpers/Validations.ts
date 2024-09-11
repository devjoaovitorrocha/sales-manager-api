import { Response } from "express";
import Db from "../services/Db";
import mysql from 'mysql2/promise';
import QueryConfig from "./Query";
import User from "../models/User";
import Client from "../models/Client";
import bcrypt from "bcrypt"
import Address from "../models/CompaniesAddress";
import Phone from "../models/Phone";

const query = QueryConfig;

class Validations {

    async isUnique(table: string, column: string, value: any, res: Response, isUpdate: boolean, user?: User | Client) {

        let select;

        if (isUpdate) {
            select = await query.select(['*'], `${table}`, [`${column} = "${value}"`, `id != ${user?.id}`]);
        } else {
            select = await query.select(['*'], `${table}`, [`${column} = "${value}"`]);
        }

        const values = await Db.query(select);

        if (values.length !== 0) {
            throw { status: 400, msg: `${column} already in use` };
        }
    }

    async address(table: string, fk_id: number, user_type: string, street: string, number: any, complement: string, neighborhood: string, city: string, state: string, country: string, res: Response){
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

        const insert = await query.insert(table, {...address})
        const result = await Db.query(insert)

        if(!result.affectedRows){
            throw new Error
        }
    }

    async phone(table: string, fk_id: number, user_type: string, phone: string, is_cellphone: boolean, res: Response){
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

        const insert = await query.insert(table, {...cellphone})
        const result = await Db.query(insert)

        if(!result.affectedRows){ 
            throw new Error
        }
    }

    async code(table: string, code: any, res: Response, isUpdate: boolean, user?: User | Client) {
        if (typeof code !== "number") {
            throw { status: 400, msg: `code must be a number` };
        }

        await this.isUnique(table, 'code', code, res, isUpdate, user);
    }

    async identity(table: string, identity: string, res: Response, isUpdate: boolean, user?: User | Client) {
        if (identity.length != 14 && identity.length != 18) {
            throw { status: 400, msg: `identity must be cpf(14) or cnpj(18)` };
        }

        await this.isUnique(table, 'identity', identity, res, isUpdate, user);

        if(identity.length == 14){
            return 'cpf'
        }

        return 'cnpj'
    }

    async email(table: string, email: string, res: Response, isUpdate: boolean, user?: User | Client) {
        if (!email.includes('@')) {
            throw { status: 400, msg: `email must contain @` };
        }

        await this.isUnique(table, 'email', email, res, isUpdate, user);
    }

    async name(table: string, name: string, res: Response, isUpdate: boolean, user?: User | Client) {
        await this.isUnique(table, 'name', name, res, isUpdate, user);
    }

    async password(password: string, res: Response, isLogin: boolean, user?: User) {
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
