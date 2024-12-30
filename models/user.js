const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/Gymnie')

const userSchema = mongoose.Schema({
    name : String,
    age : Number,
    email : String,
    password : String,
    weight : Number
})

module.exports = mongoose.model('user',userSchema)