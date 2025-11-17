const { Question, QuestionCategory } = require("../models");

//find all questions
module.exports.findAll = async function (req, res, next) {
  try {
    const questions = await Question.find({}).populate("category");
    return res.status(200).send({ data : questions, message : "Questions retrieved successfully" });
  } catch (error) {
    console.log(error)
    next(Error("Error while getting Questions"))
  }
}
module.exports.findCategories = async function (req, res, next) {
  try {
    const questions = await QuestionCategory.find();
    return res.status(200).send({ data : questions, message : "Questions categories retrieved successfully" });
  } catch (error) {
    next(Error("Error while getting Questions categories"))
  }
}

//create question
module.exports.create = async function (req, res, next) {
  try {
    const question = await Question.create({
      question : req.body.question,
      category : req.body.category,
      subcategory : req.body.subcategory,
    })
    
    return res.status(200).send({ data : question, message : "Question created successfully" });
  } catch (error) {
    next(Error("Error while creating question"))
  }
}

//delete question
module.exports.delete = async function (req, res, next) {
  try {
    await Question.deleteOne({ _id : req.params.id });
    return res.status(200).send({ message : "Question deleted successfully", data : { _id : req.params.id } });
  } catch (error) {
    next(Error("Error while deleteing question"))
  }
}

module.exports.update = async function (req, res, next) {
  try {
    const updated = await Question.findByIdAndUpdate(req.params.id, {
      question : req.body.question,
      category : req.body.category,
      subcategory : req.body.subcategory,
    }, { new : true });   
    
    return res.status(200).send({ data : updated, message : "Question updated successfully" });
  } catch (error) {
    next(Error("Error while creating question"))
  }
}


// ✅ Récupérer une question par son ID
module.exports.getQuestionById = async function (req, res, next) {
  try {
    const question = await Question.findById(req.params.id).populate("category");

    if (!question) {
      return res.status(404).send({ message: "Question not found" });
    }

    return res.status(200).send({ data: question, message: "Question retrieved successfully" });
  } catch (error) {
    console.error("❌ Error while getting question by ID:", error);
    next(Error("Error while getting question by ID"));
  }
};
