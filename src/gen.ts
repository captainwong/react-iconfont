import path from "path";
import fs from "fs";
import { Config } from "./config";
import { XmlData } from "./fetch-xml";
import * as mkdirp from "mkdirp";

export const gen = (data: XmlData, config: Config) => {
  const names: string[] = [];
  const imports: string[] = [];
  const dir = path.resolve(process.cwd(), config.dir);
  mkdirp.sync(dir);
  data.svg.symbol.forEach((symbol) => {
    const name = symbol.$.id.replace(/-(\w)/g, (_, $1) => $1.toUpperCase());
    const fileName = `${name}.svg`;
    const filePath = path.resolve(dir, fileName);
    const viewBox = symbol.$.viewBox;
    const pathD = symbol.path[0].$.d;
    const fill = symbol.path[0].$.fill;
    const size = config.size;
    const unit = config.unit;
    const content = `<svg viewBox="${viewBox}" width="${size}${unit}" height="${size}${unit}" fill="${fill}"><path d="${pathD}"/></svg>`;
    names.push(name);
    imports.push(`import ${name} from './${fileName}';`);
    fs.writeFileSync(filePath, content);
    process.exit(0);
  });
}