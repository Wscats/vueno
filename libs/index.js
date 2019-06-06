const fs = require('fs');
const { JSDOM } = require('jsdom');
const jQuery = require("jquery")
// 读取源代码html文件
const readFile = (url) => {
    return new Promise((resolve, reject) => {
        fs.readFile(url, (err, data) => {
            if (err) {
                reject(err);
            } else {
                // console.log(data.toString());
                const html = data.toString();
                // 在node环境下生成一个dom
                const { window } = new JSDOM(html);
                // console.log(window);
                const $ = jQuery(window);
                resolve({
                    $
                });
            }
        })
    })
}

// 获取内联样式<style>xxx</style>
const compileInlineStyle = (config) => {
    return new Promise((resolve, reject) => {
        const {
            $,
            path
        } = config
        // $('style')
        // console.log($('style').eq(0).html());
        let style = '';
        $('style').each((index, item) => {
            style += $(item).html();
            console.log($(item).html());
        })
        $('style').remove();
        $('script').remove();
        // console.log($('body').html());
        fs.writeFile(`${path}.css`, style, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log('写入成功');
                resolve({
                    ...config,
                    style,
                    template: $('body').html()
                });
            }
        });

    })
}

const createVue = (config) => {
    const {
        style,
        template,
        path
    } = config;
    console.log(config);
    fs.writeFile(`${path}.vue`, `
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
    `, () => {
        console.log('write success');
    })
}

const createHtml = (config) => {
    const {
        style,
        template,
        path
    } = config;
    console.log(config);
    fs.writeFile(`${path}.html`, `
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
                    template:${'`'}${template}${'`'}
                })
            </script>
        </body>
        </html>
    `, () => {
        console.log('write success');
    })
}

// 获取后缀名
const fileType = (filename) => {
    const index1 = filename.lastIndexOf(".");
    const index2 = filename.length;
    const type = filename.substring(index1, index2);//后缀名
    return type;
}


module.exports = {
    compileInlineStyle,
    createHtml,
    createVue,
    readFile,
    fileType,
}

