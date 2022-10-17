const  {faceDetect, faceMatch} = require(`${__dirname}/../face-api/x-face-recognition.js`);



exports.detectFromImage = async (req, res) => {

    const {image} = req.files;

    console.log("Detecting possible Faces...")
    const detections = await faceDetect(image)
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
    res.send(JSON.stringify(possible_faces));
}