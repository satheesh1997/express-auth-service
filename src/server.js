const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const middlewares = require('./middlewares');

// app configurations
const app = express();
app.use(bodyParser.json());
app.use(morgan('combined'));
dotenv.config();

// app constants
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/tervu-auth';
const PORT = process.env.PORT || 8000;

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

// app middlewares
app.use(middlewares.errorHandler());

app.listen(PORT, () => {
    console.log(`Service is running on http://127.0.0.1:${PORT}`);
});