const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index.js');
const userRouter = require('./routes/user.js');

const middlewares = require('./middlewares');

// app configurations
const app = express();
app.use(bodyParser.json());
app.use(morgan('combined'));
dotenv.config();

// app constants
const NODE_ENV = process.env.NODE_ENV;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/tervu-auth';
const PORT = process.env.PORT || 8000;
const DOMAIN = process.env.DOMAIN;

// MongoDB connection setup
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
const db = mongoose.connection;
db.once('open', () => {
    console.log(`Connected to MongoDB running in ${MONGO_URL}`);
});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine config
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// static file config
app.use('/static', express.static(path.join(__dirname, 'static')));

// app routers
app.use('/', indexRouter);
app.use('/users', userRouter);

// error handling
app.use(middlewares.errorHandler());

app.listen(PORT, () => {
    if (NODE_ENV == "local")
        console.log(`Service is running on http://${DOMAIN}:${PORT}`);
    else
        console.log(`Service is running on http://127.0.0.1:${PORT}`);
});