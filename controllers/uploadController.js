const router = require("express").Router();
const {UserModel, RecipeModel} = require("../models");
const {validateSession} = require("../middleware");
const cloudinary = require("../cloudinary");
const streamifier = require("streamifier");

router.post("/", validateSession, async (req, res) => {
    // get the image that was uploaded
    const image = req.files.image;
    // converts cloudinary upload process into a promise
    // uses streamifier stream the image buffer into the
    // cloudinary api, returns a result on success or error on failure
    const uploadImage = async (buffer) => {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET
            }, (error, result) => {
                if (result) resolve(result);
                else reject(error)
            });
            streamifier.createReadStream(buffer).pipe(uploadStream);
        });
    };

    // handles userProfile uploading and updating of user record with image data
    const handleUserProfileImageUpload = async () => {
        try {
            // upload file to cloudinary and update the user recod with the cloudinary data
            const imageUploadResponse = await uploadImage(image.data);
            // submit the update
            await UserModel.update({profileImageURL: imageUploadResponse.secure_url},
                {where: {username: req.user.username}}
            );
            // return the result
            return res.status(200).json({message: "Profile image upload success"});
        } catch (err) {
            return res.status(500).json({message: "Error uploading image"});
        }
    }

    // handles recipe image uploading
    const handleRecipeImageUpload = async () => {
        try {
            // upload the image to cloudinary
            const imageUploadResponse = await uploadImage(image.data);
            // update recipe with the imageUploadResponse Data
            await RecipeModel.update({recipeImageURL: imageUploadResponse.secure_url},
                {where: {id: req.query.recipe, userId: req.user.id}}
            );
            // return a message
            return res.status(200).json({message: "Recipe image upload success"});
        } catch (err) {
            return res.status(500).json({message: "Error uploading image"});
        }
    }

    /* 
        Switch based on the type of image that needs
        to be uploaded. types are user and recipe
        ?type=user
        If type recipe is provided, recipe id is required
        &recipe=1
    */
    switch (req.query.type) {
        case "user":
            handleUserProfileImageUpload();
            break;
        case "recipe":
            if (isNaN(req.query.recipe)) return res.status(400).json({message: `&recipe=${req.query.recipe} must be the id number of the recipe`});
            handleRecipeImageUpload();
            break;
        default:
            console.log("nothing to upload")
            break;
    };
});



module.exports = router;