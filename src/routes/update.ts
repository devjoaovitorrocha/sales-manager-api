import express, { Request, Response } from 'express'
import Auth, { checkRole } from '../middlewares/Auth';

const update: express.Router = express.Router();

update.post('/update/test/:userId', Auth.checkToken, checkRole() , (req: Request, res: Response) => {
    console.log('oi')
    return res.json({msg: 'oi'})
})


export default update