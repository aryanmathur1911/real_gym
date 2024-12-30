const express = require('express')
const profileRouter = express.Router()
const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

profileRouter.use(cookieParser())

const isLoggedIn = (req, res, next) => {
    if (!req.cookies || !req.cookies.token) {
        return res.redirect('/login');
    }

    try {
        // Verify the JWT token
        let data = jwt.verify(req.cookies.token, 'secret');
        req.user = data; // Attach the decoded token data to `req.user`
        next(); // Call `next()` to proceed to the next route handler
    } catch (error) {
        console.error('JWT verification failed:', error.message);
        res.redirect('/login');
    }
}


profileRouter.get('/profile', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email })
    res.render('profile.ejs', { user })
})

module.exports = profileRouter