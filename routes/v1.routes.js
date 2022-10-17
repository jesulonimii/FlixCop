const router = require('express').Router();
const {detectFromImage} = require("../controllers/detect.controllers");


router.post('/detect/image', detectFromImage);


module.exports = router;