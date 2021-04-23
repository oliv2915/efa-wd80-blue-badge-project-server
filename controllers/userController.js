const router = require("express").Router();
const { UserModel} = require("../models");
const { UniqueConstraintError, ValidationError } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validateSession = require("../middleware");


router.post("/signup", async (req, res) => {
    // get access to all the properties that we will need to create a user
    let {username, email, password, confirmPassword, firstName, lastName} = req.body.user;
    // check to see if the required fields have values, this is defined by the UserModel
    if (!username || !email || !password || !confirmPassword || !firstName || !lastName) return res.status(400).json({message: "Username, Email, Password, Confirm Password, First Name, and Last Name are required"});
    // check to see if passwords and confirmPassword match, if not return a message
    if (password !== confirmPassword) return res.status(400).json({message: "Passwords do not match"})
    /*
                            Username and Password Validation Checks
        username must be greater than 4 characters. One character must be a number or special character - validateUserName
        password must be greater then 6 characters. Password must contain a number and special character - validatePassword
    */
    const validateUserName = new RegExp("^.*(?=.{4,128})(?=.*[0-9])|(?=.*[!@#$%&*()_+=|<>?{}\\[\\]~-]).*$");
    const validatePassword = new RegExp("^.*(?=.{4,128})(?=.*[0-9])(?=.*[!@#$%&*()_+=|<>?{}\\[\\]~-]).*$");
    // if username does not match our requirements, return an error.
    if (!validateUserName.test(username)) return res.status(400).json({message: "Username must be a minimum of 4 characters, have one number or special charcter."})
    // if password does not match our requirements, return an error
    if (!validatePassword.test(password)) return res.status(400).json({message: "Password must be a mimimum of 6 characters, have one number, and one special character"})
    /*
        At this point, password and username meet requirements and we have a the required user data
        Attempt to create the user in the database. As the same time, hash the user password
    */
    try {

        const createdUser = await UserModel.create({ // create user
            username,
            email,
            password: bcrypt.hashSync(password, 13), // hash user password before it is saved to the database
            firstName,
            lastName
        });
        
        // create a sessionToken for the user
        const token = jwt.sign({id: createdUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

        return res.status(201).json({ // return a sterile user object based on the createdUser
            message: "User account created successfully",
            user: {
                id: createdUser.id,
                username: createdUser.username,
                email: createdUser.email,
                firstName: createdUser.firstName,
                lastName: createdUser.lastName,
                createdAt: createdUser.createdAt
            },
            sessionToken: token
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
           return res.status(400).json({message: "Username and/or Email are already in use"})
        } else if(err instanceof ValidationError) {
            return res.status(400).json({message: err.message})
        } else {
            return res.status(500).json({message: "Failed to sign up"});
        }
    }
});

router.post("/login", async (req, res) => {
    // get access to username and password properties for our user
    const {username, password} = req.body.user;
    // check to see if the username and password are empty, if they are, return a message
    if (!username || !password) return res.status(400).json({message: "Username and Password are required"});
    // try to location a user with the provided username
    try {
        const foundUser = await UserModel.findOne({
            where: {
                username: username
            }
        });
        // if we did not find a user, invalid login attempt, return a message
        if (!foundUser) return res.status(401).json({message: "Username and/or password provided is incorrect"});
        // if we reached this point, we found a user, lets check to see if the user password matches the foundUser.password
        const passwordsMatch = await bcrypt.compare(password, foundUser.password);
        // if passwords don't match, invalid login attempt, return a message
        if (!passwordsMatch) return res.status(401).json({message: "Username and/or password provided is incorrect"});
        // at this point, user has passed on attempt to deny them access, let them have access
        // create a session token
        const token = jwt.sign({id: foundUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
        // return a json resonse with message, sterile user obj, and a sessionToken
        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: foundUser.id,
                username: foundUser.username,
                email: foundUser.email,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName
            },
            sessionToken: token
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            return res.status(400).json({message: "Username and/or Email are already in use"})
         } else if(err instanceof ValidationError) {
             return res.status(400).json({message: err.message})
         } else {
             return res.status(500).json({message: "Failed to sign up"});
         }
    }
});

module.exports = router