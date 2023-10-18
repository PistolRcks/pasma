import Express from 'express'
import { Request, Response } from 'express'
import { isPost, initDB, Post } from './database'
import { dbProfilePicture } from './api/getProfilePicture'

// create databse
export const db = initDB(":memory:")

// Set port
const port = 3000

// Create a new express app
const app = Express()
const api = Express.Router()

// Create a universal route that logs all request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// Router
app.use('/api', api)
app.use(Express.json());
api.use(Express.json());
api.get('/getProfilePicture/:Username', dbProfilePicture)

// Create static route to serve the public folder
app.use(Express.static('./public'))

// Start listening
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})

db.exec(`INSERT INTO Users VALUES ('jared', 'jaredpass', 'some random salt', 'JaredD-2023.png');`);
