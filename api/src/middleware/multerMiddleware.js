const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    filename: function (req, file,cb) {
        const ext = path.extname(file.originalname)
        const name = path.basename(file.originalname, ext)

        cb(null, name + "-" + Date.now() + ext)
    },
    destination: function (req, file,cb) {
        cb(null, path.join(__dirname, '../uploads'))
    }
})

function fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase()
    const mime = file.mimetype
    const allowedTypes = /jpg|jpeg|png/

    if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
        cb(null, true)
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"),false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
})

function multerErrorHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        if (err === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ message: "File size can not exceed 5MB" })
        }
        if (err === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                message: " .jpg .png .jpeg files are suppoerted!"
            })
        }
    }
    if (err) {
        return res.status(500).json({ message: err.message });
    }
    next();
}


module.exports = { upload , multerErrorHandler}