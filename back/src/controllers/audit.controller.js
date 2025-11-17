const { Audit, User, Equipement, File, Question, QuestionCategory,Section} = require("../models");
const AuditStatus = require("../models/audit_status");

//find all audits
module.exports.findAll = async function (req, res, next) {
  try {
    const audits = await Audit.find({ isDeleted : false })
    .populate({
      path: "auditors",
      select: "-password -salt -isEnabled -isDeleted"
    })
    .populate("auditleaders", "-password -salt -isEnabled -isDeleted")
    .populate({
      path: "client",
      select: "-password -salt -isEnabled -isDeleted"
    })
    .populate({
      path: "questionnaire",
      populate: "question"
    })
    .populate('equipements')
    .populate('files')
    
    return res.status(200).send({ data : audits, message : "Audits retrieved successfully" });
  } catch (error) {
    next(Error("Error while getting audits"))
  }
}

//find by id
/*
module.exports.findById = async function (req, res, next) {
  try {
    const audit = await Audit.findOne({ _id : req.params.id, isDeleted : false })
    .populate({
        path: "auditors",
        select: "-password -salt -isEnabled -isDeleted"
      })
      .populate("auditleaders", "-password -salt -isEnabled -isDeleted")
      .populate({
        path: "client",
        select: "-password -salt -isEnabled -isDeleted"
      })
      .populate({
        path: "questionnaire",
        populate: "question"
      })
      .populate('equipements')
      .populate('files')
      
    return res.status(200).send({ data : audit, message : "Audit retrieved successfully" });
  } catch (error) {
    next(Error("Error while getting audit by id"))
  }
}*/
module.exports.findById = async function (req, res, next) {
  try {
    const audit = await Audit.findOne({ _id: req.params.id, isDeleted: false })
      .populate({
        path: "auditors",
        select: "-password -salt -isEnabled -isDeleted"
      })
      .populate("auditleaders", "-password -salt -isEnabled -isDeleted")
      .populate({
        path: "client",
        select: "-password -salt -isEnabled -isDeleted"
      })
      .populate({
        path: "questionnaire",
        populate: "question"
      })
      .populate('equipements')
      .populate('files')
      .populate('sections'); // Ajout de la population des sections
    
    return res.status(200).send({ data: audit, message: "Audit retrieved successfully" });
  } catch (error) {
    next(Error("Error while getting audit by id"));
  }
};


//find by id and contact only
module.exports.findAuditContactInfosByID = async function (req, res, next) {
  try {
    const audit = await Audit.findOne({ _id : req.params.id, isDeleted : false })
    .populate({
      path: "auditors",
      select: "-password -salt -isEnabled -isDeleted"
    })
    .populate("auditleaders", "-password -salt -isEnabled -isDeleted")
    .populate({
      path: "client",
      select: "-password -salt -isEnabled -isDeleted"
    })
    .select('-equipements -questionnaire -isDeleted')
    return res.status(200).send({ data : audit, message : "Audit contact retrieved successfully" });
  } catch (error) {
    next(Error("Error while getting audit contact"))
  }
}

//find by id and equipements only
module.exports.findAuditEquipementsByID = async function (req, res, next) {
  try {
    const audit = await Audit.findOne({ _id : req.params.id, isDeleted : false })
    .populate('equipements')
    return res.status(200).send({ data : audit.equipements, message : "Audit contact retrieved successfully" });
  } catch (error) {
    next(Error("Error while getting audit by id"))
  }
}

//upload audit file
module.exports.uploadFile = async function (req, res, next) {
  try {
    if(req.file && req.file.filename){
      file = req.file.filename;
    }else{
      throw Error("Files cannot be empty")
    }    
    const audit = await Audit.findOne({ _id : req.params.id, isDeleted : false });
    const savedFile = await File.create({ title : file });
    audit.files.push(savedFile);
    await audit.save();
    return res.status(200).send({ data : savedFile, message : "Audit file uploaded successfully" });
  } catch (error) {
    next(Error("Error while uploading audit file"))
  }
}


