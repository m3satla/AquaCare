const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const validExtensions = ['.tsx', '.jsx'];

const tagsToProcess = [
  'Button', 'Typography', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'span', 'div', 'label', 'strong', 'small'
];

function walkDir(currentPath) {
  const files = fs.readdirSync(currentPath);

  files.forEach(file => {
    const fullPath = path.join(currentPath, file);

    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (validExtensions.includes(path.extname(file))) {
      processFile(fullPath);
    }
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  tagsToProcess.forEach(tag => {
    const regex = new RegExp(`<${tag}([^>]*)>([^<{][^<]*)<\\/${tag}>`, 'g');
    content = content.replace(regex, (match, attributes, innerText) => {
      const cleanText = innerText.trim();
      if (cleanText && !cleanText.includes('{') && !cleanText.includes('}')) {
        return `<${tag}${attributes}>{t("${cleanText}")}</${tag}>`;
      }
      return match; // אם יש סוגריים - לא לעטוף
    });
  });

  // הוספת import { t } אם צריך
  if (content.includes('{t(') && !content.includes("import { t }")) {
    content = `import { t } from '../services/i18n';\n` + content;
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Updated safely: ${filePath}`);
  }
}

walkDir(srcDir);
console.log('🎯 סיימתי לעטוף בבטחה את הטקסטים!');
