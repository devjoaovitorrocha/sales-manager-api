import express, { Request, Response } from 'express'
import UserController from '../controllers/UserController';

const routeUser: express.Router = express.Router();

routeUser.post('/register/adminMaster', UserController.registerAdminMaster)

export default routeUser