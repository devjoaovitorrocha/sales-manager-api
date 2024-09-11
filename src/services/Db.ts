import mysql from 'mysql2/promise'
import * as dotenv from "dotenv";
import DbConfig from '../configs/DbConfig';

dotenv.config()

class Db{

    private async createConnection(){

        try{
            const conn = await mysql.createConnection({
                host: DbConfig.host,
                user: DbConfig.user,
                password: DbConfig.password,
                database: DbConfig.database
            });

            return conn
        }catch(err){ 
            throw {status: 500, msg: 'server error', err}
        }
       
    }

    private async closeConnection(conn: mysql.Connection){
        try{
            await conn.end()
        }catch(err){ 
            throw {status: 500, msg: 'server error', err}
        }
       
    }

    async query(query: string){
        try{
            const conn = await this.createConnection()

            const [rows, fields] = await conn.query(query)

            await this.closeConnection(conn)

            return rows
        }catch(err){
            return err
        }
    }
}

export default new Db