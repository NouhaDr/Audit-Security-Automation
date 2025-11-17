const express = require("express");
const router = express.Router();
const sectionController = require("../controllers/section.controller");


router.get("/audit/:id", sectionController.getSectionsForAudit);
router.post('/', sectionController.addSection);
router.get("/:id", sectionController.getSectionById);
router.put("/:id", sectionController.updateSection);
router.delete("/:id", sectionController.deleteSection);
router.patch("/updateFields/:id", sectionController.updateFields);

module.exports = router;