import express, { Request, Response } from 'express'
import AuthController from '../controllers/AuthController';

const auth: express.Router = express.Router();

auth.post('/auth/login', AuthController.login)

export default auth