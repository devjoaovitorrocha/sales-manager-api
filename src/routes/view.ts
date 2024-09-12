import express, { Request, Response } from 'express'
import CompanyController from '../controllers/CompanyController';
import Auth, { checkRole } from '../middlewares/Auth';

const view: express.Router = express.Router();

view.post('/view/company/registration/info/:userId', Auth.checkToken, checkRole(['master']), CompanyController.view)

export default view