let Student = require('../model/student');

//https://mongoosejs.com/docs/populate.html

// Récupérer tous les étudiants (GET)
function getStudents(res) {
    Student.find()
    .populate('user', 'login') 
    .exec((err, students) => {
        if (err) {
            res.send(err)
        }
        res.json(students);
    });
}

// Ajout d'un étudiant (POST)
function addStudent(req, res) {
    let student = new Student();
    student.user = req.body.user;
    student.nom = req.body.nom;
    student.prenom = req.body.prenom;
    student.image = req.body.image;
    student.groupe = req.body.groupe;
    student.promo = req.body.promo;
    student.image = req.body.image;

    console.log("Création devoirs :");
    console.log(student);

    student.save((err, savedStudent) => {
        if (err) {
            res.status(500).send('erreur ajout student : ' + err);
            return;
        }
        res.status(201).json({ message: `${savedStudent.nom} add OK` });
    });
}

module.exports = { getStudents, addStudent };