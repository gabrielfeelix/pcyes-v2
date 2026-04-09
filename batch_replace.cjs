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

  // Decrease padding
  content = content.replace(/px-8 md:px-16/g, 'px-4 md:px-8');
  content = content.replace(/px-5 md:px-8/g, 'px-3 md:px-4');
  content = content.replace(/px-6 md:px-8/g, 'px-3 md:px-4');
  // Widen containers
  content = content.replace(/max-w-\[1300px\]/g, 'max-w-[1920px]');
  content = content.replace(/max-w-\[1440px\]/g, 'max-w-[1920px]');
  content = content.replace(/max-w-\[1100px\]/g, 'max-w-[1920px]');

  // Specific Navbar replacements
  if (file.endsWith('Navbar.tsx')) {
    // Increase nav link font size
    content = content.replace(/fontSize: "14px"/g, 'fontSize: "16px"');
    // Increase icon sizes slightly
    content = content.replace(/size=\{16\}/g, 'size={20}');
    content = content.replace(/size=\{18\}/g, 'size={22}');
    // Increase icon button wrappers slightly
    content = content.replace(/w-9 h-9/g, 'w-10 h-10');
  }

  if (content !== origContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`Finished processing. ${changedFiles} files updated.`);
