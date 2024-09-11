import express, { Request, Response } from 'express'
import CompanyController from '../controllers/CompanyController';

const routeCompany: express.Router = express.Router();

routeCompany.post('/register/company', CompanyController.create)

export default routeCompany