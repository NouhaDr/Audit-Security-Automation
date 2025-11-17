const EquipementController = require('../controllers/equipement.controller')
const express = require('express');
const router = express.Router();



router.post('/search', EquipementController.searchEquipements)
router.get('/', EquipementController.findAll)
router.delete('/:id', EquipementController.deleteById)
router.post('/add', EquipementController.addEquipement);
module.exports = router