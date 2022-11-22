const express = require("express");
const multer = require("multer");
const fs = require("fs");
const diagnosticoSchema = require("../models/diagnostico");

// ROUTER
const router = express.Router();

// CLOUDINARY
// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// MULTER
const multerConfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, `./public/diagnosticos`);
    },
    filename: (req, file, callback) => {
        // const extension = file.mimetype.split("/")[1]; // la extensión de la imagen
        callback(null, `image-${Date.now()}`);// poniendo el nombre de la imagen
    }
});


let isImage = (req, file, callback) => {
    if(file.mimetype.startsWith('image')) {
        callback(null, true);
    } else {
        callback(new Error('Only images are allowed.'));
    }
};

const upload = multer({
    storage: multerConfig,
    fileFilter: isImage
});
/////////////////////////////////////////////////////////////

// FUNCTIONS
async function uploadToCloudinary(localFilePath) {
  
    // locaFilePath: path of image which was just
    // uploaded to "uploads" folder
  
    // filePathOnCloudinary: path of image we want
    // to set when it is uploaded to cloudinary
    var filePathOnCloudinary = `${localFilePath}`;
  
    return cloudinary.uploader
        .upload(localFilePath, { public_id: filePathOnCloudinary })
        .then((result) => {
  
            // Image has been successfully uploaded on
            // cloudinary So we dont need local image 
            // file anymore
            // Remove file from local uploads folder
            fs.unlinkSync(localFilePath);
  
            return {
                status: "SUCCESS",
                url: result.url,
            };
        })
        .catch((error) => {
            // Remove file from local uploads folder
            fs.unlinkSync(localFilePath);
            return { status: "ERROR" };
        });
}

// ROUTES
// obtener todos los diagnósticos
router.get("/diagnosticos", (req, res) => {
    const query = 
    diagnosticoSchema
    .find({})
    .select({
        description: 0, // excluding only description
    });

    query.exec(function (err, data) {
        if (err) {
            res.status(400).json({
                status: "ERROR"
            });
            return;
        }
        const formattedData = data.map((item) => {
            return {
                _id: item._id,
                subject: item.subject,
                typeAnalysis: item.typeAnalysis,
                cover: item.imagesUrls[0]
            };
        });
        const message = {
            status: "OK",
            list: formattedData
        }
        res.status(200).json(message);
    });
});

// obtener un diagnóstico por su id
router.get("/diagnosticos/:id", (req, res) => {
    const { id } = req.params;
    const query = diagnosticoSchema.findById(id);

    query.exec(function (err, data) {
        if (err || data === null) {
            res.status(400).json({
                status: "ERROR"
            });
            return;
        }

        const message = {
            status: "OK",
            diagnose: data
        }
        res.status(200).json(message);
    });
});

//  Primero subirá la imagen con multer y luego responderá con success
router.post("/diagnosticos/images/upload", 
upload.single("tomografia"), 
async (req, res) => {
    // req.file is the `profile-file` file
    // req.body will hold the text fields,
    // if there were any  
    // req.file.path will have path of image
    // stored in uploads folder
    var localFilePath = req.file.path;
  
    // Upload the local image to Cloudinary 
    // and get image url as response
    var result = await uploadToCloudinary(localFilePath);
    
    // enviamos la respuesta
    res.json(result);
});

// crear un diagnóstico nuevo
router.post("/diagnosticos", (req, res) => {
    const diagnostico = diagnosticoSchema(req.body);
    // creando el diagnostico
    diagnostico
    .save()
    .then((data) => {
        res.status(200).json({
            status: "OK"
        })
     }) 
    .catch((err) => {
        res.status(400).json({
            status: "ERROR"
        });
    });
});

// actualizar un diagnóstico
router.put("/diagnosticos/:id", (req, res) => {
    const { id } = req.params;
    const { subject, typeAnalysis, description } = req.body;  

    diagnosticoSchema
    .updateOne({ _id:id }, { $set: { subject, typeAnalysis, description }})
    .then((data) => {
        res.status(200).json({
            status: "OK",
        })
     }) 
    .catch((err) => {
        res.status(400).json({
            status: "ERROR",
        });
    });
});

// delete user
router.delete("/diagnosticos/:id", (req, res) => {
    const { id } = req.params;
    diagnosticoSchema
    .deleteOne({ _id : id })
    .then((data) => {
        res.status(200).json({
            status: "OK"
        })
     }) 
    .catch((err) => {
        res.status(400).json({
            status: "ERROR"
        });
    });
});

module.exports = router;