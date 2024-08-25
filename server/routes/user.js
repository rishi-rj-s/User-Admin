const express = require('express');
const passport = require('passport');
require('../controllers/googleauth');

const route = express.Router();

route.get('/', (req, res) => {
     res.render('login');
})

route.get('/google', passport.authenticate("google", {
     scope: ['profile', 'email'],
     session: false
}));

route.get('/auth/redirect', passport.authenticate("google",{failureRedirect:'/', session: false}),
     (req,res)=>{
          try{
               res.render('index',{user: req.user});
          }catch(e){
               console.log(e.message);
               res.render('index',{user:false});
          }
     }
);

module.exports = route;