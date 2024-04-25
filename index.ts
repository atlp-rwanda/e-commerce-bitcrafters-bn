// index.ts
import express, { Application, Request, Response } from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cors from 'cors'
import compression from 'compression'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import specs from './src/helpers/swagger'
import sequelize from './src/database/config/config' // Assuming you have a sequelize instance exported

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

// Start server
const server = http.createServer(app)
server.listen(port, () => {
  console.log(`Server is listening on port http://localhost:${port}`)
})

// Database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.')
  })
  .catch((error: Error) => {
    console.error('Unable to connect to the database:', error)
  })

export default app
