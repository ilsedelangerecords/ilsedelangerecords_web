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

console.log('Fetching latest release information...');

https.get(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      try {
        const release = JSON.parse(data);
        const asset = release.assets.find(a => a.name === assetName);

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
