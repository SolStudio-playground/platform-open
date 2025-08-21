const multer = require('multer');
const path = require('path');
const fs = require('fs');

async function uploadSingleFile(req, res, next) {
    const allowedMimeTypes = ["image/jpg", "image/gif", "image/jpeg", "image/png"]

    const fileFilter = (req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            cb(new Error("Please select supported Item!"), false)
        }
        cb(null, true)
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const rootDir = path.dirname(require.main.filename)
            fs.mkdirSync(path.join(rootDir, "./public/uploads"), { recursive: true })
            cb(null, path.join(rootDir, "./public/uploads"))
        },
        filename: function (req, file, cb) {
            const extension = file.mimetype.split("/")[1]
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) //Unique Name Oluşturma
            let filename = `image_${uniqueSuffix}.${extension}`
            req.file = filename;
            cb(null, filename)
        }
    })

    const upload = multer({
        storage, fileFilter: (req, file, cb) => {
            const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
            if (!allowedMimeTypes.includes(file.mimetype)) {
                return cb(new Error("Unsupported file type!"), false);
            }
            cb(null, true);
        }
    }).single('coverUrl');
    upload(req, res, function (err) {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        next();
    });
}



module.exports = uploadSingleFile;