const express = require('express')
const { ReturnDocument } = require('mongodb')
const noteApp = express.Router()

let noteCollection
noteApp.use((req, res, next) => {
  noteCollection = req.app.get('noteCollection')
  next()
})

noteApp.post('/addNote',async (req, res) => {
  const{email, ...note} = req.body
  let arr = await noteCollection.findOne({email : email})
  if(arr === null){
    await noteCollection.insertOne({email : email, notes : [note]})
  }else{
    arr = arr.notes;
    if(arr.some(samp => samp.title === note.title)){
      res.send({message : "Choose any other title"})
      return;
    }
    arr.push(note)
    await noteCollection.findOneAndUpdate(
      {email : email},
      {$set : {notes : arr}},
      {ReturnDocument : 'after'}
    )
  }
  res.send({message : 'Note added successfully'})
})

noteApp.put('/updateNote',async (req, res) => {
  const {email, ...note} = req.body
  let arr = await noteCollection.findOne({email : email})
  arr = arr.notes;
  const samp  = arr.find((noteSamp) => noteSamp.title === note.title);
  samp.description = note.description;
  await noteCollection.findOneAndUpdate(
    {email : email},
    {$set : {notes : arr}},
    {ReturnDocument : 'after'}
  )
  res.send({message : 'Note updated'})
})

noteApp.delete('/deleteNote',async (req, res) => {
  const {email, ...note} = req.body
  let arr = await noteCollection.findOne({email : email})
  arr = arr.notes;
  const samp = arr.splice(arr.findIndex(a => a.title === note.title) , 1)
  await noteCollection.findOneAndUpdate(
    {email : email},
    {$set : {notes : arr}},
    {ReturnDocument : 'after'}
  ) 
  res.send({message : 'Note deleted successfully'})
})

noteApp.get('/getNotes', async (req, res) => {
  const email = req.body.email
  const notes = await noteCollection.find({email : email}).toArray()
  res.send({notes : notes})
})

module.exports = noteApp