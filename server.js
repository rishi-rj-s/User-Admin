const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config()
// const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

async function serverOn() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`db connested @ ${process.env.MONGO_URI}`);
    } catch (error) {
        console.log(`failed to start the server. ${error}`)
    }
}

serverOn();

app.use(cors());
const corsOptions = {
    origin: 'http://localhost:4200',
    optionSuccessStatus: 200,
    credentials: true
};
app.use(cors(corsOptions));


app.use('/uploads', express.static('uploads'));

app.use('/',(req, res, next) => {
    console.log(`Request received method : ${req.method} and route : ${req.originalUrl}`);
    next(); // Pass control to the next middleware
});

app.use('/', 
    require('./server/routes/route'));

app.use((req, res) => {
    res.send("No Page Found!");
})


app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`);
})