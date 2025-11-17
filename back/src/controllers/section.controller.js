const {Audit, Section} = require("../models"); 



// Ajouter une section avec des champs dynamiques
exports.addSection = async (req, res) => {
  try {
      const { nom, champs } = req.body;

      // Vérifier si la section existe déjà avec le même nom
      const existingSection = await Section.findOne({ nom });
      if (existingSection) {
          return res.status(400).json({ message: "Une section avec ce nom existe déjà" });
      }

      const newSection = new Section({ nom, champs });
      await newSection.save();

      res.status(201).json({ message: 'Section ajoutée avec succès', section: newSection });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


exports.getSectionsForAudit = async (req, res) => {
  try {
    const auditId = req.params.auditId;

    // Récupérer l'audit avec ses sections
    const audit = await Audit.findById(auditId).populate("sections");

    if (!audit) {
      return res.status(404).json({ message: "Audit non trouvé" });
    }

    res.status(200).json(audit.sections);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des sections d'un audit:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des sections", error });
  }
};

/*
exports.getAllSections = async (req, res) => {
  try {

    const sections = await Section.find();
    res.status(200).json(sections);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération :", error);
    res.status(500).json({ message: "Erreur lors de la récupération", error });
  }
};*/


exports.getSectionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "L'ID est requis" });

    const section = await Section.findById(id);
    if (!section) return res.status(404).json({ message: "Section non trouvée" });

    res.status(200).json(section);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération par ID :", error);
    res.status(500).json({ message: "Erreur", error });
  }
};


exports.updateSection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nom, champs } = req.body;

    if (!nom && !champs) {
      return res.status(400).json({ message: "Au moins un champ (nom ou champs) est requis" });
    }

    const section = await Section.findByIdAndUpdate(
      id,
      { nom, champs },
      { new: true, runValidators: true }
    );

    if (!section) {
      return res.status(404).json({ message: "Section non trouvée" });
    }

    res.status(200).json(section);
  } catch (error) {
    next(error); // ✅ Propagation correcte de l'erreur
  }
};


exports.deleteSection = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "L'ID est requis" });

    const section = await Section.findByIdAndDelete(id);
    if (!section) return res.status(404).json({ message: "Section non trouvée" });

    res.status(200).json({ message: "Section supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error });
  }
};


// Mettre à jour les champs d'une section
exports.updateFields = async (req, res) => {
  try {
    const { id } = req.params;
    const { champs } = req.body; // Les nouveaux champs à mettre à jour

    if (!champs) {
      return res.status(400).json({ message: "Les champs sont requis" });
    }

    // Trouver la section et mettre à jour ses champs
    const section = await Section.findByIdAndUpdate(
      id,
      { champs }, // Mise à jour des champs uniquement
      { new: true, runValidators: true }
    );

    if (!section) {
      return res.status(404).json({ message: "Section non trouvée" });
    }

    res.status(200).json(section); // Retourner la section mise à jour
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour des champs :", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour des champs", error });
  }
};

// section.controller.js
exports.getSectionsForAudit = async (req, res) => {
  try {
    const auditId = req.params.id;  // Capture l'ID de l'audit depuis l'URL

    if (!auditId) {
      return res.status(400).json({ message: "L'ID de l'audit est requis" });
    }

    // Rechercher l'audit par ID et remplir les sections
    const audit = await Audit.findById(auditId).populate('sections');

    if (!audit) {
      return res.status(404).json({ message: "Audit non trouvé" });
    }

    res.status(200).json(audit.sections);  // Retourner les sections associées à l'audit
  } catch (error) {
    console.error("Erreur lors de la récupération des sections:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des sections", error });
  }
};

