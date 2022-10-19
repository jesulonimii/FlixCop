const router = require('express').Router();
const {detectFromImage} = require("../controllers/detect.controllers");
const {getMovieByActors} = require("../controllers/movie.controllers");
const {verify} = require("../middlewares/verifyApiKey.middlewares");



router.post('/detect/image', verify, detectFromImage, (req, res) => {
    res.send(req.actors)
})

router.post('/find', verify, detectFromImage, getMovieByActors);

testDetect = (req, res, next)=>{
    req.actors = ["Chris Evans","No face match found", "Chris Hemsworth" , "Jeremy Renner", "No face match found" , "Scarlett Johansson"]
    //req.actors = ["daenerys targaryen", "Kit Harington"]
    next()
}

module.exports = router;