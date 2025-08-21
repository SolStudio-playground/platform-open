const multer = require('multer');
const path = require('path');
const fs = require('fs');

async function uploadSingleFile(req, res, next) {
    const allowedMimeTypes = ["image/jpg", "image/gif", "image/jpeg", "image/png"]

    const fileFilter = (req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            cb(new Error("Bu Resim Tip Desteklenmemektedir. Lütfen Farklı Bir Resim Seçiniz!"), false)
        }
        cb(null, true)
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadsDir = path.join(__dirname, '../../public', 'uploads');
            fs.mkdirSync(uploadsDir, { recursive: true });
            cb(null, uploadsDir);
        },
        filename: function (req, file, cb) {
            const extension = file.mimetype.split("/")[1]
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) //Unique Name Oluşturma
            let filename = `image_${uniqueSuffix}.${extension}`
            req.file = filename;
            cb(null, filename)
        }
    })

    const upload = multer({ storage, fileFilter }).single("file");
    upload(req, res, function(err) {
        if(err) {
            return res.status(500).json({message: err.message});
        }
        next();
    });
}


module.exports = { uploadSingleFile };