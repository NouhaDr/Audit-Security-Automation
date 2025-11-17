const { Question, QuestionCategory, QuestionSubCategory } = require("../models");

//find all questions
module.exports.findAll = async function (req, res, next) {
  try {
    const questions = await QuestionCategory.find();
    return res.status(200).send({ data : questions, message : "Categories retrieved successfully" });
  } catch (error) {
    next(Error("Error while getting Categories"))
  }
}

//create category
module.exports.create = async function (req, res, next) {
  try {
    const category = await QuestionCategory.create({
      label : req.body.label,
      subcategories : req.body.subcategories
    })
    
    return res.status(200).send({ data : category, message : "Category created successfully" });
  } catch (error) {
    next(Error("Error while creating category"))
  }
}

//delete category
module.exports.delete = async function (req, res, next) {
  try {
    await QuestionCategory.deleteOne({ _id : req.params.id });
    return res.status(200).send({ message : "Category deleted successfully", data : req.params.id });
  } catch (error) {
    next(Error("Error while deleteing category"))
  }
}

//update category
module.exports.update = async function (req, res, next) {
  try {
    const updated = await QuestionCategory.findByIdAndUpdate(req.params.id, {
      label : req.body.label,
      subcategories : req.body.subcategories
    }, { new : true });   
    
    return res.status(200).send({ data : updated, message : "Category updated successfully" });
  } catch (error) {
    next(Error("Error while creating category"))
  }
}