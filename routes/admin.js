const express = require('express')
const adminRouter = express.Router()
const bcrypt = require('bcrypt')
const adminModel = require('../models/admin')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

adminRouter.use(cookieParser())



const isAdminLoggedIn = (req,res,next) => {
  if(!req.cookies || !req.cookies.token){
    return res.redirect('admin-login')
  }
  try {
    // Verify the JWT token
    let data = jwt.verify(req.cookies.token, 'secret');
    req.admin = data; // Attach the decoded token data to `req.user`
    next(); // Call `next()` to proceed to the next route handler
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    res.redirect('/admin-login');
  }
}

adminRouter.get('/admin-login', (req, res) => {
  res.render('adminLogin.ejs')
})


adminRouter.post('/admin-login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await adminModel.findOne({ username });
    if (!admin) return res.status(401).send('Invalid credentials');

    bcrypt.compare(password, admin.password, (err, result) => {
      if (!result) return res.send("Invalid Credentials")
      const token = jwt.sign({ username: admin.username }, 'secret')
      res.cookie('token', token)
      res.render('adminpage.ejs',{admin})
    })

  } catch (error) {
    res.status(500).send('Internal server error');
  }
})
adminRouter.get('/admin-logout',(req,res) => {
  res.cookie('token',"")
  res.redirect('/admin/admin-login')
})

adminRouter.get('/adminPage',isAdminLoggedIn,(req,res) => {
  res.render("adminPage.ejs",{admin : req.admin})
})

module.exports = adminRouter