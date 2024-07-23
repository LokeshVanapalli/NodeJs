require('dotenv').config()
// async-error

const express = require('express')
const app = express()
const connectDB = require('./db/connect')
const productRouter = require('./routes/products')

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')

// middleware
app.use(express.static('./public'))
app.use(express.json())

//routes

app.get('/',(req,res)=>{
    res.send('<h2>Store Api</h2><a href="/api/v1/products">products</a>')
})

app.use('/api/v1/products',productRouter)

//product route

app.use(notFoundMiddleware);
app.use(errorMiddleware);


const port = process.env.PORT || 3000
const start = async () => {
    try {
        //connectDB()
        await connectDB(process.env.MONGO_URI)
        app.listen(port,(req,res)=>{
        console.log(`Server listening on port ${port}...`);
        })
    } catch (error) {
        console.log(error);
    }
}

start()