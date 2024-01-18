const mongoose = require('mongoose');
let Schema = mongoose.Schema;

//https://mongoosejs.com/docs/schematypes.html
let TeacherSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    nom: String,
    prenom: String,
    image: String
});

const Teacher = mongoose.model('Teacher', TeacherSchema);

module.exports = Teacher;