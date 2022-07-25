const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const groupRouter = require('./routes/groupRoutes')
const eventRouter = require('./routes/eventRoutes')
const postRouter = require('./routes/postRoutes')
const notificationRouter = require('./routes/notificationRoutes')
const reportRouter = require('./routes/reportRoutes')
const directRouter = require('./routes/directRoutes')

const dbUrl = process.env.DB_URL
mongoose.connect(dbUrl, { useNewUrlParser: true })
  .then(console.log(`CONNECTED TO DATABASE ${dbUrl}`))
  .catch(err => console.log(err))

const app = express()

app.use(express.json())
app.use(cors({ origin: true }))

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/group', groupRouter)
app.use('/post', postRouter)
app.use('/event', eventRouter)
app.use('/notification', notificationRouter)
app.use('/report', reportRouter)
app.use('/direct', directRouter)

app.get('/', (req, res) => {
  res.send('API SUCESSFULLY CONNECTED')
})

app.get('/session', (req, res) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Not logged in' })
  try {
    const user = jwt.verify(token, process.env.TOKEN)
    return res.status(200).json({ user })
  }
  catch (err) {
    return res.status(500).json({ message: `Error: ${err.message}` })
  }
})

const port = process.env.PORT
app.listen(port, () => {
  console.log(`LISTENING ON PORT ${port}`)
})