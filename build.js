const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const distDir = path.join(__dirname, 'dist');

console.log('Starting frontend build...');

// 1. Clean and recreate dist directory
if (fs.existsSync(distDir)) {
  console.log(`Cleaning existing directory: ${distDir}`);
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Helper to copy files recursively, skipping hidden/system files
function copyRecursiveSync(src, dest) {
  const baseName = path.basename(src);
  if (baseName.startsWith('.') || baseName === 'node_modules' || baseName === 'dist') {
    return; // Skip hidden files/directories and build output
  }

  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((child) => {
      copyRecursiveSync(path.join(src, child), path.join(dest, child));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 2. Copy directories
const dirsToCopy = ['assets', 'en'];
dirsToCopy.forEach((dir) => {
  const srcPath = path.join(srcDir, dir);
  const destPath = path.join(distDir, dir);
  if (fs.existsSync(srcPath)) {
    console.log(`Copying directory: ${dir}/`);
    copyRecursiveSync(srcPath, destPath);
  } else {
    console.warn(`Warning: Directory ${dir} not found!`);
  }
});

// 3. Copy root HTML and PDF files (including portfolio, CV, references, and offers)
fs.readdirSync(srcDir).forEach((file) => {
  const srcPath = path.join(srcDir, file);
  const stats = fs.statSync(srcPath);

  if (stats.isFile()) {
    const ext = path.extname(file).toLowerCase();
    // Copy only .html and .pdf files
    if (ext === '.html' || ext === '.pdf') {
      console.log(`Copying file: ${file}`);
      fs.copyFileSync(srcPath, path.join(distDir, file));
    }
  }
});

// 4. Generate .htaccess for Apache URL rewriting (clean URLs)
const htaccessContent = `RewriteEngine On

# Serve index.html if directory is requested
DirectoryIndex index.html

# Rewrite clean URLs to .html files (e.g. /cv -> /cv.html, /en/cv -> /en/cv.html)
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME}\\.html -f
RewriteRule ^(.*)$ $1.html [L]
`;

const htaccessPath = path.join(distDir, '.htaccess');
fs.writeFileSync(htaccessPath, htaccessContent);
console.log('Generated .htaccess file for clean URLs.');

console.log('Build completed successfully! Build output in: ./dist/');
