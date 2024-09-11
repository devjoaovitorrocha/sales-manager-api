import express, { Request, Response } from 'express'

const routeSaleItem: express.Router = express.Router();

routeSaleItem.get('/ping', (req: Request, res: Response) => {
    res.status(200).json({msg: 'Ping...'})
})

export default routeSaleItem