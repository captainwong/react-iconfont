import fs from 'fs';
import path from 'path';
import colors from 'colors';
import defaultConfig from './default-config.json';


export interface Config {
  /**
   * The URL of the iconfont JS file.
   * 
   * @example https://at.alicdn.com/t/c/font_4305941_tkxqzpu9mu.js
   */
  url: string;
  /**
   * The output directory.
   * 
   * @example src/assets
   */
  dir: string;

  /**
   * Whether to generate App.tsx, main.ts files.
   * 
   * @example false
   */
  gen_example: boolean;

  /**
   * The prefix of the icon to remove.
   * 
   * @example icon-
   */
  trim_prefix: string;

  /**
   * The size unit of the icon.
   * 
   * @example px
   */
  unit: 'px' | 'rem';

  /**
   * The size of the icon.
   * 
   * @example 16
   */
  size: number;
}

let cachedConfig: Config;

export const getConfig = (): Config => {
  if (cachedConfig) {
    return cachedConfig;
  }

  const configPath = path.resolve(process.cwd(), 'iconfont.config.json');
  if (fs.existsSync(configPath)) {
    cachedConfig = require(configPath);
  } else {
    cachedConfig = defaultConfig as Config;
  }

  return cachedConfig;
}
