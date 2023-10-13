import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';

require('dotenv').config();
import { ProductModel } from './models/products';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cors())
app.get('/products', async(req: express.Request, res: express.Response) => {
    try {
        const products = await ProductModel.find({})
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post('/product', async(req: express.Request, res: express.Response) => {
    try {
        const product = await ProductModel.create(req.body)
        res.status(200).json(product)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: err.message})
    }
})

app.delete('/product/:id', async(req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params
        const product = await ProductModel.findByIdAndDelete(id)

        if (!product) {
            return res.status(404).json({ message: `cannot find any product with ID ${id}`})
        }
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

const server = http.createServer(app);

server.listen(8080, () => {
    console.log("server running on 8080")
})
const password = encodeURIComponent(process.env.ADMIN_PASSWORD)
const uri = `mongodb+srv://admin:${password}@cluster0.znvfnu0.mongodb.net/?retryWrites=true&w=majority` 
mongoose.Promise = Promise;
mongoose.connect(uri)
.then(() => {
    console.log('connected to db')
})
.catch((err) => {
    console.log("error connect to db", err.message)
})
