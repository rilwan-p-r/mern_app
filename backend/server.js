import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';

const port = process.env.PORT || 5000
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js';

connectDB()
const app = express()
app.use(cors({
    origin: 'http://localhost:3000'
  }));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

app.use('/api/users', userRoutes)
app.use('/api/admin',adminRoutes)

app.get('/', (req, res) => {
    res.send('server is ready')
})

app.use(notFound)
app.use(errorHandler)



app.listen(port, () => console.log(`serever started on port http://localhost:${port}`))