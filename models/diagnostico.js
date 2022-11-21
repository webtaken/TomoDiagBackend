const mongoose = require("mongoose");

const diagnosticoSchema = mongoose.Schema({
    subject: {
        // El asunto de la tomografía
        type: String,
        required: true
    },
    description: {
        // La descripción de la tomografía
        type: String,
        required: true
    },
    typeAnalysis: {
        // El tipo de análisis a realizarse cervical, etc
        type: String,
        required: true
    },
    imagesUrls: [{
        type: String,
    }]
});

// exportamos el modelo del usuario con el nombre "User"
module.exports = mongoose.model("Diagnostico", diagnosticoSchema);