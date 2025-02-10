import express from 'express';
import { login, logout, register } from '../controller/auth/auth.controller';
import { createUser, getMe, getUserById, updateUser, verifyTokenMe } from '../controller/user.controller';
var cors = require('cors');




export const router = express.Router();

//login
router.route("/login").post(login);
router.route('/logout').post( logout); 

// --- Rota /me (Protegida) ---
router.route('/me').get( verifyTokenMe, getMe); // Use o middleware e o controlador


//register
router.route("/newuser").post(register);

//user
router.route("/user/:id").get(verifyTokenMe,getUserById);
//update user
router.route("/user/:id").put(verifyTokenMe, updateUser);