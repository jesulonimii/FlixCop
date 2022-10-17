"use strict"

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const fileUpload = require('express-fileupload');
const v1Router = require(`./routes/v1.routes.js`);


app.use(fileUpload());

app.use(express.static('public'));



app.use('/v1/', v1Router);



app.listen(PORT, () => {
    console.log(`Flixcop server is running on port ${PORT}.`);
})