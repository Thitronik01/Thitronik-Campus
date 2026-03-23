import fs from 'fs';
import path from 'path';

function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const res = path.resolve(dir, file);
    if (fs.statSync(res).isDirectory()) {
      getFiles(res, filesList);
    } else {
      if (res.endsWith('.tsx')) filesList.push(res);
    }
  }
  return filesList;
}

const allFiles = getFiles('src');
let replacedFiles = 0;
let replacedInstances = 0;

for (const file of allFiles) {
    let content = fs.readFileSync(file, 'utf8');
    const regex = /<Button([^>]*)size="icon"([^>]*)>(\s*)<ArrowLeft/g;
    
    if (regex.test(content)) {
        // Exclude ones that ALREADY have aria-label
        if (content.match(/<Button[^>]*aria-label[^>]*size="icon"[^>]*>(\s*)<ArrowLeft/)) {
            continue;
        }
        const matches = content.match(regex).length;
        content = content.replace(regex, '<Button aria-label="Zurück"$1size="icon"$2>$3<ArrowLeft');
        fs.writeFileSync(file, content);
        replacedFiles++;
        replacedInstances += matches;
        console.log(`Updated ${matches} instances in ${file}`);
    }
}

console.log(`Finished: Added ${replacedInstances} aria-labels across ${replacedFiles} files.`);
