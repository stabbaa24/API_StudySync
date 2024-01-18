let Teacher = require('../model/teacher');

//https://mongoosejs.com/docs/populate.html

// Récupérer tous les professeurs (GET)
function getTeachers(req, res) {
    Teacher.find()
        .populate('user', 'login')
        .exec((err, students) => {
            if (err) {
                res.send(err)
            }
            res.json(students);
        });
}

// Ajout d'un professeur (POST)
function addTeacher(req, res) {
    let teacher = new Teacher();
    teacher.user = req.body.user;
    teacher.nom = req.body.nom;
    teacher.prenom = req.body.prenom;
    teacher.image = req.body.image;


    console.log("POST teacher reçu :");
    console.log(teacher);

    teacher.save((err, savedTeacher) => {
        if (err) {
            res.status(500).send('Erreur ajout professeur : ' + err);
            return;
        }
        res.status(201).json({ message: `${savedTeacher.nom} OK` });
    });
}

module.exports = { getTeachers, addTeacher };