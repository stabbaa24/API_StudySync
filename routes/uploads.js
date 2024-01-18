let Upload = require('../configUpload');

function uploadImg(req, res, next) {
    Upload(req, res, function (err) {
        if (err) {
            res.send(err);
        } else {
            if (!req.file) {
                return next();
            }

            req.imagePath = `/uploads/${req.file.filename}`;
            res.locals.imagePath = req.imagePath;
            next();
        }
    });
}

module.exports = uploadImg;