module.exports.deleteFile = async function (req, res, next) {
  try {  
    const audit = await Audit.findOne({ _id : req.params.id, isDeleted : false });
    audit.files = audit.files.filter(f => f._id != req.params.fileId);
    await audit.save();    
    return res.status(200).send({ data : req.params.fileId, message : "Audit file deleted successfully" });
  } catch (error) {
    next(Error("Error while deleting audit file"))
  }
}


//find by id and questionnaire only
module.exports.findAuditQuestionnaireByID = async function (req, res, next) {
  try {
    const audit = await Audit.findOne({ _id : req.params.id, isDeleted : false })
    .populate({
      path : 'questionnaire',
      populate : 'question'
    })
    return res.status(200).send({ data : audit.questionnaire, message : "Audit questionnaire retrieved successfully" });
  } catch (error) {
    next(Error("Error while getting audit questionnaire"))
  }
}

module.exports.findByAuditor = async function (req, res, next) {
  try {
    const audits = await Audit.find({ auditors: { $in: req.params.id }, isDeleted: false })
      .populate({
        path: "auditors",
        select: "-password -salt -isEnabled -isDeleted"
      })
      .populate({
        path: "auditleaders",
        select: "-password -salt -isEnabled -isDeleted"  // ✅ Inclure les auditleaders
      })
      .populate({
        path: "client",
        select: "-password -salt -isEnabled -isDeleted"
      })
      .populate({
        path: "questionnaire",
        populate: "question"
      })
      .populate("equipements")
      .populate("files");

    return res.status(200).send({ data: audits, message: "Audits retrieved successfully" });
  } catch (error) {
    next(Error("Error while getting audits by auditor"));
  }
};


module.exports.findByClient = async function (req, res, next) {
  try {
    const audits = await Audit.find({ client: { $in: req.params.id }, isDeleted: false })
      .populate({
        path: "auditors",
        select: "-password -salt -isEnabled -isDeleted"
      })
      .populate({
        path: "auditleaders",
        select: "-password -salt -isEnabled -isDeleted"  // ✅ Inclure les auditleaders
      })
      .populate({
        path: "client",
        select: "-password -salt -isEnabled -isDeleted"
      })
      .populate({
        path: "questionnaire",
        populate: "question"
      })
      .populate("equipements")
      .populate("files");

    return res.status(200).send({ data: audits, message: "Audits retrieved successfully" });
  } catch (error) {
    next(Error("Error while getting audits by auditor"));
  }
};

//create audit
/*
module.exports.createAudit = async function (req, res, next) {
  try {
    const auditors = [];
    let auditleader = null;
    let files = [];

    if(req.files){
      req.files.forEach(file => files.push(file));
    }

    // Récupérer les auditeurs
    for (const a of req.body.auditors) {
      const user = await User.findById(a).select("-password -salt");
      auditors.push(user);
    }

    if (req.body.auditleaders) {
      auditleader = await User.findById(req.body.auditleaders).select("-password -salt");
    }

    const selectedClient = await User.findById(req.body.client);

    const audit = await Audit.create({
      auditors,
     auditleaders: auditleader,  // ✅ Un seul audit leaders
      client: selectedClient,
      contactEmail: req.body.contactEmail,
      contactName: req.body.contactName,
      contactNumber: req.body.contactNumber,
      employeesInPerimeter: req.body.employeesInPerimeter,
      employeesNumber: req.body.employeesNumber,
      files,
      phoneNumber: req.body.phoneNumber,
      website: req.body.website,
      organisationName: req.body.organisationName,
      equipements: []
    });

    return res.status(200).send({ data: audit, message: "Audit created successfully" });
  } catch (error) {
    next(Error("Error while creating audit"));
  }
};*/


