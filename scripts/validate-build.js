#!/usr/bin/env node
/**
 * Build validation script for Ilse DeLange Records website
 * Validates that all required content files are present after build
 */

import fs from 'fs';
import path from 'path';

const REQUIRED_FILES = [
  'dist/content/albums.json',
  'dist/content/lyrics.json',
  'dist/content/artists.json'
];

const SUCCESS_EMOJI = '✅';
const ERROR_EMOJI = '❌';
const INFO_EMOJI = '🔍';

console.log(`${INFO_EMOJI} Validating build output...`);

let allValid = true;

for (const filePath of REQUIRED_FILES) {
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      const count = Array.isArray(data) ? data.length : Object.keys(data).length;
      console.log(`${SUCCESS_EMOJI} ${path.basename(filePath)} found with ${count} items`);
    } catch (error) {
      console.log(`${ERROR_EMOJI} ${path.basename(filePath)} is invalid JSON: ${error.message}`);
      allValid = false;
    }
  } else {
    console.log(`${ERROR_EMOJI} ${path.basename(filePath)} not found in dist/content`);
    allValid = false;
  }
}

if (allValid) {
  console.log(`${SUCCESS_EMOJI} All content files validated successfully!`);
  process.exit(0);
} else {
  console.log(`${ERROR_EMOJI} Content validation failed!`);
  process.exit(1);
}
