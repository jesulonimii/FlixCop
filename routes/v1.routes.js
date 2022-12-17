const router = require('express').Router();
const {detectFromImage} = require("../controllers/detect.controllers");
const {getMovieByActors} = require("../controllers/movie.controllers");
const {verify} = require("../middlewares/verifyApiKey.middlewares");
const gpt3 = require("../middlewares/gpt-3.middlewares");



router.post('/detect/image', verify, detectFromImage, (req, res) => {
    res.send(req.actors)
})

router.post('/find', verify, detectFromImage, getMovieByActors);

router.post('/prompt', verify, async (req, res) => {
    const prompt = req.body.prompt

    let response = null

    try {
        response = await gpt3.query(prompt)
    }
    catch (e){
        response = `Error occured: ${e}`
    }



    console.log(response)
    res.send(response)
})

testDetect = (req, res, next)=>{
    req.actors = ["Chris Evans","No face match found", "Chris Hemsworth" , "Jeremy Renner", "No face match found" , "Scarlett Johansson"]
    //req.actors = ["daenerys targaryen", "Kit Harington"]
    next()
}

module.exports = router;