// 🔧 Fonction utilitaire pour générer les champs "Contact" dynamiques
function buildContactFieldsFromAudit(data) {
  const mapping = {
    "Client": data.client,
    "Auditors": data.auditors || [],
    "Audit Leaders": data.auditleaders || null,
    "Organisation Name": data.organisationName,
    "Contract Number": "", // facultatif ou manuel
    "Phone Number": data.phoneNumber,
    "Website": data.website,
    "Number of Employees": data.employeesNumber,
    "Employees in Perimeter": data.employeesInPerimeter,
    "Contact Person Name": data.contactName,
    "Contact Email": data.contactEmail
  };

  return Object.entries(mapping).map(([label, value]) => ({ label, value }));
}

// 🎯 Contrôleur principal
module.exports.createAudit = async (req, res) => {
  try {
    const {
      auditors,
      auditleaders,
      client,
      organisationName,
      contactNumber,
      phoneNumber,
      website,
      employeesNumber,
      employeesInPerimeter,
      contactName,
      contactEmail
    } = req.body;

    // ✅ Vérification des données requises
    if (!client || !organisationName || !contactNumber || !phoneNumber || !employeesNumber) {
      return res.status(400).json({ message: "Please provide all the required information." });
    }

    // ✅ Générer les champs dynamiques de la section Contact
    const contactFields = buildContactFieldsFromAudit(req.body);

    // ✅ Préparation des sections initiales
    const sectionsData = [
      {
        nom: "Contact",
        champs: [
          { label: "Client", value: client, type: "text" },
          { label: "Auditors", value: auditors || [], type: "text" },
          { label: "Audit Leaders", value: auditleaders || null, type: "text" },
          { label: "Organisation Name", value: organisationName, type: "text" },
          { label: "Contract Number", value: "", type: "text" },
          { label: "Phone Number", value: phoneNumber, type: "text" },
          { label: "Website", value: website, type: "text" },
          { label: "Number of Employees", value: employeesNumber, type: "number" },
          { label: "Employees in Perimeter", value: employeesInPerimeter, type: "number" },
          { label: "Contact Person Name", value: contactName, type: "text" },
          { label: "Contact Email", value: contactEmail, type: "text" }
        ],
        status: "fixed",
        remark: ""
      },
      {
        nom: "Methodology",
        champs: [
          { label: "Standards Used", value: "", type: "text" },
          { label: "Type of Audit", value: "", type: "text" },
          { label: "Audit Techniques Used", value: "", type: "textarea" }, // tu peux gérer en tag input
          { label: "Tools Used", value: "", type: "textarea" },            // idem
          { label: "Data Sources Analyzed", value: "", type: "textarea" },
          { label: "Audit Start Date", value: "", type: "date" },
          { label: "Audit End Date", value: "", type: "date" },
          { label: "Audited Sites", value: "", type: "textarea" },
          { label: "Scope Justification", value: "", type: "textarea" },
          { label: "Audit Team Composition", value: "", type: "textarea" },
          { label: "Limitations Encountered", value: "", type: "textarea" },
          { label: "Confidentiality Measures Implemented", value: "", type: "textarea" },
          { label: "Report Reference Code", value: "", type: "text" }
        ],
        status: "not confirmed",
        remark: ""
      },
      {
        nom: "Audit Objectives",
        champs: [
          { label: "Purpose of the Audit", value: "", type: "textarea" },
          { label: "Audit Scope", value: "", type: "textarea" }
        ],
        status: "not confirmed",
        remark: ""
      },
      {
        nom: "Standards & References",
        champs: [
          { label: "Norms and Standards", value: "", type: "textarea" },
          { label: "Documents Reviewed", value: "", type: "textarea" }
        ],
        status: "not confirmed",
        remark: ""
      },
      {
        nom: "Audit Limitations",
        champs: [
          { label: "Access Restrictions", value: "", type: "textarea" },
          { label: "Unavailable Resources", value: "", type: "textarea" },
          { label: "Other Constraints", value: "", type: "textarea" }
        ],
        status: "not confirmed",
        remark: ""
      },
      
      {
        nom: "Infrastructure",
        champs: [
          { label: "Equipments", value: [] }
        ],
        status: "not confirmed",
        remark: ""
      },
      {
        nom: "Questionnaire",
        champs: [],
        status: "not confirmed",
        remark: ""
      },
      {
        nom: "Corrective Actions",
        champs: [
          { label: "Immediate Actions", value: "", type: "textarea" },
          { label: "Planned Corrective Actions", value: "", type: "textarea" },
          { label: "Person Responsible", value: "", type: "text" }
        ],
        status: "not confirmed",
        remark: ""
      },
      {
        nom: "Audit Conclusions",
        champs: [
          { label: "Summary of Findings", value: "", type: "textarea" },
          { label: "Overall Security Level", value: "", type: "text" }
        ],
        status: "not confirmed",
        remark: ""
      },    
      {
        nom: "Auditee Feedback",
        champs: [
          { label: "Comments on Findings", value: "", type: "textarea" },
          { label: "Agreed Action Plan", value: "", type: "textarea" }
        ],
        status: "not confirmed",
        remark: ""
      },
      {
        nom: "Approval",
        champs: [
          { label: "Approved By", value: "", type: "text" },
          { label: "Approval Date", value: "", type: "date" }
        ],
        status: "not confirmed",
        remark: ""
      },
      {
        nom: "Signatures",
        champs: [
          { label: "Auditor Name", value: "", type: "text" },
          { label: "Auditor Signature", value: "", type: "text" },
          { label: "Auditee Name", value: "", type: "text" },
          { label: "Auditee Signature", value: "", type: "text" }
        ],
        status: "not confirmed",
        remark: ""
      },
      {
        nom: "Files",
        champs: [],
        status: "not confirmed",
        remark: ""
      }
    ];

    // ✅ Création des sections et récupération des IDs
    const createdSections = await Promise.all(
      sectionsData.map(async (section) => {
        const newSection = new Section(section);
        return await newSection.save();
      })
    );

    const sectionIds = createdSections.map(section => section._id);

    // ✅ Création de l'audit avec les ObjectId des sections
    const audit = new Audit({
      auditors,
      auditleaders,
      client,
      organisationName,
      contactNumber,
      phoneNumber,
      website,
      employeesNumber,
      employeesInPerimeter,
      contactName,
      contactEmail,
      sections: sectionIds
    });

    await audit.save();

    return res.status(201).json({ message: "Audit successfully created", audit });
  } catch (error) {
    console.error("❌ Error during audit creation:", error);
    return res.status(500).json({ message: "Internal error while creating the audit", error: error.message });
  }
};


