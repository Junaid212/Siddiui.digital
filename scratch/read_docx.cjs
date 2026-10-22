const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Docx files are zip files. Let's see if AdmZip is installed in node_modules or backend
try {
  const AdmZip = require('adm-zip');
  const zip = new AdmZip(path.join(__dirname, '../public/assets/Privacy_Policy_Siddiqui_Digital_Final.docx'));
  const content = zip.readAsText('word/document.xml');
  console.log('Docx text length:', content.length);
  const clean = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  console.log('Snippet:', clean.substring(0, 500));
} catch (e) {
  console.log('adm-zip not available, checking python or buffer:', e.message);
}
