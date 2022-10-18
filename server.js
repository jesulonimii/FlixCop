"use strict"

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const fileUpload = require('express-fileupload');
const v1Router = require(`./routes/v1.routes.js`);
const v2Router = require(`./routes/v2.routes.js`);



app.use(fileUpload());

app.use(express.static('public'));


app.use('/api/v1/', v1Router);
app.use('/api/v2/', v2Router);

app.get('/', (req, res) => {
  res.end("FlixCop api is running");
})



app.listen(PORT, () => {
    console.log(`Flixcop server is running on port ${PORT}.`);
})