module.exports.addEquipement = async (req, res, next)=>{
  try {
      const auditID = req.params.id;
      //check if an equiepent for this details exists already, suppose we have an id
      let equipement;
      const exist_equipement = await Equipement.findOne({ ref : req.body.ref, manufacturer : req.body.manufacturer });
      if(exist_equipement){
        equipement = exist_equipement;
      }else{
        equipement = await Equipement.create({
          category : req.body.category,
          details : req.body.details,
          ref : req.body.ref,
          manufacturer : req.body.manufacturer,
          subcategory : req.body.subcategory
        });
      }
      const audit = await Audit.findById(auditID).populate("equipements");
      audit.equipements.push(equipement);
      audit.status = audit.equipements.length != 0 ? 'IN PROGRESS' : 'PENDING';
      await audit.save();
      return res.status(200).send({ message : "Equipenemt added successfully", data : equipement })
  } catch (error) {
    next(error)
  }
}

module.exports.findAuditEquipements = async (req, res, next) => {
  try {
      const auditID = req.params.id;
      const audit = await Audit.findById(auditID).populate("equipements");

      // 🔥 Éviter les doublons en ne gardant que les IDs uniques
      const equipementMap = new Map();
      audit.equipements.forEach(equip => equipementMap.set(equip._id.toString(), equip));

      return res.status(200).send({
          message: "Equipements retrieved successfully",
          data: Array.from(equipementMap.values())
      });
  } catch (error) {
    next(error);
  }
};




