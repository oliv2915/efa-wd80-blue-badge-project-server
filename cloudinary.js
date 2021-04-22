const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDNIARY_URL);

module.exports = cloudinary;