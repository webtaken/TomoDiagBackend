// Loads the configuration from config.env to process.env
require('dotenv').config({ path: './config.env' });
const fs = require("fs");
const express = require('express');
const cors = require('cors');

// get routes
const diagnosticoRoutes = require("./routes/diagnostico");

// get MongoDB driver connection
const dbo = require('./db/conn');

const PORT = process.env.PORT || 5000;
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
// Creating uploads folder if not already present
// In "uploads" folder we will temporarily upload
// image before uploading to cloudinary
if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

app.use(diagnosticoRoutes);

// Global error handling
app.use(function (err, _req, res, _next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get("/", (req, res) => {
    res.send("Tomodiag Backend");
});




  

// perform a database connection when the server starts
dbo.connectToDB((err) => {
    if(err) {
        console.error(`Error: ${err}`);
        process.exit();
    }
    
    // start the Express server
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
});