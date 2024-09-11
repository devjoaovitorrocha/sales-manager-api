import express, { Request, Response } from 'express'

const routeProduct: express.Router = express.Router();

routeProduct.get('/ping', (req: Request, res: Response) => {
    res.status(200).json({msg: 'Ping...'})
})

export default routeProduct