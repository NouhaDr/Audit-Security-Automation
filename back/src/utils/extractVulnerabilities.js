const fs = require('fs');
const xml2js = require('xml2js');

async function extractVulnerabilitiesFromXml(filePath) {
  try {
    console.log("📂 Lecture du fichier XML :", filePath);
    const xmlContent = fs.readFileSync(filePath, 'utf-8');
    const parsed = await xml2js.parseStringPromise(xmlContent, { explicitArray: false });

    const results = parsed?.get_reports_response?.report?.report?.results?.result;
    if (!results) {
      console.log("⚠️ Aucun résultat trouvé dans le rapport.");
      return [];
    }

    const resultsArray = Array.isArray(results) ? results : [results];
    const vulnerabilities = [];

    for (const result of resultsArray) {
      const refs = result?.nvt?.refs?.ref;
      const refArray = Array.isArray(refs) ? refs : [refs];
      const cveRef = refArray?.find(r => r && r.$ && r.$.type === 'cve');

      if (cveRef) {
        const vuln = {
          cve: cveRef.$.id,
          description: result.description?.trim() || '',
          cvss: parseFloat(result.nvt?.cvss_base || '0')
        };
        vulnerabilities.push(vuln);
      }
    }

    console.log(`📊 Vulnérabilités extraites : ${vulnerabilities.length}`);
    return vulnerabilities;

  } catch (err) {
    console.error('❌ Erreur d\'extraction XML :', err);
    return [];
  }
}

module.exports = { extractVulnerabilitiesFromXml };
