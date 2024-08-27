const userM = require('../models/userModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const cookieOptions = {
     httpOnly: true,
     maxAge: 30 * 60 * 1000
};

function errorHandle(e, res) {
     console.log(e.stack);
     res.status(500).json({ message: e.message });
}

exports.adminLogin = async (req, res) => {
     try {
          const { email, password } = req.body;
          if (!process.env.ADMIN_EMAIL || !process.env.HASHED_ADMIN_PASSWORD) {
               return res.status(500).json({ message: 'Server configuration error' });
          }
          if (email !== process.env.ADMIN_EMAIL) {
               return res.status(400).json({ message: 'Invalid Email!' });
          }
          const isPasswordValid = await bcrypt.compare(password, process.env.HASHED_ADMIN_PASSWORD);
          if (isPasswordValid) {
               const token = jwt.sign({ email: process.env.ADMIN_EMAIL }, process.env.JWT_SECRET, { expiresIn: '30m' });
               res.cookie('adminAuth', token, cookieOptions);
               res.status(200).json({ message: 'Login Success' });
          } else {
               res.status(400).json({ message: 'Invalid Password!' });
          }
     } catch (e) {
          errorHandle(e, res);
     }
}

exports.dashboard = async (req, res) => {
     try {
          const search = req.query.search;
          let users;
          if (search) {
               users = await userM.find({
                    name: { $regex: search, $options: 'i' }
               }).select('name email _id');
          } else {
               users = await userM.find();
          }
          if (users.length === 0) {
               return res.status(404).json({ message: 'No users found' });
          }
          res.status(200).json({ users });
     } catch (e) {
          errorHandle(e, res);
     }
}

exports.deleteUser = async (req, res) => {
     try {
          const userId = req.params.id;
          if (!mongoose.Types.ObjectId.isValid(userId)) {
               return res.status(400).json({ message: 'Invalid User ID' });
          }
          const deletedUser = await userM.findByIdAndDelete(userId);

          if (!deletedUser) {
               return res.status(404).json({ message: 'User not found' });
          }
          res.status(200).json({ message: "Success" });
     } catch (e) {
          errorHandle(e, res);
     }
}

exports.registerUser = async (req, res) => {
     try {
          const { name, email, password } = req.body;
          const existingUser = await userM.findOne({ email });
          if (existingUser) {
               return res.status(400).json({ message: "Email already in use" });
          }
          const hashPass = await bcrypt.hash(password, 10);
          const user = new userM({
               name: name,
               email: email,
               password: hashPass
          });
          await user.save();
          res.status(200).json({ message: "Success" });
     } catch (e) {
          errorHandle(e, res);
     }
}

exports.editUser = async (req, res) => {
     try {
          const { id } = req.params;
          const { name, email } = req.body;
          const existingUser = await userM.findOne({ email });
          if (existingUser && existingUser._id.toString() !== id) {
               return res.status(400).json({ message: "Email already in use" });
          }
          const updatedUser = await userM.findByIdAndUpdate(
               id,
               { name, email },
               { new: true, runValidators: true }
          );
          if (!updatedUser) {
               return res.status(404).json({ message: "User not found" });
          }
          res.status(200).json({ message: "User updated successfully" });
     } catch (e) {
          errorHandle(e, res);
     }
}

exports.userLogin = async(req,res)=>{
     try {
          const { email, password } = req.body;
            if (!email || !password) {
              return res.status(400).json({ message: 'Email and password are required' });
          }  
          const user = await userM.findOne({ email });
          if (!user) {
              return res.status(400).json({ message: 'Invalid email or password' });
          }
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (isPasswordValid) {
              const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '30m' });
              res.cookie('userAuth', token, cookieOptions);
              res.status(200).json({ message: 'Login successful' });
          } else {
              res.status(400).json({ message: 'Invalid email or password' });
          }
      } catch (e) {
          errorHandle(e, res);
      }
}

exports.profilePic = async (req, res) => {
     try {
          if (!req.file) {
               return res.status(400).json({ message: 'No file uploaded' });
          }
          const filePath = req.file.path;
          const userId = req.body.id;
          if (!mongoose.Types.ObjectId.isValid(userId)) {
               return res.status(400).json({ message: 'Invalid user ID' });
          }
          const updatedUser = await userM.findByIdAndUpdate(userId, { profilePic: filePath }, { new: true });
          if (!updatedUser) {
               return res.status(404).json({ message: 'User not found' });
          }
          res.status(200).json({ message: 'Profile picture uploaded successfully', filePath });
     } catch (e) {
          errorHandle(e, res);
     }
}