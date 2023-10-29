import path from "path";
import fs from "fs";
import { Config } from "./config";
import { XmlData } from "./fetch-xml";
import { mkdirp } from "mkdirp";
import { globSync } from "glob";
import { camelCase, upperFirst } from "lodash";

export const gen = (data: XmlData, config: Config) => {
  const names: string[] = [];
  const imports: string[] = [];
  const dir = path.resolve(process.cwd(), config.dir);
  console.log('dir', dir);
  mkdirp.sync(dir + '/iconfont');
  if (config.gen_example) {
    globSync(dir + '/*.{ts,tsx}').forEach((file) => {
      console.log('unlink', file)
      fs.unlinkSync(file)
    });
  }
  globSync(dir + '/iconfont/*.{ts,tsx}').forEach((file) => {
    console.log('unlink iconfont/', file)
    fs.unlinkSync(file)
  });
  fs.writeFileSync(path.resolve(dir, 'iconfont/helper.ts'), fs.readFileSync(path.resolve(__dirname, './templates/helper.ts.template'), 'utf-8'));
  if (config.gen_example) {
    fs.writeFileSync(path.resolve(dir, 'main.tsx'), fs.readFileSync(path.resolve(__dirname, './templates/main.tsx.template'), 'utf-8'));
  }
  const template = fs.readFileSync(path.resolve(__dirname, './templates/icon.tsx.template'), 'utf-8');
  let appTemplate = '';
  if (config.gen_example) {
    fs.readFileSync(path.resolve(__dirname, './templates/App.tsx.template'), 'utf-8');
  }

  data.svg.symbol.forEach((symbol) => {
    // console.log('symbol', symbol);
    const id = symbol.$.id;
    const name = id.replace(config.trim_prefix, '');
    const fileName = 'Icon' + upperFirst(camelCase(name));
    names.push(fileName);
    console.log(`Generating ${fileName}...`, { id, name });
    let content = template.replace(/#Name#/g, fileName);
    content = content.replace(/#Size#/g, String(config.size));
    content = content.replace(/#Content#/g, genContent(symbol, 4));
    // console.log(content);
    fs.writeFileSync(path.resolve(dir, `iconfont/${fileName}.tsx`), content);
    imports.push(`import { ${fileName} } from './iconfont/${fileName}';`);
    console.log('generated', fileName);
  });

  if (config.gen_example) {
    appTemplate = appTemplate.replace(/#imports#/g, imports.join('\n'));
    appTemplate = appTemplate.replace(/#tr#/g, genTr(names));
    fs.writeFileSync(path.resolve(dir, 'App.tsx'), appTemplate);
  }
}

const genTr = (names: string[], indent = 8) => {
  return names.map((name) => {
    return `${whiteSpace(indent)}<tr><td>${name}</td><td><${name} /></td></tr>`;
  }).join('\n');
}

const whiteSpace = (repeat: number) => {
  return ' '.repeat(repeat);
}

const genContent = (data: XmlData['svg']['symbol'][number], indent: number) => {
  let template = `\n${whiteSpace(indent)}<svg viewBox="${data.$.viewBox}" width={size} height={size} {...rest}>\n`;
  data.path.forEach((path) => {
    template += `${whiteSpace(indent + 2)}<path${genPathAttr(path, indent)}\n${whiteSpace(indent + 2)}/>\n`;
  });
  template += `${whiteSpace(indent)}</svg>\n`;
  return template;
}

const genPathAttr = (path: XmlData['svg']['symbol'][number]['path'][number], indent: number) => {
  let attrs = '';
  let colorIndex = 0;
  path.$.fill = path.$.fill || 'currentColor';
  Object.keys(path.$).forEach((attr) => {
    if (attr === 'fill') {
      attrs += `\n${whiteSpace(indent + 4)}fill={getIconColor(color, ${colorIndex}, '${path.$.fill}')}`;
      colorIndex += 1;
    } else {
      attrs += `\n${whiteSpace(indent + 4)}${camelCase(attr)}="${path.$.d}"`;
    }
  });
  return attrs;
}