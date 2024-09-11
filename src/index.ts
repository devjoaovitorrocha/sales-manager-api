import express, { Request, Response } from 'express'
import * as dotenv from 'dotenv'
import routeUser from './routes/routeUser'
import routeClient from './routes/routeClient'
import routeSale from './routes/routeSale'
import routeProduct from './routes/routeProduct'
import routeStock from './routes/routeStock'
import routeAddress from './routes/routeAddress'
import routePhone from './routes/routePhone'
import routeSaleItem from './routes/routeSaleItem'
import routeAuth from './routes/routeAuth'
import routeCompany from './routes/routeCompany'

dotenv.config()

const app = express()
const port = process.env.PORT
app.use(express.json())

//ROUTES
app.use(routeAuth)
app.use(routeCompany)
app.use(routeUser)
app.use(routeClient)
app.use(routeSale)
app.use(routeProduct)
app.use(routeStock)
app.use(routeAddress)
app.use(routePhone)
app.use(routeSaleItem)

app.get('/', (req: Request, res: Response) => {
  return res.json({msg: 'Everything is ok now...'})
})


app.listen(port, async () => {
    return console.log(`Server is listening on ${port}`)
})