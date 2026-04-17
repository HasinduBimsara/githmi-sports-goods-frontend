const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else {
            results.push(fullPath);
        }
    });
    return results;
}

const allFiles = walk(path.join(process.cwd(), 'src'));
const lowerCaseMap = new Map();
allFiles.forEach(f => {
    lowerCaseMap.set(f.replace(/\\/g, '/').toLowerCase(), f.replace(/\\/g, '/'));
});

allFiles.filter(f => f.endsWith('.jsx') || f.endsWith('.js')).forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
            let absImport = path.resolve(path.dirname(file), importPath).replace(/\\/g, '/');
            
            let found = false;
            let variants = [absImport, absImport + '.js', absImport + '.jsx', absImport + '/index.js', absImport + '/index.jsx'];
            for (let v of variants) {
                const lower = v.toLowerCase();
                if (lowerCaseMap.has(lower)) {
                    found = true;
                    const exactFile = lowerCaseMap.get(lower);
                    if (exactFile !== v) {
                        console.log(`MISMATCH in ${file}:\n  Line imported: '${importPath}'\n  Expected case: '${exactFile.substring(exactFile.lastIndexOf('/') + 1)}'`);
                    }
                    break;
                }
            }
            if(!found) {
                console.log(`MISSING completely in ${file}:\n  Line imported: '${importPath}'`);
            }
        }
    }
});