module.exports.assignAudit = async (req, res, next) => {
  try {
    const audit = await Audit.findById(req.params.id);
    let auditors = [];
    let auditleader = null;

    for (let i = 0; i < req.body.auditors.length; i++) {
      const auditor = await User.findById(req.body.auditors[i]);
      auditors.push(auditor);
    }

    if (req.body.auditleaders) {
      auditleader = await User.findById(req.body.auditleaders);
    }

    audit.auditors = auditors;
    audit.auditleaders = auditleader; // ✅ un seul Audit Leader
    const updated = await audit.save();

    return res.status(200).send({ message: 'Auditors and audit leaders assigned successfully', data: updated });
  } catch (error) {
    next(error);
  }
};

//delete audits 
module.exports.deleteAudit = async function (req, res, next) {
  try {
    const audit = await Audit.findById(req.params.id);
    audit.isDeleted = !audit.isDeleted;
    const deleted = await audit.save()
    return res.status(200).send({ message : "Audit deleted successfully", data : deleted });
  } catch (error) {
    next(Error("Error while deleteing audit"))
  }
}

//delete equipement from audits 
module.exports.removeEquipementFromAudit = async function (req, res, next) {
  try {
    const auditID = req.params.auditID;
    const equipementID = req.params.eqID;
    const audit = await Audit.findById(auditID).populate("equipements");
    audit.equipements = audit.equipements.filter(e => e._id != equipementID);
    await audit.save();    
    return res.status(200).send({ message : "Audit equipement removed successfully", data : { _id : equipementID } });
  } catch (error) {
    next(error)
  }
}


//update equipement from audits 
module.exports.updateEquipementFromAudit = async function (req, res, next) {
  try {
    const { auditId, eqID } = req.params;  // ✅ Récupération correcte des IDs

    // 🔍 Vérifier si l'audit existe
    const audit = await Audit.findById(auditId);
    if (!audit) {
      return res.status(404).json({ message: "Audit not found." });
    }

    // 🔍 Vérifier si l'équipement appartient bien à cet audit
    const equipement = await Equipement.findOne({ _id: eqID, audit: auditId });
    if (!equipement) {
      return res.status(404).json({ message: "Equipment not found in this audit." });
    }

    // ✅ Mise à jour de l'équipement avec `findOneAndUpdate`
    const updatedEquipement = await Equipement.findByIdAndUpdate(
      eqID,
      {
        category: req.body.category,
        subcategory: req.body.subcategory,
        ref: req.body.ref,
        details: req.body.details,
        manufacturer: req.body.manufacturer
      },
      { new: true } // 🔄 Retourne l'objet mis à jour
    );

    return res.status(200).json({
      message: "Equipment updated successfully.",
      data: updatedEquipement
    });

  } catch (error) {
    next(error); // 🔥 Gestion centralisée des erreurs
  }
};


//submit questionnaire
module.exports.submitQuestionnaire = async function (req, res, next) {
  try {
    let { questionnaire } = req.body;
    const audit = await Audit.findById(req.params.id);

    audit.questionnaire = [];

    for (let i = 0; i < questionnaire.length; i++) {
      const element = questionnaire[i];
      audit.questionnaire.push({ question : element.question, response : element.response ?? false })
    }
    if(audit.questionnaire.length != 0){
      audit.progress = 25;
    }
    audit.status = AuditStatus.inProgress;

    const updated = await audit.save();
    const updated_audit = await Audit.findById(updated._id)
    .populate({
      path:'questionnaire',
      populate : 'question'
    });

    return res.status(200).send({ message : "Audit questionnaire updated successfully", data : updated_audit.questionnaire });
  } catch (error) {
    next(error)
  }
}

