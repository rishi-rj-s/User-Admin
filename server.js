const express = require('express');
const app = express();

const dotenv = require('dotenv')
dotenv.config()

app.listen(3000,()=>{
     console.log("http://localhost:3000");
})

app.set('view engine','ejs')


app.use('/',require('./server/routes/user'));