require('dotenv').config()
const express = require('express')
const { MongoClient } = require('mongodb')
const app = express()
const port = 4000
const uri = process.env.MONGO_URL
const noteApp = require('./api/note.js')
const taskApp = require('./api/task.js')
const userApp = require('./api/users.js')


app.use(express.json())

MongoClient.connect(uri)
.then((client) => {
  const database = client.db('ToDoApp')

  const taskCollection = database.collection('taskCollection')
  const noteCollection = database.collection('noteCollection')
  const userCollection = database.collection('userCollection')

  app.set('taskCollection', taskCollection)
  app.set('noteCollection', noteCollection)
  app.set('userCollection', userCollection)

  console.log('DB connection established')
})

app.use('/note',noteApp)
app.use('/task',taskApp)
app.use('/user',userApp)

app.listen(port, () => {
  console.log(`Server listening on port number ${port}\nhttps://localhost:7777`)
})