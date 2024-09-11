import express, { Request, Response } from 'express'

const routePhone: express.Router = express.Router();

routePhone.get('/ping', (req: Request, res: Response) => {
    res.status(200).json({msg: 'Ping...'})
})

export default routePhone