//update audit
/*
module.exports.updateAudit = async function (req, res, next) {
  try {
    let auditors = [];
    let auditleader = null;
    let files = [];

    if (req.files) {
      req.files.forEach(file => files.push(file));
    }

    for (const a of req.body.auditors) {
      const user = await User.findById(a).select("-password -salt");
      auditors.push(user);
    }

    if (req.body.auditleaders) {
      auditleader = await User.findById(req.body.auditleaders).select("-password -salt");
    }

    const audit = await Audit.findByIdAndUpdate(req.params.id, {
      auditors,
      auditleaders: auditleader, // ✅ Un seul audit leader
      contactEmail: req.body.contactEmail,
      contactName: req.body.contactName,
      contactNumber: req.body.contactNumber,
      employeesInPerimeter: req.body.employeesInPerimeter,
      employeesNumber: req.body.employeesNumber,
      files,
      phoneNumber: req.body.phoneNumber,
      website: req.body.website,
      organisationName: req.body.organisationName,
      progress: req.body.progress
    }, { new: true }).populate("auditleaders"); // ✅ Renvoie les auditleaders mis à jour

    return res.status(200).send({ data: audit, message: "Audit updated successfully" });
  } catch (error) {
    next(Error("Error while updating audit"));
  }
};*/
module.exports.updateAudit = async function (req, res, next) {
  try {
    let auditors = [];
    let auditleader = null;
    let files = [];

    if (req.files) {
      req.files.forEach(file => files.push(file));
    }

    if (req.body.auditors && Array.isArray(req.body.auditors)) {
      for (const a of req.body.auditors) {
        const user = await User.findById(a).select("-password -salt");
        auditors.push(user);
      }
    }

    if (req.body.auditleaders) {
      auditleader = await User.findById(req.body.auditleaders).select("-password -salt");
    }

    const audit = await Audit.findByIdAndUpdate(
      req.params.id,
      {
        auditors,
        auditleaders: auditleader,
        contactEmail: req.body.contactEmail,
        contactName: req.body.contactName,
        contactNumber: req.body.contactNumber,
        employeesInPerimeter: req.body.employeesInPerimeter,
        employeesNumber: req.body.employeesNumber,
        files,
        phoneNumber: req.body.phoneNumber,
        website: req.body.website,
        organisationName: req.body.organisationName,
        progress: req.body.progress,
        sections: req.body.sections || [],
        feedback: req.body.feedback
      },
      { new: true }
    ).populate("auditleaders");

    return res.status(200).send({ data: audit, message: "Audit updated successfully" });
  } catch (error) {
    console.error("Erreur serveur updateAudit:", error); // <-- 🔥 très important
    next(error); // <-- on passe l'erreur telle quelle
  }
};





module.exports.updateAuditProgress = async function (req, res, next) {
  try {
    const audit = await Audit.findOne({ _id: req.params.id, isDeleted: false }).populate('sections');
    
    if (!audit) {
      throw new Error("Audit not found/deleted");
    }

    // Calculer le pourcentage de progression basé sur les sections confirmées
    const totalSections = audit.sections.length;
    const confirmedSections = audit.sections.filter(sec => sec.status === 'CONFIRMED').length;
    audit.progress = totalSections > 0 ? Math.round((confirmedSections / totalSections) * 100) : 0;

    // Mise à jour du statut de l'audit
    if (audit.progress === 100) {
      audit.status = 'FINISHED';
      audit.closedAt = Date.now();
    } else {
      audit.status = audit.equipements.length === 0 ? 'PENDING' : 'IN PROGRESS';
      audit.closedAt = null;
    }

    await audit.save();

    return res.status(200).send({ message: 'Progress updated successfully', data: audit });
  } catch (error) {
    next(error);
  }
};

/*module.exports.updateAuditProgress = async function (req, res, next){
   try { 
     const audit = await Audit.findOne({_id : req.params.id, isDeleted : false });
     if(!audit){
       throw Error("Audit not found/deleted")
     } 
     audit.progress = req.body.progress;
     if(audit.progress == 100){
       audit.status = 'FINISHED';
       audit.closedAt = Date.now()
     }else{
       audit.status = audit.equipements.length == 0 ? 'PENDING' : 'IN PROGRESS';
       audit.closedAt = null;
     }
     await audit.save();
     return res.status(200).send({ message : 'Progress updated successfully', data : audit })
   } catch (error) {
     next(error)
   }
 }*/


