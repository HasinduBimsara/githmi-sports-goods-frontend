import fs from 'fs';
import path from 'path';

function listAll(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            listAll(fullPath, fileList);
        } else {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

const allFiles = listAll('src').map(f => f.replace(/\\/g, '/'));
const fileMap = new Map();
allFiles.forEach(f => {
    fileMap.set(f.toLowerCase(), f);
});

function checkFile(file) {
    const content = fs.readFileSync(file, 'utf8');
    const importRegex = /import\s+(?:[^'"]+\s+from\s+)?['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
            const dir = path.dirname(file).replace(/\\/g, '/');
            let resolved = path.resolve(dir, importPath).replace(/\\/g, '/');
            
            const extensions = ['', '.jsx', '.js', '.css', '.svg', '.png', '.jpg'];
            let found = false;
            for (const ext of extensions) {
                const checkPath = (resolved + ext).replace(/\\/g, '/');
                let relativeCheckPath = path.relative(process.cwd(), checkPath).replace(/\\/g, '/');
                
                const low = relativeCheckPath.toLowerCase();
                if (fileMap.has(low)) {
                    const actualPath = fileMap.get(low);
                    if (actualPath !== relativeCheckPath) {
                        console.log(`MISMATCH in ${file}:`);
                        console.log(`  Imported: ${importPath}`);
                        console.log(`  Resolved as: ${relativeCheckPath}`);
                        console.log(`  Actual case: ${actualPath}`);
                    }
                    found = true;
                    break;
                }
            }
        }
    }
}

allFiles.filter(f => f.endsWith('.jsx') || f.endsWith('.js') || f.endsWith('.css')).forEach(checkFile);
console.log("Check complete.");
