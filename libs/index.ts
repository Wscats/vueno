/**
 * Vueno - HTML to Vue/CSS converter library.
 * Reads HTML files, extracts inline styles, and generates Vue SFC and clean HTML.
 */
import * as fs from 'fs';
import { JSDOM } from 'jsdom';
import jQuery from 'jquery';
import prettier from 'prettier';

/** Configuration object passed between pipeline stages. */
interface FileConfig {
  $: JQueryStatic;
  path?: string;
  style?: string;
  template?: string;
}

/** Read an HTML file and parse it into a jQuery-wrapped DOM. */
export function readFile(url: string): Promise<FileConfig> {
  return new Promise((resolve, reject) => {
    fs.readFile(url, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const html = data.toString();
        const { window } = new JSDOM(html);
        const $ = jQuery(window as any) as unknown as JQueryStatic;
        resolve({ $ });
      }
    });
  });
}

/** Extract inline <style> content and remove style/script tags from the DOM. */
export function compileInlineStyle(config: FileConfig): Promise<FileConfig> {
  return new Promise((resolve, reject) => {
    const { $, path } = config;

    let style = '';
    $('style').each((_index: number, item: HTMLElement) => {
      style += $(item).html();
    });
    style = prettier.format(style, { parser: 'css' });

    $('style').remove();
    $('script').remove();

    const cssPath = `${path}.css`;
    fs.writeFile(cssPath, style, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          ...config,
          style,
          template: prettier.format($('body').html() || '', { parser: 'html' }),
        });
      }
    });
  });
}

/** Generate a Vue Single File Component from extracted template and style. */
export function createVue(config: FileConfig): void {
  const { style, template, path } = config;
  const vue = prettier.format(`
    <template>
        <div>
            ${template}
        </div>
    </template>
    <script>
    export default {

    }
    </script>
    <style scoped>
        ${style}
    </style>
  `, { parser: 'vue' });

  fs.writeFile(`${path}.vue`, vue, () => {
    console.log('write success');
  });
}

/** Generate a standalone HTML file with embedded Vue.js from extracted content. */
export function createHtml(config: FileConfig): void {
  const { style, template, path } = config;
  const html = prettier.format(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        <style>${style}</style>
    </head>
    <body>
        <div id="demo"></div>
        <script src="https://cdn.bootcss.com/vue/2.6.10/vue.min.js"></script>
        <script>
            new Vue({
                el:"#demo",
                template:\`${template}\`
            })
        </script>
    </body>
    </html>
  `, { parser: 'html' });

  fs.writeFile(`${path}.html`, html, () => {
    console.log('write success');
  });
}

/** Extract file extension from a filename. */
export function fileType(filename: string): string {
  const dotIndex = filename.lastIndexOf('.');
  return filename.substring(dotIndex);
}
