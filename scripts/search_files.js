import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.resolve(__dirname, '../../client/src');

function searchDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            searchDir(fullPath);
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            if (content.includes('dog.image') || content.includes('/src/assets/breeds')) {
                console.log(`Found in: ${fullPath}`);
                // Print lines containing dog.image or assets/breeds
                const lines = content.split('\n');
                lines.forEach((line, index) => {
                    if (line.includes('dog.image') || line.includes('/src/assets/breeds')) {
                        console.log(`  L${index + 1}: ${line.trim()}`);
                    }
                });
            }
        }
    }
}

searchDir(SRC_DIR);
