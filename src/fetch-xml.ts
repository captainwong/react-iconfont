import { parseStringPromise } from 'xml2js';

export interface XmlData {
  svg: {
    symbol: Array<{
      $: {
        id: string;
        viewBox: string;
      };
      path: Array<{
        $: {
          d: string;
          fill?: string;
        };
      }>;
    }>
  }
}

export const fetchXml = async (url: string): Promise<XmlData> => {
  const response = await fetch(url);
  const text = await response.text();
  const matches = text.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  if (!matches) {
    throw new Error('SVG not found');
  }
  const [, svg] = matches;
  
  return parseStringPromise(`<svg>${svg}</svg>`) as Promise<XmlData>;
}
