import express from 'express';
import { login } from '../controller/auth/auth.controller';
import { createUser, getUserById, updateUser } from '../controller/user.controller';
var cors = require('cors');




export const router = express.Router();

//login
router.route("/login").post(login);


//register
router.route("/newuser").post(createUser);

//user
router.route("/user/:id").get(getUserById);
//update user
router.route("/user/:id").put(updateUser);