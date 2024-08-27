const express = require('express');
const route = express.Router();
const controller = require('../controllers/controller');
const upload = require('../controllers/multer'); 


// ADMIN ROUTES

route.get('/dashboard', controller.dashboard);

route.post('/register', controller.registerUser);
route.post('/admin-login', controller.adminLogin);

route.put('/edit-user/:id', controller.editUser);

route.delete('/delete-user/:id', controller.deleteUser);

// USER ROUTES

route.post('/user-login', controller.userLogin);
route.post('/profile-pic', upload.single('profilePic'), controller.profilePic);

module.exports = route;