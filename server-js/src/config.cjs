const fs = require('fs');
const path = require('path');

const isPkg = typeof process.pkg !== 'undefined';
const baseDir = isPkg
  ? // On Windows/Linux/Mac, this is the folder containing your .exe
    path.dirname(process.execPath)
  : // During dev, this is your src/ folder
    __dirname;

// Resolve paths relative to this module
const examplePath = path.resolve(baseDir, '../config.example.json');
const configPath = path.resolve(baseDir, '../config.json');

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
