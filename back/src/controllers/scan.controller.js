const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { Scan, Vulnerability } = require('../models');
const { extractVulnerabilitiesFromXml } = require('../utils/extractVulnerabilities');
const config = require('../config/config');


function execPromise(command, scanId = null) {
  console.log(`💻 Executing: ${command}`);
  return new Promise((resolve, reject) => {
    const process = exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error("❌ Execution error:", stderr || err.message);
        reject(stderr || err.message);
      } else {
        console.log("✅ Command finished.");
        resolve(stdout);
      }
    });

    // 🔄 Mise à jour en temps réel du statut à chaque log
    if (scanId) {
      process.stdout.on('data', (data) => {
        const status = data.trim();
        const validStatuses = [
          'requested', 'queued', 'running', 'done',
          'interrupted', 'stopped', 'canceled', 'failed'
        ];

        if (validStatuses.includes(status.toLowerCase())) {
          console.log(`📡 OpenVAS status: ${status}`);
          Scan.findByIdAndUpdate(scanId, {
            status: status.toLowerCase()
          }).catch(e => console.error("⚠️ Failed to update status:", e));
        }
      });
    }
  });
}

exports.lancerScan = async (req, res) => {
  const { ip, typeScan, auditId } = req.body;
   const remoteUser = config.user_VM;
  const remoteHost = config.ip_VM;
  const scriptPath = `/home/${remoteUser}/scan_temp/launch_scan.py`;
  const localScriptPath = path.join(__dirname, '../scripts/launch_scan.py');
  const localDir = 'C:/Audit_Application/back/src/static/reports';
  const dateDebut = new Date();

  try {
    console.log('📌 Début de la création de l’objet Scan...');
    const scan = await Scan.create({
      auditId,
      ip,
      typeScan,
      dateDebut,
      status: 'in_progress',
      cheminFichier: ''
    });
    console.log('✅ Scan créé');

    console.log('📤 Transfert du script Python vers la VM...');
    await execPromise(`scp "${localScriptPath}" ${remoteUser}@${remoteHost}:${scriptPath}`);
    console.log('✅ Script transféré avec succès');

    console.log('🚀 Exécution du script distant via SSH...');
    const stdout = await execPromise(`ssh ${remoteUser}@${remoteHost} "python3 ${scriptPath} ${ip} ${typeScan}"`, scan._id);
    console.log('✅ Script exécuté. Résultat brut :', stdout);

    const remoteXmlPath = stdout.trim().split('\n').pop();

    console.log('⬇️ Récupération du fichier XML depuis la VM...');
    const fileName = path.basename(remoteXmlPath);
    const localPath = `${localDir}/${fileName}`;
    await execPromise(`scp ${remoteUser}@${remoteHost}:"${remoteXmlPath}" "${localDir}"`);
    console.log('✅ Fichier XML transféré localement');

    const dateFin = new Date();

    console.log('🧪 Extraction des vulnérabilités depuis le fichier XML...');
    const vulns = await extractVulnerabilitiesFromXml(localPath);
    const vulnIds = [];

    for (const vuln of vulns) {
      let existing = await Vulnerability.findOne({ cve: vuln.cve });
      if (!existing) {
        existing = await Vulnerability.create(vuln);
        console.log(`🆕 Nouvelle vulnérabilité enregistrée : ${vuln.cve}`);
      } else {
        console.log(`📌 Vulnérabilité existante trouvée : ${vuln.cve}`);
      }
      vulnIds.push(existing._id);
    }

    console.log('📝 Mise à jour de l’objet Scan avec les résultats...');
    scan.dateFin = dateFin;
    scan.cheminFichier = localPath;
    scan.status = 'done';
    scan.vulnerabilites = vulnIds;
    await scan.save();
    console.log('✅ Scan mis à jour avec succès');

    res.status(200).json({
      message: 'Scan completed and vulnerabilities stored ✅',
      scan
    });

  } catch (err) {
    console.error('❌ Erreur pendant le processus de scan :', err);
    res.status(500).json({
      message: 'Scan or file transfer failed ❌',
      error: err.toString()
    });
  }
};






exports.getScanConfigs = async (req, res) => {
  const remoteUser = config.user_VM;
  const remoteHost = config.ip_VM;
  const scriptFileName = 'get_scan_configs.py';
  const localScriptPath = path.join(__dirname, `../scripts/${scriptFileName}`);
  const remoteScriptPath = `/home/${remoteUser}/scan_temp/${scriptFileName}`;

  try {
    // 1. Copier le script Python vers la VM
    await execPromise(`scp "${localScriptPath}" ${remoteUser}@${remoteHost}:"${remoteScriptPath}"`);

    // 2. Lancer le script sur la VM via SSH
    const stdout = await execPromise(`ssh ${remoteUser}@${remoteHost} "python3 ${remoteScriptPath}"`);

    // 3. Nettoyer la sortie et parser le JSON
    const cleanedOutput = stdout.trim();

    if (!cleanedOutput || cleanedOutput === '[]') {
      return res.status(200).json({ configs: [], message: "Aucune configuration trouvée" });
    }

    let configs;
    try {
      configs = JSON.parse(cleanedOutput);
    } catch (parseErr) {
      console.error("❌ Erreur JSON:", cleanedOutput);
      return res.status(500).json({
        message: "Le script a retourné une sortie invalide (JSON mal formé)",
        error: parseErr.toString()
      });
    }

    // 4. Réponse OK
    res.status(200).json({ configs });

  } catch (err) {
    console.error("❌ Erreur SSH/exec:", err);
    res.status(500).json({
      message: "Échec de l'exécution du script ou de la récupération des données",
      error: err.toString()
    });
  }
};



exports.getByAudit = async (req, res) => {
  try {
    const scans = await Scan.find({ auditId: req.params.auditId }).sort({ dateDebut: -1 });
    res.status(200).json({ data: scans });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching scans', error: err.toString() });
  }
};

exports.getVulnerabilitiesByScan = async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.scanId).populate('vulnerabilites');
    if (!scan) return res.status(404).json({ message: 'Scan not found' });
    res.status(200).json({ scanId: scan._id, vulnerabilities: scan.vulnerabilites });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching vulnerabilities', error: err.toString() });
  }
};