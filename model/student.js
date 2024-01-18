const mongoose = require('mongoose');
let Schema = mongoose.Schema;

//https://mongoosejs.com/docs/schematypes.html
let StudentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    nom: String,
    prenom: String,
    image: String,
    promo: String,
    groupe: String
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;