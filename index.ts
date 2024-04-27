import express, { Application, Request, Response } from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cors from 'cors'
import compression from 'compression'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import specs from './src/helpers/swagger'
import userRoute from './src/routes/userRoute'
import sequelizeConnection from './src/database/config/db.config'

dotenv.config()

const port = process.env.PORT || 3000
const app: Application = express()

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use(cors({ credentials: true }))
app.use(compression())
app.use(bodyParser.json())

// Routes
app.get('/welcome', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to my API' })
})
app.use('/users', userRoute)

const server = http.createServer(app)
server.listen(port)
// databse connection
sequelizeConnection.authenticate()
export { app, server, sequelizeConnection }
