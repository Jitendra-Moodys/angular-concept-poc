const fs = require('fs');
const path = require('path');

// Function to recursively remove JSDoc comments from files
const removeJSDocComments = (dirs) => {
  dirs.forEach((dir) => {
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        removeJSDocComments([filePath]);
      } else if (filePath.endsWith('.js') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/\/\*\*[\s\S]*?\*\//g, ''); // Regex to match JSDoc comments
        fs.writeFileSync(filePath, content, 'utf8');
      }
    });
  });
};

removeJSDocComments(['./libs', './ui']);
