

const express = require('express');
const { checkDomain } = require('../middleware/domain');
const uploadFile = require('../utils/upload');
const router = express.Router();
const { authenticateToken } = require('../middleware/authCheck');
const User = require('../models/User'); // to do : change to user


const path = require('path');
const fs = require('fs');


const Personel = require('../models/Personel');
const Metadata = require('../models/Metadata');





router.post('/uploadTokenPicture', uploadFile.uploadSingleFile, checkDomain, async (req, res) => {
    if (req.file) {
        const { walletAddress, _id } = req.body;

        try {
                const User = await User.findById(_id);
                
                if (!User) {
                    return res.status(404).json({ message: "User not found" });
                }

                if (User.UserPicture) {
                    // Assuming User.UserPicture stores the relative path like '/uploads/oldPicture.jpg'
                    const oldImagePath = path.join(__dirname, '../../public', User.UserPicture);
                    fs.unlink(oldImagePath, (err) => {
                        if (err) console.error('Error deleting old image:', err);
                        else console.log('Old image deleted successfully');
                    });
                }
                // create a newMetadata document with the uploaded image path
                const newMetadata = new Metadata({
                    image: `/uploads/${req.file.filename}`,
                });
                await newMetadata.save();

                // Construct the new image path
                const imagePath = `/uploads/${req.file.filename}`;

                // Update the User document with the new image path
                User.UserPicture = imagePath;
                await User.save();

                // If file upload and database update are successful
                return res.status(200).json({
                    message: "Dosya Başarıyla Yüklendi ve User Güncellendi",
                    filename: req.file.filename,
                    imagePath: imagePath
                });
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
        }
        return res.status(400).json({ message: "Dosya Yüklenemedi" });
    }
);