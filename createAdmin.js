const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const adminModel = require('./models/admin')

mongoose.connect('mongodb://localhost:27017/Gymnie')

const createAdmin =  async() => {
    const username = 'Admin'
    const password = 'Admin123'

    bcrypt.genSalt(10,(err,salt) =>{
        bcrypt.hash(password,salt,async (err,hash) => {
            let existingUser = await adminModel.findOne({username})
            if(existingUser) return console.log("Already existing admin.")
            
            let createdAdmin = await  adminModel.create({
                username : username,
                password : hash
            })
            console.log('Admin created successfully');
            mongoose.connection.close();
        })
    })
}

createAdmin()