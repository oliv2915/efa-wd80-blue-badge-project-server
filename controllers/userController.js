const router = require("express").Router();
const { UniqueConstraintError, ValidationError } = require("sequelize");
const { UserModel} = require("../models");


router.post("/signup", async (req, res) => {
    let {username, email, password, firstName, lastName} = req.body.user;
    try{
        const User = await UserModel.create({
            username,
            email,
            password,
            firstName,
            lastName
        });
        res.status(201).json({
            message: "User has signed in successfully!",
            user: User,
        });

    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email already is use.",
            });
        } else if(err instanceof ValidationError) {
           
            res.status(400).json({
                message: err.message
            })
        } else {
            
            res.status(500).json({
                message: "Failed to sign up"
            });

        }
    }
});
module.exports = router