import express, { Request, Response } from 'express'
import * as dotenv from 'dotenv'
import register from './routes/register'
import deleteRoute from './routes/delete'
import view from './routes/view'
import update from './routes/update'
import auth from './routes/auth'

dotenv.config()

const app = express()
const port = process.env.PORT
app.use(express.json())

//ROUTES
app.use(register)
app.use(update)
app.use(view)
app.use(deleteRoute)
app.use(auth)

app.get('/', (req: Request, res: Response) => {
  return res.json({msg: 'Everything is ok now...'})
})


app.listen(port, async () => {
    return console.log(`Server is listening on ${port}`)
})