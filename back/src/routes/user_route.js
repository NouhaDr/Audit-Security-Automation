const express = require('express');
const router = express.Router();
const { UserController } = require('../controllers');
const { uploader } = require('../utils');

router.get('/findAll', UserController.findAll);
//router.get('/findEnabled', UserController.findEnabled);
router.get('/findDeleted', UserController.findDeleted);
router.get('/findAllAuditors', UserController.findAllAuditors);
router.get('/findAllAuditleaders', UserController.findAllAuditleaders);
router.get('/findAllClients', UserController.findAllClients);
router.get('/findById/:id', UserController.findById);
//router.patch('/enable/:id', UserController.enableUser);
router.get('/findByEmail', UserController.findByEmail);
router.patch('/updateDetails/:id', UserController.UpdateUserDetails);
router.patch('/changePassword/:id', UserController.changePassword);
router.patch('/:id/image', uploader.uploadUserImage.single("image"), UserController.UpdateUserImage);
router.post('/createUser', uploader.uploadUserImage.single("image"), UserController.createUser);
router.delete('/delete/:id', UserController.deleteUser);


module.exports = router;