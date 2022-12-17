const { setup, setName, setCommands } = require("../controllers/bot.controllers");
const router = require('express').Router()



router.post('/set/name', setName)
router.post('/set/commands', setCommands)


module.exports = router
