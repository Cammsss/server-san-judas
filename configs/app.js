'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import {dbConnection } from './db.js';
import userModel from '../src/users/user.model.js'
import authRoutes from '../src/auth/auth.routes.js'
import postRoutes from '../src/posts/post.routes.js'
import requestLimit from '../middlewares/request-limit.js'
import 'dotenv/config';


const middlewares = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({extended: false}))
    app.use(cors({
        origin: '*',
        credentials: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content - Type', 'Authorization']
    }));
    app.use(helmet({
        crossOrigiResourcePolicy: { policy: "cross-orgin"},
        crossOriginEmbedderPolicy: false
    }));
    app.use(morgan('dev'));
    app.use(requestLimit)
}

const routes = (app) => {
    app.use('/api/auth', authRoutes)
    app.use('/api/posts', postRoutes)
}

const conectarDB = async () =>{
    try{
        await dbConnection();
    }catch(error){
        console.log(`Error al conectador la db: ${error.message}`)
    }
}

export const initServer = async() => {
    const app = express();

    try{
        middlewares(app)
        routes(app)
        await conectarDB()
        app.listen(process.env.PORT, () =>{
            console.log(`Servidor corriendo en el puerto ${process.env.PORT}`)
        })
         }catch(error){
            console.log(`Error al servidor: ${error}`);
    }
} 