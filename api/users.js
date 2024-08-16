const express = require('express');
const userApp = express.Router();
const bcryptjs = require('bcryptjs');
const { ReturnDocument } = require('mongodb');

let userCollection

userApp.use((req, res, next) => {
  userCollection = req.app.get('userCollection');
  next();
})

userApp.post('/register', async (req, res) => {
  const newUser = req.body;
  const result = await userCollection.findOne({email : newUser.email})
  if(result !== null){
    return res.send({message : 'Account already exists'})
  }
  newUser.password = await bcryptjs.hash(newUser.password, 7)
  await userCollection.insertOne(newUser)
  res.send({message: 'account created successfully'})
})

userApp.post('/login', async (req, res) => {
  const user = req.body;
  const validUser = await userCollection.findOne({email : user.email})
  if(validUser === null) { return res.send({message : 'user not found'});}
  const passCheck = await bcryptjs.compare(user.password, validUser.password)
  if(passCheck === false) { return res.send({message : 'Invalid password'});}
  res.send({message : 'exist', user : validUser})
})

module.exports = userApp