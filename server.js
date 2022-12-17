"use strict"

const express = require('express');
const app = express();
const dotenv = require('dotenv').config({path: './config.env'})
const PORT = process.env.PORT || 5000;
const fileUpload = require('express-fileupload');
const v1Router = require(`./routes/v1.routes.js`);
const v2Router = require(`./routes/v2.routes.js`);
const botRouter = require(`./routes/bot.routes.js`);
const {bot_setup} = require('./controllers/bot.controllers.js');


app.use(express.json());
app.use(fileUpload());
app.use(express.static('public'));


app.use('/api/v1/', v1Router);
app.use('/api/v2/', v2Router);
app.use('/api/bot/', botRouter);


app.get('/', (req, res) => {
  res.end("FlixCop api is running");
})

app.get('/status', (req, res) => {
    res.status(200).send("FlixCop api is running");
})


bot_setup().then(r => console.log("FlixCop Telegram Bot is running"));



app.listen(PORT, () => {
    console.log(`Flixcop server is running on port ${PORT}.`);
})

