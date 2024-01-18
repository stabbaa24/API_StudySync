let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let assignment = require('./routes/assignments');
let user = require('./routes/users');
let teacher = require('./routes/teachers');
let student = require('./routes/students');
let subject = require('./routes/subjects');
let verifyToken = require('./routes/verifyToken');
let cors = require('cors');
const uploadImg = require('./routes/uploads'); // Remplacez './routes/uploads' par le chemin correct vers votre fichier de téléchargement

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//const uri = 'mongodb+srv://mb:P7zM3VePm0caWA1L@cluster0.zqtee.mongodb.net/assignments?retryWrites=true&w=majority';
const uri = "mongodb+srv://stabbaa24:newMDPMangoDB@cluster0.04bjdix.mongodb.net/assignments?retryWrites=true&w=majority";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
    console.log("\n\nvérifiez with http://localhost:8010/api/assignments que cela fonctionne pour les assignments");
    console.log("\n\nvérifiez with http://localhost:8010/api/users que cela fonctionne pour les users");
    console.log("\n\nvérifiez with http://localhost:8010/api/users/login que cela fonctionne pour le login (avec Postman par exemple)");
  },
    err => {
      console.log('Erreur de connexion: ', err);
    });

app.use(cors({
  origin: 'http://localhost:4200', // ou '*' pour autoriser toutes les origines
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'x-access-token']
}));

// Pour les formulaires
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = process.env.PORT || 8010;

// les routes
const prefix = '/api';

// Routes Assignments
app.route(prefix + '/assignments')
  .get(/*verifyToken,*/ assignment.getAssignments); // pour récupérer tous les assignments

app.route(prefix + '/assignments/:id')
  .get(/*verifyToken,*/ assignment.getAssignment)
  .delete(/*verifyToken,*/ assignment.deleteAssignment); // pour supprimer un assignment

app.route(prefix + '/assignments')
  .post(/*verifyToken,*/ assignment.postAssignment)
  .put(/*verifyToken,*/ assignment.updateAssignment); // pour modifier un assignment

// Routes Users
app.route(prefix + '/users')
  .get(/*verifyToken,*/ user.getUsers) // pour récupérer tous les users

app.route(prefix + '/users/login')
  .post(user.logInUser) // pour se connecter

app.route(prefix + '/users/role')
  .post(/*verifyToken,*/ user.getRole) // pour récupérer le rôle de l'utilisateur

app.route(prefix + '/users/register')
  .post(user.registerUser) // pour s'incrire

// Routes Students
app.route(prefix + '/students')
  .get(/*verifyToken,*/ student.getStudents)
  .post(student.addStudent);

// Routes Teachers
app.route(prefix + '/teachers')
  .get(/*verifyToken,*/ teacher.getTeachers)
  .post(teacher.addTeacher);

// Routes Subjects
app.route(prefix + '/subjects')
  .get(/*verifyToken, */subject.getSubjects) //après test remettre verifytoken
  .post(subject.addSubject);

  // avec ID
app.route(prefix + '/subjects/:id')
  .get(/*verifyToken, */subject.getSubject)
  //.delete(verifyToken, subject.deleteSubject);

// Routes Uploads
app.post(prefix + '/students/uploads', uploadImg, (req, res) => {
  // Votre logique après le téléchargement de l'image, par exemple enregistrer le chemin de l'image dans la base de données
  res.json({ imagePath: res.locals.imagePath });
});

app.post(prefix + '/teachers/uploads', uploadImg, (req, res) => {
  // Même logique pour les enseignants
  res.json({ imagePath: res.locals.imagePath });
});

app.post(prefix + '/subjects/uploads', uploadImg, (req, res) => {
  res.json({ imagePath: res.locals.imagePath });
});

// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;