const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

//initializes command's values and database's link
const url = process.env.DB_URL;

//connect, then log if failed
mongoose.connect(url)
    .then(result => {
        console.log('connected to DataBase')
    })
    .catch(error => {
        console.log("Connection to database failed:", error.message)
    })

//set Schema and set schema
const personSchema = new mongoose.Schema({
   "name": {
        type: String,
        minLength: [3, `Name's length must be >= 3 letters`],
        required: [true, `User's name required!`]
    },
   "number": {
        type: String,
        minLength: [8, `Number's length must be >= 8`],
        required: [true, `Phone number required!`],
        validate: {
            validator: (v) => /^\d{3}-\d+/.test(v),
            validator: (v) => /^\d{2}-\d+/.test(v),
            message: props => `${props.value} is not a valid phone number.`
        }
    }
})

//set toJson
personSchema.set('toJSON', {
    transform: (document, returned) => {
        returned.id = returned._id.toString();
        delete returned._id;
        delete returned.__v;
    }
})

module.exports = mongoose.model('Person', personSchema)