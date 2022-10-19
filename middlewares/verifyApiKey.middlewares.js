
const verify = (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.headers['api-key'];
    if (apiKey === "authorize123") {
        next();
    } else {
        res.status(401).send("Unauthorized Access");
    }
}

module.exports = {
    verify
}