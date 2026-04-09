const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!['node_modules', '.git', 'dist'].includes(file)) {
        filelist = walkSync(filePath, filelist);
      }
    } else {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        filelist.push(filePath);
      }
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, 'src'));
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let origContent = content;

  // Increase padding slightly from the "too glued" state
  content = content.replace(/px-4 md:px-8/g, 'px-6 md:px-12');
  content = content.replace(/px-3 md:px-4/g, 'px-4 md:px-6');

  if (content !== origContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`Finished processing. ${changedFiles} files updated.`);
