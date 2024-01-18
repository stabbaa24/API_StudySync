let Assignment = require('../model/assignment');


//https://stackoverflow.com/questions/48114129/populate-with-mongoose-pagination
//https://mongoosejs.com/docs/populate.html

function getAssignments(req, res) {
    var options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sort: { dateDeRendu: 1 }
    };

    let aggregateQuery = Assignment.aggregate([
        {
            $lookup: {
                from: "subjects",
                localField: "matiere", 
                foreignField: "_id", 
                as: "matiereDetails"
            }
        },
        {
            $unwind: {
                path: "$matiereDetails"
            }
        }/*,

        {
            $lookup: {
                from: "students",
                localField: "auteur", 
                foreignField: "_id", 
                as: "auteurDetails"
            }
        },
        {
            $unwind: {
                path: "$auteurDetails"
            }
        }*/
    ]);

    Assignment.aggregatePaginate(aggregateQuery, options)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}


function getAssignment(req, res) {
    let assignmentId = req.params.id;

    Assignment.findOne({ id: assignmentId })
        .populate('auteur', 'nom prenom')
        .populate('matiere', 'matiere image_matiere')
        .exec((err, assignment) => {
            if (err) {
                res.status(500).send(err);
            } else if (!assignment) {
                res.status(404).send({ message: "Devoir non trouvé" });
            } else {
                res.json(assignment);
            }
        });
}

// Ajout d'un assignment (POST)
function postAssignment(req, res) {
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;
    assignment.note = req.body.note;
    assignment.remarques = req.body.remarques;
    assignment.auteur = req.body.auteur;
    assignment.matiere = req.body.matiere;
    assignment.groupe = req.body.groupe;
    assignment.promo = req.body.promo;

    console.log(assignment)

    assignment.save((err) => {
        if (err) {
            res.send('Erreur ajout devoir', err);
        }
        res.json({ message: `${assignment.nom} OK` })
    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
            res.json({ message: 'devoir mis à jour' })
        }
    });
}

function deleteAssignment(req, res) {
    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (!assignment) {
            return res.status(404).send({ message: "Assignment non trouvé" });
        }
        res.json({ message: `${assignment.nom} supprimé` });
    });
}

module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };
