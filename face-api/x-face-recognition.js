//load models and reference images
const faceapi = require("face-api.js");
const fs = require('fs').promises;
const {loadImage, Canvas, Image} = require("canvas");

faceapi.env.monkeyPatch({ Canvas, Image})
const MODEL_URL = __dirname + '/models'

const HOST_URL = process.env.HOST_URL || 'http://localhost:5000'

//load models
const loadModels = async () => {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL)
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL)
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL)
}
//function to load reference images
const fetchRefFaces = async (url) => {


    const xlabels = [
        'Jon Snow',
        'Emilia Clarke'
    ]

    const labels = []

    //create label list from reference images available
    try {
        await fs.readdir(`${__dirname}/../public`).then((files) => {
            files.forEach(file => {
                labels.push(file.split('.')[0])
            });
        });
    } catch (err) {
        console.error(err);
    }

    return Promise.all(
        labels.map(async label => {
            let imgUrl = `${url}/${label}.jpg`
            let img;

            img = await loadImage(imgUrl).catch(async (err) => {
                imgUrl = `${url}/${label}.png`
                img = await loadImage(imgUrl).catch((err) => {
                    console.log(`Reference Image for ${label} not found from ${imgUrl}`)
                })
            })

            console.log(`Analyzing reference image for ${label}`)

            const descriptions = []

            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
            if (!detections) {
                throw new Error(`no faces detected for ${label}`)
            }

            descriptions.push(detections.descriptor)


            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    );

}


let labeledFaceDescriptors = null
loadModels().then(async () => {
    console.log("\x1b[31m",'\n=========Starting===========\n',"\x1b[33m")
    console.log('Models loaded')

    //checking if reference database file exists, analyzing and creating if not, reading existing if it does
    fs.stat(`${__dirname}/reference-db/face-descriptors.json`).then((stats) => {

        readDescriptorsFile()

    }).catch(async (err) => {

        console.log('Reference database file not found...Creating new...')
        await fetchRefFaces(HOST_URL).then((data) => {
            console.log('All reference images analysed\n')

            //convert to json
            const descriptors = data.map(x=>x.toJSON())

            saveDescriptors(JSON.stringify(descriptors)).then((ok) => {
                if (!ok) {
                    console.log('Error saving reference database file')
                    return Error('Error saving reference database file')
                }

                readDescriptorsFile()


            })
        })

    })



})


faceMatch = (descriptor) => {
    const result = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6).findBestMatch(descriptor)
    console.log(result)
    if (result._label === 'unknown') {
        result._label = 'No face match found'
    }
    return result
}

faceDetect = async (image) => {
    const img = await loadImage(image.data);
    const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();

    return detections;
}


//other functions
async function saveDescriptors(data) {
    try {
        await fs.writeFile(`${__dirname}/reference-db/face-descriptors.json`, data, 'utf8',{ flag: "wx" }, (err) => {
            if (err) {
                console.log(err)
            }
            console.log('Reference database file saved')
            return true
        })
    } catch (err) {
        console.log(`Error saving file: ${err}`)
        return false
    }
    return false

}

async function readDescriptorsFile() {
    try {

        console.log('Reading reference database file')
        fs.readFile(`${__dirname}/reference-db/face-descriptors.json`, 'utf8').then((data) => {


            console.log('Reference database file loaded')
            //convert to faceapi readable file
            labeledFaceDescriptors = JSON.parse(data).map( x=>faceapi.LabeledFaceDescriptors.fromJSON(x) );
            //done
            console.log("\x1b[32m",'\n=========Ready===========\n\n',"\x1b[0m")

        }).catch((err) => {
            console.log(`Error reading file: ${err}`)
        })

    } catch (err) {
        console.log(`Error trying to read file: ${err}`)
        return false
    }
    return false

}



//export
module.exports = {
    faceMatch,
    faceDetect
}