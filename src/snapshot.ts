import fs from 'fs';
import path from 'path';
import { fetchXml } from './fetch-xml';

fetchXml('https://at.alicdn.com/t/c/font_4305941_tkxqzpu9mu.js').then((data) => {
  fs.writeFileSync(path.resolve(__dirname, 'snapshot.json'), JSON.stringify(data, null, 2));
});