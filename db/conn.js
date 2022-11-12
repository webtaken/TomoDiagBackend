const mongoose = require("mongoose");
module.exports = {
    connectToDB: (callback) => {
        mongoose.connect(
            process.env.ATLAS_URI
        ).then(() => {
            console.log("Connected to mongodb tomodiag database");
            return callback();
        }).catch((err) => {
            return callback(err);
        });
    }
}
