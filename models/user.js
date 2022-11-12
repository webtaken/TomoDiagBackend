const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true 
    },
    email: {
        type: String,
        required: true
    }
});

// exportamos el modelo del usuario con el nombre "User"
module.exports = mongoose.model("User", userSchema);