const fs = require('fs');
const path = require('path');

// Resolve paths relative to this module
const examplePath = path.resolve(__dirname, '../config.example.json');
const configPath = path.resolve(__dirname, '../config.json');

// If config.json doesn’t exist yet, copy the example
if (!fs.existsSync(configPath)) {
  fs.copyFileSync(examplePath, configPath);
}

// Now read & parse it
const raw = fs.readFileSync(configPath, 'utf-8');
let CONFIG;
try {
  CONFIG = JSON.parse(raw);
} catch (err) {
  console.error('Invalid JSON in config.json:', err);
  process.exit(1);
}

module.exports = {
  probeIp: CONFIG.probeIp,
  legacy: CONFIG.legacy,
};
