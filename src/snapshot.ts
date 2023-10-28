import fs from 'fs';
import path from 'path';
import { fetchXml } from './fetch-xml';

fetchXml('https://at.alicdn.com/t/c/font_4305941_r0glzsxda9n.js?spm=a313x.manage_type_myprojects.i1.10.552b3a81NwPhGB&file=font_4305941_r0glzsxda9n.js').then((data) => {
  fs.writeFileSync(path.resolve(__dirname, 'snapshot.json'), JSON.stringify(data, null, 2));
});