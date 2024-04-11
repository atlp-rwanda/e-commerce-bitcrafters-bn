// index.ts
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import sequelize from './src/config/database';
import router from './src/routes/routes'
dotenv.config();
const port = process.env.PORT || 3000;

export const app = express();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(bodyParser.json());
app.use(router);
const server = http.createServer(app);

//Testing if the database is authenticated and listening the port
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');

        await sequelize.sync();
        console.log('All models were synchronized successfully.');

        server.listen(port, () => {
            console.log(`Server is listening on port http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Unable to start the server:', error);
    }
}

app.get('/welcome', (req, res) => {
    res.status(200).send({ message: "Welcome to my API" });
});

startServer();
