import express, { Application, Request, Response } from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cors from 'cors'
import compression from 'compression'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import specs from './src/helpers/swagger'
import userRoute from './src/routes/userRoute'
import loginRoute from './src/routes/loginRoute'
import sequelizeConnection from './src/database/config/db.config' // Assuming you have a sequelize instance exported

dotenv.config()

const port = process.env.PORT || 3000
const app: Application = express()

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use(cors({ credentials: true }))
app.use(compression())
app.use(bodyParser.json())

// Routes
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to my E-Commerce API' })
})
app.use('/users', userRoute)
app.use('/users', loginRoute)

const server = http.createServer(app)
server.listen(port)
// databse connection
sequelizeConnection.authenticate()
export { app, server, sequelizeConnection }
