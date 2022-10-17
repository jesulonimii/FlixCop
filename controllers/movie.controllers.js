const axios = require('axios');

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

    const config = {
        headers: {
            ["Content-Type"]: "application/json",
        }
    }

    const data = {
        "search": {
            "dop": "",
            "actor": "",
            "full_text": names,
            "movie_id": ""
        },
        "img": "",
        "page": 0,
        "number_per_pages": 10
    }

    await axios.post('https://api.flim.ai/2.0.0/search', data, config).then(({data}) => {

        const result = data["query_response"].images;

        const movies_result = result.filter((x) => {
            return x["category"].toLowerCase() === "movies".toLowerCase()
        })

        const tv_shows_result = result.filter((x) => {
            return x["category"].toLowerCase() === "TVEPISODES".toLowerCase()
        })

        res.send(`The movies are: ${JSON.stringify(movies_result)}\n\n\nThe tv shows are: ${JSON.stringify(tv_shows_result)}`)

    }).catch((err) => {
        console.log(err)
        res.end(err)
    })


}