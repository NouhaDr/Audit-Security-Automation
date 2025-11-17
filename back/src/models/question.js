const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const QuestionSchema = new Schema({
    question: { type: String, required : true },
    category : { type: String, required : true},
    subcategory : { type : String, requires : true },
},
{
  timestamps: true
});

module.exports = mongoose.model("Question", QuestionSchema);


