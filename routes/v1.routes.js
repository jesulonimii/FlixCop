const router = require('express').Router();
const {detectFromImage} = require("../controllers/detect.controllers");
const {getMovieByActors} = require("../controllers/movie.controllers");



router.post('/detect/image', detectFromImage, (req, res) => {
    res.send(req.actors)
})

router.post('/find', detectFromImage, getMovieByActors);

testDetect = (req, res, next)=>{
    req.actors = ["Chris Evans","No face match found", "Chris Hemsworth" , "Jeremy Renner", "No face match found" , "Scarlett Johansson"]
    //req.actors = ["daenerys targaryen", "Kit Harington"]
    next()
}

module.exports = router;