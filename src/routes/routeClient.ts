import express, { Request, Response } from 'express'

const routeClient: express.Router = express.Router();

routeClient.get('/ping', (req: Request, res: Response) => {
    res.status(200).json({msg: 'Ping...'})
})

export default routeClient