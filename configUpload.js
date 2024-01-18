const multer = require('multer');
const path = require('path');

//https://forum.freecodecamp.org/t/handling-file-upload-in-node-js-multer-postman/436593/19
//https://github.com/expressjs/multer#storage
//https://expressjs.com/en/resources/middleware/multer.html

// Définir le chemin de stockage et le nom du fichier
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'C:/Users/wersl/OneDrive/Documents/GitHub/StudySync/src/assets/uploads'); // Remplacer par le chemin de votre dossier de stockage d'images
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Filtrer les types de fichiers autorisés
const fileFilter = function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Erreur : Seuls les fichiers images sont autorisés !');
    }
};

// Initialiser Multer avec les options de stockage et de filtrage
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
}).single('image');

function uploadImg(req, res) {
    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: err.message });
        } else if (err) {
            return res.status(500).json({ error: err });
        }
        
        if (!req.file) {
            return res.status(400).json({ error: "Aucun fichier n'a été téléchargé." });
        }

        res.status(200).json({ fileName: req.file.filename });
    });
}

module.exports = uploadImg;
