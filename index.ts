import express, { Request, Response } from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cors from 'cors'
import compression from 'compression'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import specs from './src/helpers/swagger'

dotenv.config()
const port = process.env.PORT || 3000

const app = express()
// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use(
  cors({
    credentials: true,
  }),
)

app.use(compression())
app.use(bodyParser.json())

const server = http.createServer(app)

app.get('/welcome', (req: Request, res: Response) => {
  res.status(200).send({ message: 'Welcome to my API' })
})
server.listen(port, () => {
  // console.log(`listening on port https://localhost:${port}`)
})

export default app
// app.use('/', router())
// startServer();
