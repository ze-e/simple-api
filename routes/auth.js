import express from "express";
import {v4 as createId} from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import verifyToken from "../middleware/verifyToken.js";
import {users} from "../data/users.js";
import checkValues from "../validation/validate.js";
import {sanitizeUser} from "../utils/user.js";

const router = express.Router();


/* Register a new user */
router.post('/sign-up', async (req, res) => {
  const data = req.body;
  if(!data.userName || !data.email || !data.password) return res.status(400).send("UserName, email and password required");
  const isValid = checkValues(data, users);
  if(!isValid.valid) return res.status(400).send(isValid.msg);
  
  try{
    const newUser = {
      id: createId(),
      userName:data.userName,
      email:data.email,
      password: await bcrypt.hash(data.password, 10)
    }
    users.push(newUser);
    return res.status(200).send(`New user: ${users.find(user => user.id === newUser.id).userName} created!`);
  }
  catch(e){
    return res.status(500).send(`Error creating user`);
  }
});

/* Log in user */
router.post('/sign-in', async (req, res) =>{
  const data = req.body;
  if(!data.email || !data.password) return res.status(400).send("Valid email and password required");
  
  try{
    const user = users.find(i => i.email === data.email);
    if(!user) return res.status(404).send("User not found");
    if(await bcrypt.compare(data.password, user.password)){
      try{
        const token = await jwt.sign({user}, process.env.SECRETKEY,{expiresIn: '1d'});
        return res.status(200).send({token, user:sanitizeUser(user)});
      }
      catch(e){
        return res.status(500).send("Error generating token");
      }
    } 
    else return res.status(400).send("Invalid email or password");
  }
  catch(e){
    return res.status(500).send(`Error signing in`);
  }
});

/* Protected */
/* Get current user */
router.get('/me', verifyToken, async (req, res)=>{
  try{
    const user = req.user;
    return user ?  res.status(200).send(sanitizeUser(user)) : res.status(403).send(`Error: Invalid token`);
  }
  catch(e){
    return res.status(500).send(`Error verifying user`);
  }
});

export default router;