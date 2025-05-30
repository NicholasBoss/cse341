const express = require('express');
const expressLayouts = require("express-ejs-layouts")
const routes = require('./routes');
const contactRoute = require('./routes/contacts')
const static = require("./routes/static")
const mongodb = require('./database/connect')
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Body Parser Middleware
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
})
app.use(bodyParser.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded

app.set("view engine", "ejs")
app.use(expressLayouts)
// app.set("layout", "./layouts/layout")

app.use(static);
app.use('/', routes);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Oh No! You found a missing page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.send({
    status: err.status || 500,
    message: message
})
})
// app.use('/contacts', contactRoute)

const startServer = async () => {
  try {
    await mongodb.initDb();

    app.listen(process.env.PORT || port, () => {
      console.log('Connected to MongoDB listening at port ' + (process.env.PORT || port));
  })
} catch (error) {
    console.error('Error starting server:', error);
  }
}
 
app.listen(process.env.PORT || port, () => {
  console.log('Web Server is listening at http://localhost:' + (process.env.PORT || port));
});

startServer();