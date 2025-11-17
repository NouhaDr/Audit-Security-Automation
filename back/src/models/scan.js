const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScanSchema = new Schema({
  auditId: { type: Schema.Types.ObjectId, ref: "Audit", required: true },
  ip: { type: String, required: true },
  typeScan: { type: String, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date },
  cheminFichier: { type: String },
  status: {
    type: String,
    enum: ['requested', 'queued', 'running', 'in_progress', 'done', 'failed'],
    default: 'requested'
  },
  vulnerabilites: [{ type: Schema.Types.ObjectId, ref: "Vulnerability" }]
}, {
  timestamps: true
});

module.exports = mongoose.model("Scan", ScanSchema);
