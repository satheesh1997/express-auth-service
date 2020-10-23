const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index.js');
const userRouter = require('./routes/user.js');

// app configurations
const app = express();
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/tervu-auth';
const PORT = process.env.PORT || 8000;
app.use(bodyParser.json());
dotenv.config();

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

// app routers
app.use('/', indexRouter);
app.use('/users', userRouter);

app.listen(PORT, () => {
    console.log(`Service is running on http://127.0.0.1:${PORT}`);
});