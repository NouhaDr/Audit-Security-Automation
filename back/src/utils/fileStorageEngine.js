const multer = require("multer");

const setDestinationUserImage = (req, file, cb) => {
    cb(null, "./src/static/images");
}

const setDestinationAuditFiles = (req, file, cb) => {
    cb(null, "./src/static/files");
}

const setFileName = (req, file, cb) => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    cb(null, formattedDate + "--" + file.originalname);
}

const storageUserImage = multer.diskStorage({
    destination: setDestinationUserImage ,
    filename: setFileName
});

const storageAuditFiles = multer.diskStorage({
    destination: setDestinationAuditFiles ,
    filename: setFileName
});


const uploadUserImage = multer({
    storage: storageUserImage
});
const uploadAuditFiles = multer({
    storage: storageAuditFiles
});

module.exports = { uploadUserImage, uploadAuditFiles }