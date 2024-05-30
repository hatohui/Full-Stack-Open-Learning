//initializes usages
require('dotenv').config()
const express = require('express');
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const PORT = process.env.PORT;
const Person = require('./models/person');
const { trusted } = require('mongoose');

//handlers
const unknownEndpoint = (request, response) => {
   response.status(404).send({ error: "page not found" })
}
const errorHandler = (error, request, response, next) => {
   console.log(error.message);

   if (error.name === 'CastError') {
      return response.status(400).send({ error: 'invalid ID' })
   } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
   }

   next(error)
}

//set app usage
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('dist'))
app.use(express.json())

//set morgan token to print data.
morgan.token('data', function (request, response) {
   return JSON.stringify(request.body)
})

//console logger
app.use(morgan(function (tokens, request, response) {
   if (tokens.method(request, response) === "POST" 
      || tokens.method(request, response) === "PUT"
      || tokens.method(request, response) === "DELETE") {
      return [
         "-------\n",
         "METHOD: ", tokens.method(request, response), "\n",
         "URL: ", tokens.url(request, response), "\n",
         "STATUS: ", tokens.status(request, response), "\n",
         "RES_TIME: ", tokens['response-time'](request, response), "ms\n",
         "DATA:", tokens.data(request, response)
      ].join(" ")
   }
   return [
      "-------\n",
      "METHOD: ", tokens.method(request, response), "\n",
      "URL: ", tokens.url(request, response), "\n",
      "STATUS: ", tokens.status(request, response), "\n",
      "RES_TIME: ", tokens['response-time'](request, response), "ms"
   ].join(" ")
}))

//
app.get('/', (request, response) => {
   response.send('Error')
})

app.get('/Zahy', (request, response) => {
   response.json({
      name: "Bitch",
      title: "Stinky Cat",
      birthday: "16/2"
   })
})

app.get('/Xonorth', (request, response) => {
   response.json({
      name: "Xonorth",
      title: "Bitch of the year",
      birthday: "17th August"
   })
})

//get all values in database
app.get('/api/persons', (request, response, next) => {
   Person
      .find({})
      .then(person => {
         if (person.length !== 0) response.json(person)
         else response.status(404).end()
      })
      .catch(error => next(error))
})

//delete person in database
app.delete('/api/persons/:id', (request, response, next) => {
   Person.findByIdAndDelete(request.params.id)
      .then(result => {
         response.json(result)
         response.status(204).end()
      })
      .catch(error => next(error))
})

//replace oldPhone number with new
app.put('/api/persons/:id', (request, response, next) => {
   const { name, number } = request.body;
   Person
      .findByIdAndUpdate(request.params.id, {
         name: name,
         number: number
      }, { new: true , runValidators: true, context: 'query'})
      .then(result => {
         console.log(result)
         response.json(result)
      })
      .catch(error => next(error))
})

//create new Person in database
app.post('/api/persons', (request, response, next) => {
   const {name, number} = request.body

   const newPerson = new Person({
      name: name,
      number: number
   })

   newPerson.save().then(saved => {
      response.json(saved)
   })
      .catch(error => next(error))
})

//get by ID
app.get('/api/persons/:id', (request, response, next) => {
   Person.findById(request.params.id)
      .then(person => {
         if (person) response.json(person)
         else response.status(404).end();
      })
      .catch(error => next(error))
})

//get info
app.get('/info', (request, response) => {
   Person
      .countDocuments({}).exec()
      .then(value => response.send(`
      <div>Phonebook has info for ${value} people</div>
      <p>${Date()}</p>
      `))
})

//page listener.
app.listen(PORT, () => {
   console.log(`server is running on port ${PORT}`)
})

//handlings
app.use(unknownEndpoint)
app.use(errorHandler)