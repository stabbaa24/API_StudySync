const mongoose = require('mongoose');
let Schema = mongoose.Schema;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//https://mongoosejs.com/docs/schematypes.html
let SubjectSchema = new Schema({
    id: Number,
    matiere: String,
    image_matiere: String,
    professeur: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher'
    }
});

SubjectSchema.plugin(aggregatePaginate);

const Subject = mongoose.model('Subject', SubjectSchema);
module.exports = Subject;