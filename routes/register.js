const express = require('express')
const registerRouter = express.Router()
const bcrypt = require('bcrypt')
const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

registerRouter.use(cookieParser())


registerRouter.post('/register', async (req, res) => {
  let { name, age, email, weight, password } = req.body

  let user = await userModel.findOne({ email })

  // let user = await userModel.findOne({ email })
  if (user) return res.status(500).send("Already a registered user.")

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let user = await userModel.create({
        name,
        age,
        email,
        password: hash,
        weight
      })

      let token = jwt.sign({ email: email, userid: user.id }, 'secret')
      res.cookie("token", token)
      res.redirect('/login/user-login')
    })

  })

})

module.exports = registerRouter