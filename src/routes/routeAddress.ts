import express, { Request, Response } from 'express'

const routeAddress: express.Router = express.Router();

routeAddress.get('/ping', (req: Request, res: Response) => {
    res.status(200).json({msg: 'Ping...'})
})

export default routeAddress