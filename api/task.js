const express = require('express')
const { ReturnDocument } = require('mongodb')
const taskApp = express.Router()

let taskCollection

taskApp.use((req, res, next) => {
  taskCollection = req.app.get('taskCollection')
  next()
})

taskApp.post('/addtask',async (req, res) => {
  const{email, ...task} = req.body
  let arr = await taskCollection.findOne({email : email})
  if (arr === null){
    await taskCollection.insertOne({email : email, tasks : [task]})
  }else{
    arr = arr.tasks;
    if(arr.some(samp => samp.title === task.title)){
      res.send({message : "Choose any other title"})
      return;
    }
    arr.push(task)
    await taskCollection.findOneAndUpdate(
      {email : email},
      {$set : {tasks : arr}},
      {ReturnDocument : 'after'}
    ) 
  }
  res.send({message : 'task added successfully'})
})

taskApp.put('/updatetask',async (req, res) => {
  const{email, ...task} = req.body
  let arr = await taskCollection.findOne({email : email})
  arr = arr.tasks
  const samp  = arr.find((taskSamp) => taskSamp.title === task.title);
  samp.description = task.description;
  samp.deadline = task.deadline;
  await taskCollection.findOneAndUpdate(
    {email : email},
    {$set : {tasks : arr}},
    {ReturnDocument : 'after'}
  )
  res.send({message : 'task updated'})
})

taskApp.delete('/deletetask',async (req, res) => {
  const {email, ...task} = req.body
  let arr = await taskCollection.findOne({email : email})
  arr = arr.tasks;
  const samp = arr.splice(arr.findIndex(a => a.title === task.title) , 1)
  await taskCollection.findOneAndUpdate(
    {email : email},
    {$set : {tasks : arr}},
    {ReturnDocument : 'after'}
  ) 
  res.send({message : 'task deleted successfully'})
})

module.exports = taskApp


