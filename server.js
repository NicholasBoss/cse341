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
app.use(bodyParser.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded

app.set("view engine", "ejs")
app.use(expressLayouts)
// app.set("layout", "./layouts/layout")

app.use(static);
app.use('/', routes);
app.use('/contacts', contactRoute)

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