import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const owner = 'ilsedelangerecords';
const repo = 'migration';
const assetName = 'lyrics.json';
const destPath = path.join(__dirname, '..', 'public', 'content', 'lyrics.json');

const options = {
  hostname: 'api.github.com',
  path: `/repos/${owner}/${repo}/releases/latest`,
  headers: {
    'User-Agent': 'Node.js'
  }
};

console.log('Script started.');
console.log('Fetching latest release information...');
console.log('Making request to GitHub API:', options);

https.get(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    console.log('Received data chunk from GitHub API.');
    data += chunk;
  });

  res.on('end', () => {
    console.log('GitHub API response received. Status code:', res.statusCode);

    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('Parsing GitHub API response.');
      try {
        const release = JSON.parse(data);
        console.log('Parsed release data:', release);

        const asset = release.assets.find(a => a.name === assetName);
        console.log('Found asset:', asset);

        if (asset) {
          const fileUrl = asset.browser_download_url;
          console.log(`Downloading ${assetName} from ${fileUrl}`);

          const downloadOptions = {
            headers: {
              'User-Agent': 'Node.js'
            }
          };

          // The browser_download_url for release assets redirects.
          // We need to handle this redirect.
          https.get(fileUrl, downloadOptions, (fileRes) => {
            console.log('File download response received. Status code:', fileRes.statusCode);

            // Follow redirect
            if (fileRes.statusCode >= 300 && fileRes.statusCode < 400 && fileRes.headers.location) {
              console.log('Redirecting to', fileRes.headers.location);
              https.get(fileRes.headers.location, downloadOptions, (redirectRes) => {
                handleFileDownload(redirectRes);
              }).on('error', (err) => {
                console.error('Error during redirect:', err.message);
                process.exit(1);
              });
            } else {
              handleFileDownload(fileRes);
            }
          }).on('error', (err) => {
            console.error('Error initiating download:', err.message);
            process.exit(1);
          });

        } else {
          console.error(`${assetName} not found in the latest release assets.`);
          process.exit(1);
        }
      } catch (e) {
        console.error('Error parsing GitHub API JSON response:', e.message);
        process.exit(1);
      }
    } else {
      console.error(`Error fetching latest release info: ${res.statusCode} ${res.statusMessage}`);
      console.error('Response body:', data);
      process.exit(1);
    }
  });

}).on('error', (err) => {
  console.error('Error making GitHub API request:', err.message);
  process.exit(1);
});

function handleFileDownload(fileRes) {
  if (fileRes.statusCode === 200) {
    const fileStream = fs.createWriteStream(destPath);
    fileRes.pipe(fileStream);
    fileStream.on('finish', () => {
      console.log(`${assetName} downloaded successfully to ${destPath}`);
      // Log the contents of the downloaded file for debugging
      fs.readFile(destPath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading the downloaded file:', err.message);
        } else {
          console.log('Downloaded file contents:', data);
        }
      });
    });
    fileStream.on('error', (err) => {
        console.error('Error writing to file:', err.message);
        process.exit(1);
    });
  } else {
    console.error(`Error downloading file: ${fileRes.statusCode} ${fileRes.statusMessage}`);
    let body = '';
    fileRes.on('data', chunk => body += chunk);
    fileRes.on('end', () => {
        console.error('Response body:', body);
        process.exit(1);
    });
  }
}
