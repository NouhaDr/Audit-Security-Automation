const express = require('express');
const router = express.Router();
const {  QuestionCategoryController } = require('../controllers');

router.get("/findAll", QuestionCategoryController.findAll);
router.post("/create", QuestionCategoryController.create);
router.patch("/update/:id", QuestionCategoryController.update);
router.delete("/delete/:id", QuestionCategoryController.delete);

module.exports = router;