module.exports.dashboardNumbers = async (req, res, next)=>{
  try {
    const clients = await User.find({ role : 'CLIENT' , isDeleted : false});
    const admins = await User.find({ role : 'ADMIN' , isDeleted : false});
    const auditors = await User.find({ role : 'AUDITOR' , isDeleted : false});
    const pending_audits = await Audit.find({ status : 'PENDING' , isDeleted : false});
    const finished_audits = await Audit.find({ status : 'FINISHED' , isDeleted : false});
    const in_progress_audits = await Audit.find({ status : 'IN PROGRESS' , isDeleted : false});
    const all_audits = await Audit.find({ isDeleted : false});
    const questions = await Question.find();
    const equipements = await Equipement.find();
    const questionCategory = await QuestionCategory.find();
    const data = { 
      users : { 
        admins : admins.length , 
        auditors : auditors.length, 
        clients : clients.length 
      },
      audits : { 
        pending : pending_audits.length, 
        finished : finished_audits.length,
        inProgress : in_progress_audits.length,
        all : all_audits.length
      },
      questions : questions.length,
      equipements : equipements.length,
      questionCategory : questionCategory.length
     };
     return res.status(200).send({ message : "Dashboard items retrieved successfully", data })
  } catch (error) {
    next(error)
  }
};


module.exports.findByAuditLeader = async function (req, res, next) {
  try {
    const audits = await Audit.find({ auditleaders: { $in: req.params.id }, isDeleted: false })
      .populate("auditors", "-password -salt -isEnabled -isDeleted")
      .populate("auditleaders", "-password -salt -isEnabled -isDeleted")
      .populate("client", "-password -salt -isEnabled -isDeleted")
      .populate({
        path: "questionnaire",
        populate: "question"
      })
      .populate("equipements")
      .populate("files");

    return res.status(200).send({ data: audits, message: "Audits retrieved successfully" });
  } catch (error) {
    next(Error("Error while getting audits by audit leader"));
  }
};




module.exports.addSectionToAudit = async (req, res, next) => {
  try {
    const audit = await Audit.findById(req.params.id).populate("sections");
    if (!audit) {
      return res.status(404).send({ message: "Audit not found" });
    }

    // Créer une nouvelle section avec les données envoyées dans le corps de la requête
    const newSection = new Section({
      nom: req.body.nom,
      champs: req.body.champs
    });

    // Sauvegarder la section dans la base de données
    const savedSection = await newSection.save();

    // Ajouter la section à l'audit
    audit.sections.push(savedSection._id);
    await audit.save();

    // Récupérer l'audit mis à jour avec toutes les sections
    const updatedAudit = await Audit.findById(req.params.id).populate("sections");

    return res.status(200).send({
      message: "Section added successfully",
      data: {
        auditId: updatedAudit._id,
        addedSection: savedSection,  // Renvoie la section complète créée
        allSections: updatedAudit.sections // Renvoie toutes les sections de l'audit
      }
    });
  } catch (error) {
    next(error);
  }
};
// Supprimer une section d'un audit
module.exports.deleteSectionFromAudit = async (req, res, next) => {
  try {
    const audit = await Audit.findById(req.params.id).populate("sections");
    if (!audit) {
      return res.status(404).send({ message: "Audit not found" });
    }

    const sectionId = req.params.sectionId;
    audit.sections = audit.sections.filter(s => !s.equals(sectionId));
    await audit.save();

    // Supprimer la section de la base de données si elle n'est plus utilisée
    await Section.findByIdAndDelete(sectionId);

    return res.status(200).send({ message: "Section removed from audit", data: audit });
  } catch (error) {
    next(error);
  }
};

