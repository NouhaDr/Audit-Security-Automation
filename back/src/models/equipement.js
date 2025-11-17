const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const EquipementSchema = new Schema({
  category: { type: String, required : true },
  subcategory: { type: String, required : true },
  ref: { type: String, required: true },
  details: { type: String },
  manufacturer: { type: String , required : true},
},
{
  timestamps: true
});

module.exports = mongoose.model("Equipement", EquipementSchema);


