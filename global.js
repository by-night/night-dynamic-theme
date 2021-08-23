const fs = require('fs');
const path = require('path');
const root = process.cwd();
const publicDir = path.join(root, 'public');
let theme = 'normal';
let lessCDN = false;

// 连接符_转驼峰
const toTuo = (targetString) => {
    return targetString.replace(/\_(\w)/g, (match, letter) => letter.toUpperCase())
};

const getOutFile = (filePath) => {
    return '/' + filePath;
}
// 加载less的js文件
const getLessMin = (output = 'theme/less.min.js') => {
    if (lessCDN) {
        // less 使用 CDN 
        return "https://cdn.bootcss.com/less.js/2.7.3/less.min.js";
    }
    const readStream = fs.createReadStream(path.join(__dirname, 'lib/less.min.js'), 'utf-8');
    const writeStream = fs.createWriteStream(path.join(publicDir, 'theme/less.min.js'));
    readStream.pipe(writeStream);
    return getOutFile(output);
}
// 写入全局js文件
const writeGlobal = (str = 'GLOBAL_') => {
    let result = {
        themeName: theme
    };
    try {
        for (let key in process.env) {
            const ind = key.indexOf(str);
            if (ind !== 0) continue;
            const vars = key.slice(str.length);
            const k = toTuo(vars.toLowerCase());
            result[k] = process.env[key];
        }
    } catch (e) {
        console.log(e);
    }
    return `window.global=${JSON.stringify(result)}`;
};

// 主题切换js文件
const writePublicTheme = () => {
    return `
        var theme = window.localTheme || localStorage.getItem('THEME_NAME') || '${theme}';
        var link = document.createElement('link');
        link.rel = "stylesheet/less";
        link.type = "text/less";
        link.href = "/theme/" + theme + ".less";
        document.body && document.body.appendChild(link);
        window.less = { async: false, env: "production" };
    `;
}
const writeScript = (output = 'theme/loadTheme.js') => {
    const result = writeGlobal() + ';' + writePublicTheme();
    fs.writeFile(path.join(publicDir, output), result.replace(/\n/g, ''), (err) => {
        if (err) {
            console.log(err);
            return;
        }
    })
    return getOutFile(output);
}
const initGlobal = (options) => {
    theme = options.themeName;
    lessCDN = options.lessCDN;
}
module.exports = {
    getLessMin,
    writeScript,
    initGlobal,
}