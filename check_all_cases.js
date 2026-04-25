import fs from 'fs';
import path from 'path';

function listAll(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        console.log(fullPath);
        if (fs.statSync(fullPath).isDirectory()) {
            listAll(fullPath);
        }
    }
}

listAll('src');
