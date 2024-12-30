const express = require('express')
const logoutRouter = express.Router()
const bcrypt = require('bcrypt')
const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

logoutRouter.use(cookieParser())

logoutRouter.get('/user-logout',async (req,res) => {
    res.cookie('token',"")
    res.redirect('/login/user-login')
})

module.exports = logoutRouter