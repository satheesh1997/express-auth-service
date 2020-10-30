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

if(process.env.NODE_ENV === "DEV")
    dotenv.config({path: path.resolve(process.cwd(), '.env.dev')});
else
    dotenv.config();

// app constants
const DOMAIN = process.env.DOMAIN;
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;
const PROTOCOL = process.env.PROTOCOL;

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
    console.log(`Service is running on ${PROTOCOL}://${DOMAIN}:${PORT}`);
});