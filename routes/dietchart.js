const express = require('express')
const createDietRouter = express.Router()
const bcrypt = require('bcrypt')
const adminModel = require('../models/admin')
let dietchartModel = require('../models/diet')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const userModel = require('../models/user')


createDietRouter.use(cookieParser())


const isAdminLoggedIn = (req, res, next) => {
  if (!req.cookies || !req.cookies.token) {
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


createDietRouter.get('/create-dietchart',isAdminLoggedIn, (req, res) => {
  res.render('create-dietchart.ejs')
})
createDietRouter.post('/create-dietchart',isAdminLoggedIn, async (req, res) => {

  // res.render('create-dietchart.ejs')
  let admin = await adminModel.findOne({username : req.admin.username})
  let { minweight, maxweight, purpose, breakfast, lunch, dinner } = req.body
  let dietobj = {}
  let weightRange = {
    "min": minweight,
    "max": maxweight,
  }

  let chartdetailsObj = {
    purpose,

    meals: [{
      time: "breakfast",
      meal: breakfast
    },
    {
      time: "lunch",
      meal: lunch
    },
    {
      time: "dinner",
      meal: dinner
    }]
  }

  let chart = await dietchartModel.findOne({
    'weightRange.min': { $lte: minweight },
    'weightRange.max': { $gte: maxweight },
  })

  if (chart) {
    chart.chartDetails.push(chartdetailsObj);
    await chart.save()
  } 
  else {
    let chartDetails = [chartdetailsObj]
    chart = {
      weightRange,
      chartDetails
    }
    let dietchart = await dietchartModel.create(
      chart
    )

  }

  res.render('adminPage.ejs',{admin})

})



createDietRouter.get('/view-dietchart', isLoggedIn, async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email })

  let dietChart = await dietchartModel.findOne({
    'weightRange.min': { $lte: user.weight },
    'weightRange.max': { $gte: user.weight },
  })

  res.render('view-dietchart.ejs', { dietChart, user })

    
  } catch (error) {
    console.error('Error fetching diet chart:', error.message);
    res.status(500).send('Server Error');
  }
  
})

createDietRouter.get('/all-dietcharts',isAdminLoggedIn,async (req,res) => {
  let allDietCharts = await dietchartModel.find({})
  res.render('all-dietcharts.ejs',{allDietCharts})
  
})

module.exports = createDietRouter