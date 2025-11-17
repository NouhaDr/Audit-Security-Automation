const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const QuestionCategorySchema = new Schema({
    label: { type: String, required : true },
    subcategories : [{ type : String }],
},
{
  timestamps: true
});

module.exports = mongoose.model("QuestionCategory", QuestionCategorySchema);


