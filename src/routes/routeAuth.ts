import express, { Request, Response } from 'express'
import AuthController from '../controllers/AuthController';

const routeAuth: express.Router = express.Router();

routeAuth.post('/auth/login', AuthController.login)

export default routeAuth