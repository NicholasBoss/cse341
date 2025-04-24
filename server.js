const express = require('express');
const routes = require('./routes');
const app = express();
const port = 3000;

app.use('/', routes);
 
app.listen(process.env.PORT || port, () => {
  console.log('Web Server is listening at http://localhost:' + (process.env.PORT || port));
});