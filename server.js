// express web server
const express = require('express');
const app = express();
const port = 3000;
 
app.get('/', (req, res) => {
  res.send("Peter Ashworth");
});
 
app.listen(process.env.PORT || port, () => {
  console.log('Web Server is listening at http://localhost:' + (process.env.PORT || port));
});