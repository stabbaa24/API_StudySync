let mongoose = require('mongoose');
let Schema = mongoose.Schema;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//https://mongoosejs.com/docs/schematypes.html
let AssignmentSchema = new Schema({
    id: Number,
    nom: String,
    dateDeRendu: Date,
    rendu: Boolean,
    note: Number,
    remarques: String,
    auteur: {
        type: Schema.Types.ObjectId,
        ref: 'Student'
    },
    matiere: {
        type: Schema.Types.ObjectId,
        ref: 'Subject'
    },
    groupe: String,
    promo: String
});

AssignmentSchema.plugin(aggregatePaginate);

const Assignment = mongoose.model('Assignment', AssignmentSchema);
module.exports = Assignment;