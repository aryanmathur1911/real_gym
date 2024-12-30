const express = require('express')
const loginRouter = express.Router()
const bcrypt = require('bcrypt')
const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

loginRouter.use(cookieParser())


loginRouter.post('/user-login', async (req, res) => {
    let { name, age, email, weight, password } = req.body

    let user = await userModel.findOne({ email })
    if (!user) return res.status(500).send("Something went wrong.")

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            let token = jwt.sign({ email: req.body.email, userid: user._id }, 'secret')
            res.cookie('token', token)
            return res.status(200).redirect("/account/profile");
        }
        else {
            res.redirect('/login/user-login')
        }
    })
    // res.send(user)
})

loginRouter.get('/user-login', (req, res) => {
    res.render('user-login.ejs')
})

module.exports = loginRouter