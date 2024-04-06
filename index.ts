import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv'

dotenv.config()
let port  = process.env.PORT || 3000

export const  app = express();

app.use(cors({
    credentials:true,
}))

app.use(compression()); 
app.use(bodyParser.json());

const server = http.createServer(app);

app.get('/welcome', (req:any, res:any)=>{
  res.status(200).send({message:"Welcome to my API"})
})
  server.listen(port, ()=>{
    console.log(`listening on port https://localhost:${port}`)
}) 

// app.use('/', router())
