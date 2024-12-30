const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

const adminRouter = require('./routes/admin')
const registerRouter = require('./routes/register')
const loginRouter = require('./routes/login')
const profileRouter = require('./routes/profile')
const createDietRouter = require('./routes/dietchart')
const logoutRouter = require('./routes/logout')


const userModel = require('./models/user')
const dietModel = require('./models/diet')
const adminModel = require('./models/admin')
const path = require('path')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const { log } = require('console')

const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/admin',adminRouter)
app.use('/register',registerRouter)
app.use('/login',loginRouter)
app.use('/account',profileRouter)
app.use('/dietchart',createDietRouter)
app.use('/logout',logoutRouter)


app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.set('view engine', 'ejs')

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



// app.post('/register', async (req, res) => {
//   let { name, age, email, weight, password } = req.body

//   let user = await userModel.findOne({ email })

//   // let user = await userModel.findOne({ email })
//   if (user) return res.status(500).send("Already a registered user.")

//   bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, async (err, hash) => {
//       let user = await userModel.create({
//         name,
//         age,
//         email,
//         password: hash,
//         weight
//       })

//       let token = jwt.sign({ email: email, userid: user.id }, 'secret')
//       res.cookie("token", token)
//       res.redirect('/login')
//     })

//   })

// })

// app.get('/dietchart', isLoggedIn, async (req, res) => {
//   let user = await userModel.findOne({ email: req.user.email })

//   let dietChart = await dietModel.findOne({
//     'weightRange.min': { $lte: user.weight },
//     'weightRange.max': { $gte: user.weight },
//   })

//   res.render('dietchart.ejs', { dietChart, user })

// })

// app.post('/login', async (req, res) => {
//   let { name, age, email, weight, password } = req.body

//   let user = await userModel.findOne({ email })
//   if (!user) return res.status(500).send("Something went wrong.")

//   bcrypt.compare(password, user.password, (err, result) => {
//     if (result) {
//       let token = jwt.sign({ email: req.body.email, userid: user._id }, 'secret')
//       res.cookie('token', token)
//       return res.status(200).redirect("/profile");
//     }
//     else {
//       res.redirect('/login')
//     }
//   })
//   // res.send(user)
// })

// app.get('/login', (req, res) => {
//   res.render('login.ejs')
// })




// app.get('/profile', isLoggedIn, async (req, res) => {
//   let user = await userModel.findOne({ email: req.user.email })
//   res.render('profile.ejs', { user })
// })

app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})