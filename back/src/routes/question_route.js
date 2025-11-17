const express = require('express');
const router = express.Router();
const {  QuestionController } = require('../controllers');

router.get("/findAll", QuestionController.findAll);
router.post("/create", QuestionController.create);
router.patch("/update/:id", QuestionController.update);
router.delete("/delete/:id", QuestionController.delete);
router.get("/:id", QuestionController.getQuestionById); 

module.exports = router;