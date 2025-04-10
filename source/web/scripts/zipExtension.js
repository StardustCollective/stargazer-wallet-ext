const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Define paths
const sourcePath = path.join(__dirname, '../extension', 'chrome');
const outputPath = path.join(__dirname, '../extension', 'chrome.zip');

// Create output directory if it doesn't exist
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create a write stream for the zip file
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
  zlib: { level: 9 }, // Maximum compression level
});

// Listen for archive events
output.on('close', () => {
  console.log(
    `✅ Archive created successfully! Size: ${(archive.pointer() / 1024 / 1024).toFixed(
      2
    )} MB`
  );
});

archive.on('error', (err) => {
  throw err;
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn('⚠️ Warning:', err);
  } else {
    throw err;
  }
});

// Pipe archive data to the output file
archive.pipe(output);

// Add the entire chrome directory to the archive
archive.directory(sourcePath, false);

// Finalize the archive
archive.finalize();
