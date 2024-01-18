let Subject = require('../model/subject');

//https://stackoverflow.com/questions/48114129/populate-with-mongoose-pagination
//https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/
//https://geekflare.com/lookup-in-mongodb/

function getSubjects(req, res) {
    var options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sort: { matiere: 1 }
    };

    let aggregateQuery = Subject.aggregate([
        {
            $lookup: {
                from: "teachers",
                localField: "professeur", 
                foreignField: "_id", 
                as: "professeurDetails"
            }
        },
        {
            $unwind: "$professeurDetails"
        }
    ]);

    Subject.aggregatePaginate(aggregateQuery, options)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.send(err);
        });
}

// Récupérer un assignment par son id (GET)
function getSubject(req, res) {
    let subjectId = req.params.id;

    Subject.findById(subjectId)
        .populate('matiere', 'matiere image_matiere')
        .populate('professeur', 'nom prenom image_professeur')
        .exec((err, subject) => {
            if (err) { res.send(err) }
            res.json(subject);
        });
}

// Ajout d'un matière (POST)
function addSubject(req, res) {
    let subject = new Subject({
        id: req.body.id,
        matiere: req.body.matiere,
        image_matiere: req.body.image_matiere,
        professeur: req.body.professeur
    });

    console.log("Adding subject: " + JSON.stringify(subject));

    subject.save((err, newSubject) => {
        if (err) {
            res.send('Erreur ajout matière', err);
        } 
        res.json({ message: `${subject.nom} OK` })
    });
}

module.exports = { getSubjects, addSubject, getSubject };