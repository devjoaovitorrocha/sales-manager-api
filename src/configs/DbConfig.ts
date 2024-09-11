import dotenv from "dotenv";

dotenv.config()

class DbConfig{

    public host = process.env.DATABASE_HOST
    public user = process.env.DATABASE_USER
    public password = process.env.DATABASE_PASSWORD
    public database = process.env.DATABASE

}

export default new DbConfig()