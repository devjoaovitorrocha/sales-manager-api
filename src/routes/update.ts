import express, { Request, Response } from 'express'
import Auth, { checkRole } from '../middlewares/Auth';
import CompanyController from '../controllers/CompanyController';

const update: express.Router = express.Router();

update.post('/update/company/registration/info/:userId', Auth.checkToken, checkRole(['master']) , CompanyController.update)


export default update