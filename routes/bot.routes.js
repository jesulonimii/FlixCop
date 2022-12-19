const { setCommands } = require("../controllers/bot.controllers");
const router = require('express').Router()



router.post('/set/commands', setCommands)


module.exports = router
