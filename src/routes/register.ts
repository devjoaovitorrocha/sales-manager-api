import express, { Request, Response } from 'express'
import CompanyController from '../controllers/CompanyController';

const register: express.Router = express.Router();

register.post('/register/company', CompanyController.create)

export default register