const express = require('express')
const app = express()

var broken = false

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  if (broken) {
    setTimeout( () => {
        res.send('hello world! You have experienced a 5 sec lag ...')
    }, 5000 ) 
  } else {
    res.send("Hello world!")
  }
})

app.get('/break', function (req, res) {
  broken = true 
  res.send("You have successfully broken your service!")
})

app.listen(8080, () => {
  console.log(`Server is working on port 8080`)
})

