const axios = require('axios');
const gpt3 = require('../middlewares/gpt-3.middlewares')


exports.getMovieByActors = async (req, res, next) => {

    let actors  = req.actors;

    actors = actors.filter((actor) => {
        return actor !== "No face match found"
    })

    let names = '';

    actors.forEach((x)=>{
        names += x + ', '
    })

    console.log(`Searching for movies with actors: ${names}`)



    // Using GPT-3 API by OpenAI
    //const prompt = `Give the movie name, imdb id and rating that ${names} co-starred in, as an array `
    const prompt = `Give the name, year, imdb id and rating of one movie that ${names} co-starred in, as a json like this: {"name" : "Movie Name","year" : 2020, "id" : "tt1234567", "rating" : 8.5}`


    let response = null

    try {
        response = (await gpt3.query(prompt)).trim()
    }
    catch (e){
        response = `Error occurred: ${e}`
    }


    console.log(response)
    res.send(response)




}