const  {faceDetect, faceMatch} = require(`${__dirname}/../face-api/x-face-recognition.js`);



exports.detectFromImage = async (req, res, next) => {

    const {image} = req.files;

    console.log("\n====START DETECTING======\n");
    console.log("Detecting possible Faces...")
    const detections = await faceDetect(image.data, res);
    console.log(`Found ${detections.length} face(s)`)


    console.log("Recognizing Faces...")
    const possible_faces = []
    for (const detection of detections) {
        let result = "Error: Request timed out. Please try again."
        if (detection) {
            result = faceMatch(detection.descriptor)
        }
        possible_faces.push(result._label.toString())
    }


    //output result
    console.log("\x1b[32m", `\nResult: ${possible_faces}\n`, "\x1b[0m")
    //res.send(JSON.stringify(possible_faces));
    console.log("\n=====FINISHED======\n");
    req.actors = possible_faces;
    next()

}

exports.detectFromUrl = async (req, res, next) => {

    const { image } = req.body; //expects image url

    console.log("\n====START DETECTING======\n");
    console.log("Detecting possible Faces...")
    const detections = await faceDetect(image, res);
    console.log(`Found ${detections.length} face(s)`)


    console.log("Recognizing Faces...")
    const possible_faces = []
    for (const detection of detections) {
        let result = "Error: Request timed out. Please try again."
        if (detection) {
            result = faceMatch(detection.descriptor)
        }
        possible_faces.push(result._label.toString())
    }


    //output result
    console.log("\x1b[32m", `\nResult: ${possible_faces}\n`, "\x1b[0m")
    //res.send(JSON.stringify(possible_faces));
    console.log("\n=====FINISHED======\n");
    req.actors = possible_faces;
    next()

}