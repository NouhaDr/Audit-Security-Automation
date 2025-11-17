const mongoose = require("mongoose");  
const Schema = mongoose.Schema; 

const sectionSchema = new Schema({
  nom: { type: String, required: true },
  champs: [
    {
      label: { type: String, required: true },
      value: { type: Schema.Types.Mixed },// string, number, objectId, etc.
      type: { type: String } 
    }
  ],
  status: { 
    type: String, 
    enum: ["confirmed", "not confirmed", "rejected","validated","fixed"], 
    default: "not confirmed" 
  },
  remark: { type: String } // ✅ Ajout du champ "remark"
  
}, { timestamps: true });

module.exports = mongoose.model("Section", sectionSchema);
