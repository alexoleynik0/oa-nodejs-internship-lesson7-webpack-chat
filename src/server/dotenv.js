const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const dotenvPath = path.resolve(__dirname, '../..', '.env');

if (fs.existsSync(dotenvPath) !== true) {
  const dotenvExamplePath = path.resolve(__dirname, '../..', '.env.example');
  fs.copyFileSync(dotenvExamplePath, dotenvPath);
}

dotenv.config({ path: dotenvPath });
