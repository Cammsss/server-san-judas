'use strict'

import mongoose from 'mongoose'

export const dbConnection = async () =>{
    try{
        mongoose.connection.on('error', () => {
            console.log('MongoDb | no se pudo conectar a mongoDB')  
        })
         mongoose.connection.on('connecting', () => {
            console.log('MongoDb | intentando conectar a mongoDB')  
        })
         mongoose.connection.on('connected', () => {
            console.log('MongoDb | conectando a mongoDB')  
        }) 
         mongoose.connection.on('open', () => {
            console.log('MongoDb | conectando a la base de datos')  
        })
         mongoose.connection.on('reconnected', () => {
            console.log('MongoDb | reconectando a mongoDB')  
        })
         mongoose.connection.on('disconnected', () => {
            console.log('MongoDb | desconectado a mongoDB')  
        })
        await mongoose.connect(process.env.URI_MONGODB, {
            serverSelectionTimeoutMS:5000,
            maxPoolsize: 10,
        })
    }catch(error){
        console.log(`Error al conectar la db: ${error}`)
    }
}