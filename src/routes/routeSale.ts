import express, { Request, Response } from 'express'

const routeSale: express.Router = express.Router();

routeSale.get('/ping', (req: Request, res: Response) => {
    res.status(200).json({msg: 'Ping...'})
})

export default routeSale