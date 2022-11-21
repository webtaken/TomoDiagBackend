// Loads the configuration from config.env to process.env
require('dotenv').config({ path: './config.env' });

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
app.use(diagnosticoRoutes);

// Global error handling
app.use(function (err, _req, res, next) {
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