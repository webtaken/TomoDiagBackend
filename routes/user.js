const express = require("express");
const userSchema = require("../models/user");

const router = express.Router();

// get all users
router.get("/users", (req, res) => {
    userSchema
    .find()
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json({
            message: err
        });
    });
});

// get user by id
router.get("/users/:id", (req, res) => {
    const { id } = req.params;
    userSchema
    .findById(id)
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json({
            message: err
        });
    });
});

// create user
router.post("/users", (req, res) => {
    const user = userSchema(req.body);
    // creating user
    user
    .save()
    .then((data) => {
        res.json(data)
     }) 
    .catch((err) => {
        res.json({
            message: err
        });
    });
});

// update user
router.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { name, age, email } = req.body;  

    userSchema
    .updateOne({ _id:id }, { $set: { name, age, email }})
    .then((data) => {
        res.json(data)
     }) 
    .catch((err) => {
        res.json({
            message: err
        });
    });
});

// delete user
router.delete("/users/:id", (req, res) => {
    const { id } = req.params;

    userSchema
    .remove({ _id : id })
    .then((data) => {
        res.json(data)
     }) 
    .catch((err) => {
        res.json({
            message: err
        });
    });
});

module.exports = router;