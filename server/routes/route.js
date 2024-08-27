const express = require('express');
const route = express.Router();
const controller = require('../controllers/controller');
const upload = require('../controllers/multer'); 



route.get('/dashboard', controller.dashboard);

route.post('/register', controller.registerUser);

route.put('/edit-user/:id', controller.editUser);

route.delete('/delete-user/:id', controller.deleteUser);

route.post('/login', controller.login);
route.post('/profile-pic', upload.single('profilePic'), controller.profilePic);

module.exports = route;