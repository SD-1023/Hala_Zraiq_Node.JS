const fs = require('fs').promises;
const path = require('path');

// count words  
function countWords(text) {
  if (text.trim() === '') {
    return 0;
  } else {
    return text.split(/\s+/).length;
  }
  
}

// for single file
async function processFile(filePath) {
  try {
    // Checking for special characters
    if (/[^a-zA-Z0-9_\-\.]/.test(path.basename(filePath))) {
      throw new Error(`Invalid characters in file name: ${filePath}`);
    }

    const normalizedPath = path.normalize(filePath); // for diff OS
    const stats = await fs.stat(normalizedPath);

    if (stats.size === 0) {
      console.log(`${normalizedPath}: Empty file`);
    } else {
      const data = await fs.readFile(normalizedPath, 'utf-8');
      const wordCount = countWords(data);
      console.log(`${normalizedPath}: ${wordCount} words`);
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(` ${filePath} not found ((`);
    } else {
      console.error(`  ${error.message}`);
    }
  }
}

//for all the files in config file
async function processFiles() {
  try {
    const config = require('./config.json');

    await Promise.all(config.files.map(processFile));
  } catch (error) {
    console.error(`Error reading configuration: ${error.message}`);
  }
}

processFiles();
