const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config()
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

async function serverOn() {
     try {
         await mongoose.connect(process.env.MONGO_URI)
         console.log(`db connested @ ${process.env.MONGO_URI}`);
     }catch(error){
         console.log(`failed to start the server. ${error}`)
     }
 }
 
 serverOn(); 

app.set('view engine','ejs');
app.use('/uploads',express.static('uploads'))

app.use('/',require('./server/routes/route'));

app.use((req,res)=>{
    res.send("No Page Found!");
})

app.listen(3000,()=>{
     console.log("http://localhost:3000");
})