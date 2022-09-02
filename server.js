import express from 'express'
import mongoose from 'mongoose';
import { APP_PORT, DB_URL } from './config';
import errorHandler from './middlewares/errorhandler';
import cors from "cors";
const app=express();

import routes from './routes'
import path from 'path'

mongoose.connect(DB_URL,{useNewUrlParser:true,useUnifiedTopology:true});
const db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error'))
db.once('open',()=>{
    console.log('DB connected...');
})

global.appRoot=path.resolve(__dirname)

app.use(express.json())
app.use(cors());
app.use(express.urlencoded({extended:false}));//to upload multiform data

app.use('/api',routes)//to register routes in our app


app.use(errorHandler)

app.listen(APP_PORT,()=>console.log(`Listening on port ${APP_PORT}.`));