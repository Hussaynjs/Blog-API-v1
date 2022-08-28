require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

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

app.set('trust proxy', 1);
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 60,
    })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser(process.env.JWT_SECRET))
app.use(fileUpload())
app.use(express.json())

const port = process.env.PORT || 5000
app.get('/', (req, res) => {
    res.send('<h1>Blog   API</h1><a href="/api-docs">Documentation</a>');
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));



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