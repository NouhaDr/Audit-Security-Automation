const express = require('express');
const router = express.Router();
const {  ScanController } = require('../controllers');

router.post('/lancer', ScanController.lancerScan);
router.get('/scan-configs', ScanController.getScanConfigs);
router.get('/audit/:auditId', ScanController.getByAudit);
router.get('/:scanId/vulnerabilities', ScanController.getVulnerabilitiesByScan);

module.exports = router;