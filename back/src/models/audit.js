const mongoose = require("mongoose");
const AuditStatus = require("./audit_status");

const Schema = mongoose.Schema;

const AuditSchema = new Schema(
    {
        auditors: [{ type: mongoose.Types.ObjectId, ref: "User" }],
        auditleaders: { type: mongoose.Types.ObjectId, ref: "User" }, // ✅ Ajout du champ auditleaders
        organisationName: { type: String, required: true },
        contactNumber: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        website: { type: String, required: true },
        employeesNumber: { type: Number, required: true },
        employeesInPerimeter: { type: Number, required: true },
        contactName: { type: String, required: true },
        contactEmail: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
        status: { type: String, default: AuditStatus.pending },
        files: [{ type: mongoose.Types.ObjectId, ref: "File" }],
        progress: { type: Number, default: 0 },
        client: { type: mongoose.Types.ObjectId, ref: "User", required: true },
        equipements: [{ type: mongoose.Types.ObjectId, ref: "Equipement" }],
        sections: [{ type: mongoose.Types.ObjectId, ref: "Section" }],
        questionnaire: [
            {
                question: { type: mongoose.Types.ObjectId, ref: "Question" },
                response: { type: String, required: true },
            },
        ],
        feedback: { type: String },
        closedAt: { type: Date },
    },
    {
        timestamps: true,
    }
);



/**
 * ✅ Méthode statique : Recalculer la progression d'un audit
 * ➜ Cette méthode est appelée quand une section change de statut
 */
AuditSchema.statics.recalculateProgress = async function (auditId) {
  const audit = await this.findById(auditId).populate({ path: "sections", model: "Section" });
  if (!audit) {
      return;
  }

  const totalSections = audit.sections.length -1;

  if (totalSections === 0) {
      audit.progress = 0;
  } else {
      let weightedProgress = 0;
      
      audit.sections.forEach((section, index) => {
          if (section.status === "confirmed") {
              weightedProgress += 0.5; // ✅ Confirmé compte pour 50%
          } else if (section.status === "validated") {
              weightedProgress += 1; // ✅ Validé compte pour 100%
          }
      });

      audit.progress = Math.round((weightedProgress / totalSections) * 100);
  }

  if (audit.progress === 100) {
      audit.status = "FINISHED";
      audit.closedAt = Date.now();
  } else {
      audit.status = totalSections === 0 ? "PENDING" : "IN PROGRESS";
      audit.closedAt = null;
  }
  await this.findByIdAndUpdate(
      auditId,
      { $set: { progress: audit.progress, status: audit.status, closedAt: audit.closedAt } },
      { new: true }
  );

};


module.exports = mongoose.model("Audit", AuditSchema);