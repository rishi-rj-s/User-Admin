const jwt = require('jsonwebtoken');
const userM = require('../models/userModel');

const checkUser = async (req, res, next) => {
     try {
          const userToken = req.cookies.userAuth;
          const adminToken = req.cookies.adminAuth;

          console.log(process.env.SECRET_KEY);

          if (userToken) {
               const decodedUser = jwt.verify(userToken, process.env.SECRET_KEY);
               const user = await userM.findOne({ email: decodedUser.email });

               if (!user) {
                    if (req.cookies.userAuth) res.clearCookie('userAuth');
                    return res.redirect('/user/login');
               }

               req.user = user;
               return next(); 

          } else if (adminToken) {
               const admin = jwt.verify(adminToken, process.env.SECRET_KEY);

               if (admin !== process.env.ADMIN_EMAIL) {
                    if (req.cookies.adminAuth) res.clearCookie('adminAuth');
                    return res.redirect('/admin/login');
               }

               req.admin = admin;
               return next(); 

          } else {
               return res.redirect('/user/login');
          }

     } catch (e) {
          console.log(e.message);
          res.status(500).send(e.message);
     }
}

module.exports = checkUser;