// Mettre à jour une section d'un audit
module.exports.updateSectionFromAudit = async (req, res, next) => {
  try {
    const section = await Section.findById(req.params.sectionId);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    // ✅ Mise à jour des attributs de la section
    if (req.body.nom) section.nom = req.body.nom;
    if (req.body.champs) section.champs = req.body.champs;
    if (req.body.remark !== undefined) section.remark = req.body.remark; // ✅ Vérifie si "remark" est bien envoyé

    await section.save();

    return res.status(200).json({ 
      message: "Section updated successfully", 
      data: section 
    });

  } catch (error) {
    next(error);
  }
};


module.exports.confirmSection = async function (req, res, next) {
  try {
    const { auditId, sectionId } = req.params;
    const sectionData = req.body; 

    // Vérifier si l'audit existe
    const audit = await Audit.findById(auditId).populate("sections");
    if (!audit) {
      console.log("❌ Audit non trouvé");
      return res.status(404).send({ message: "Audit not found" });
    }

    // Vérifier si la section appartient à l'audit
    const section = await Section.findById(sectionId);
    if (!section) {
      console.log("❌ Section non trouvée");
      return res.status(404).send({ message: "Section not found" });
    }

    // Mise à jour de la section avec les nouvelles données
    Object.assign(section, sectionData);
    
    // ✅ Sauvegarder la section AVANT le recalcul de l'audit
    await section.save();

    // ✅ Recalculer la progression de l'audit après mise à jour de la section
    await Audit.recalculateProgress(auditId);

    return res.status(200).send({ message: "Section updated successfully", data: section });
  } catch (error) {
    console.error("❌ Erreur dans confirmSection :", error);
    next(error);
  }
};


module.exports.saveSectionData = async function (req, res, next) {
  try {
    const { auditId, sectionId } = req.params;
    const { champs, remark } = req.body; // Récupérer les champs et remark du corps de la requête

    // Vérifier si l'audit existe
    const audit = await Audit.findById(auditId).populate("sections");
    if (!audit) {
      return res.status(404).send({ message: "Audit not found" });
    }

    // Vérifier si la section appartient à l'audit
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).send({ message: "Section not found" });
    }

    // Mettre à jour les champs et remark sans modifier le status
    section.champs = champs || section.champs; // Mettre à jour champs si fourni
    section.remark = remark !== undefined ? remark : section.remark; // Mettre à jour remark si fourni

    await section.save();

    return res.status(200).send({ message: "Section updated successfully", data: section });
  } catch (error) {
    next(error);
  }
};

module.exports.validateSection = async function (req, res, next) {
  try {
    const { auditId, sectionId } = req.params;

    // Vérifier si l'audit existe
    const audit = await Audit.findById(auditId).populate("sections");
    if (!audit) {
      return res.status(404).send({ message: "Audit not found" });
    }

    // Vérifier si la section appartient à l'audit
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).send({ message: "Section not found" });
    }

    // Mettre à jour l'état de la section en "validated"
    section.status = "validated";
    await section.save();

     // ✅ Recalculer la progression de l'audit après mise à jour de la section
     await Audit.recalculateProgress(auditId);
    
    return res.status(200).send({ message: "Section validated successfully", data: section });
  } catch (error) {
    next(error);
  }
};

module.exports.rejectSection = async function (req, res, next) {
  try {
    const { auditId, sectionId } = req.params;

    // Vérifier si l'audit existe
    const audit = await Audit.findById(auditId).populate("sections");
    if (!audit) {
      return res.status(404).send({ message: "Audit not found" });
    }

    // Vérifier si la section appartient à l'audit
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).send({ message: "Section not found" });
    }

    // Mettre à jour l'état de la section en "rejected"
    section.status = "rejected";
    await section.save();

     // ✅ Recalculer la progression de l'audit après mise à jour de la section
     await Audit.recalculateProgress(auditId);
    

    return res.status(200).send({ message: "Section rejected successfully", data: section });
  } catch (error) {
    next(error);
  }
};
