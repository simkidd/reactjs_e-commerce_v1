import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser'

import uRouter from './routes/userRoute';
import cRouter from './routes/categoryRoute';
import pRouter from './routes/productRoute';
import payRouter from './routes/paymentRoute';
import uploadRouter from './routes/upload'


dotenv.config()

// initialize express
const app = express()

// middlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true
}))

// custom routes
app.use('/user', uRouter)
app.use('/api', cRouter)
app.use('/api', pRouter)
app.use('/api', payRouter)
app.use('/api', uploadRouter)


// home route
app.get("/", (req,res)=>{
    res.json("Backend is running...")
})

// server config
const startServer = async()=>{
    try {
        await connectDB()
        app.listen(process.env.PORT, ()=>{
            console.log(`Server running on port ${process.env.PORT}`);
        })
    } catch (err) {
        console.log(err);
        process.exit(1)
    }
}

startServer()