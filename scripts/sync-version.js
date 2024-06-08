const fs = require('fs');
const path = require('path');

const manifestPath = path.resolve(__dirname, '../extension/manifest.json');
const htmlPath = path.resolve(__dirname, '../extension/popup/popup.html');

const manifest = fs.readFileSync(manifestPath, 'utf8');
const { version } = JSON.parse(manifest);

const html = fs.readFileSync(htmlPath, 'utf8');
const updatedHtml = html.replace(/v\d+\.\d+\.\d+/,`v${version}`);

fs.writeFileSync(htmlPath, updatedHtml, 'utf8');

console.log(`Version updated to v${version}`);
