require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

// middleware
const errorHandlerMiddleware = require('./src/middleware/errorHandler')
const notFoundMiddleware = require('./src/middleware/not-fount')

// db
const connectDB = require('./src/db/connect')

// routes
const authRouter = require('./src/routes/authRouter')
const userRouter = require('./src/routes/userRouter')
const postRouter = require('./src/routes/postRouter')
const commentRouter = require('./src/routes/commentRouter')

const port = process.env.PORT || 5000
app.get('/', (req, res) => {

    res.send('blog api');
})


app.use(cookieParser(process.env.JWT_SECRET))
app.use(fileUpload())
app.use(express.json())
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/comments', commentRouter)



app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

const start = async () => {

    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => console.log(`app is listening on port ${port}`))
    } catch (error) {
        console.log(error);
    }
}

start()