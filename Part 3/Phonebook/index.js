const express = require('express');
const app = express()
const PORT = 3001
const morgan = require('morgan')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
morgan.token('data', function(request, response) {
   return JSON.stringify(request.body)
})

app.use(morgan(function (tokens, request, response) {
   if (tokens.method(request, response) === "POST") {
      return [
         "-------\n",
         "METHOD: ", tokens.method(request, response), "\n",
         "URL: ", tokens.url(request, response), "\n",
         "STATUS: ", tokens.status(request, response), "\n",
         "RES_TIME: ", tokens['response-time'](request,response), "ms\n",
         "DATA:", tokens.data(request, response)
      ].join(" ")
   }
   return [
      "-------\n",
      "METHOD: ", tokens.method(request, response), "\n",
      "URL: ", tokens.url(request, response), "\n",
      "STATUS: ", tokens.status(request, response), "\n",
      "RES_TIME: ", tokens['response-time'](request,response), "ms"
   ].join(" ")
}))

let persons = [
   {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
   },
   {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
   },
   {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
   },
   {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
   }
]

app.get('/', (request, response) => {
   response.send('<>Hello</>')
})

app.get('/api/persons', (request, response) => {
   response.json(persons)
})

app.post('/api/persons', (request, response) => {
   const body = request.body

   if (!body.name || !body.number) return response.status(400).json({
      error: 'content missing'
   })

   const names = [...persons.map(person => person.name)]
   if (names.includes(body.name)) return response.status(400).json({
      error: 'name must be unique'
   })

   const id = Math.floor(Math.random()*1000000);
   const newPerson = {
      "id": id,
      "name": body.name,
      "number": body.number
   }

   persons = persons.concat(newPerson)

   response.json(persons)
})

app.delete('/api/persons/:id', (request, response) => {
   const id = Number(request.params.id)
   persons = persons.filter(person => person.id !== id)

   response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
   const id = Number(request.params.id)
   const person = persons.find(person => person.id === id)

   if (person) response.json(person)
   else response.status(400).end()
})

app.get('/info', (request, response) => {
   response.send(`
   <div>Phonebook has info for ${persons.length} people</div>
   <p>${Date()}</p>
   `)
})

app.listen(PORT, () => {
   console.log(`server is running on port ${PORT}`)
})