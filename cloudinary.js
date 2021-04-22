const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDNARY_URL);

module.exports = cloudinary;