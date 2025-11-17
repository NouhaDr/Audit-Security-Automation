const { Equipement } = require("../models")

module.exports.searchEquipements = async (req, res, next)=>{
    try {
        const { manufacturer, ref } = req.body;
        let filter = {};
        if(manufacturer){
            filter.manufacturer = { $regex : manufacturer, $options : 'i'};
        }
        if(ref){
            filter.ref = { $regex : ref, $options : 'i'};
        }
        const equippements = await Equipement.find(filter)
        return res.status(200).send({ message : "Equipements retrieved successfully", data : equippements })
    } catch (error) {
        next(error)
    }
}

module.exports.findAll = async (req, res, next)=>{
    try {
        const equipements = await Equipement.find()
        return res.status(200).send({ message : "Equipements retrieved successfully", data : equipements })
    } catch (error) {
        next(error)
    }
}

module.exports.deleteById = async (req, res, next)=>{
    try {
        await Equipement.deleteOne({ _id : req.params.id });
        return res.status(200).send({ message : "Equipements deleted successfully", data : { _id : req.params.id } })
    } catch (error) {
        next(error)
    }
}

module.exports.addEquipement = async (req, res, next) => {
    try {
        const { category, subcategory, ref, manufacturer, details } = req.body;

        if (!category || !subcategory || !ref || !manufacturer || !details) {
            return res.status(400).send({ message: "All fields are required" });
        }

        const newEquipement = new Equipement({
            category,
            subcategory,
            ref,
            manufacturer,
            details
        });

        await newEquipement.save();

        return res.status(201).send({ message: "Equipement added successfully", data: newEquipement });
    } catch (error) {
        next(error);
    }
};