const fs = require('fs');
const path = require('path');
const root = process.cwd();
const publicDir = path.join(root, 'public');
const outputDir = '/';

// 连接符_转驼峰
const toTuo = (targetString) => {
    return targetString.replace(/\_(\w)/g, (match, letter) => letter.toUpperCase())
};
// 写入全局js文件
const writeGlobal = (str = 'GLOBAL_', output = 'global.js') => {
    let result = {};
    for (let key in process.env) {
        const ind = key.indexOf(str);
        if (ind !== 0) continue;
        const vars = key.slice(str.length);
        const k = toTuo(vars.toLowerCase());
        result[k] = process.env[key];
    }
    fs.writeFileSync(path.join(publicDir, output), `window.global=${JSON.stringify(result)}`);
    return getOutFile(output);
};

// 主题切换js文件
const writePublicTheme = (output = 'theme.js') => {
    const content =
`
        var theme = window.global.themeName || 'normal';
        var link = document.createElement('link');
        link.rel = "stylesheet/less";
        link.type = "text/less";
        link.href = "/theme/" + theme + ".less";
        document.body.appendChild(link);
        window.less = { async: false, env: "production" };
`;
    fs.writeFileSync(path.join(publicDir, output), content);
    return getOutFile(output);
}
// 加载less的js文件
const getLessMin = () => {
    // todo CDN 文件
    const readStream = fs.createReadStream(path.join(__dirname, 'lib/less.min.js'), 'utf-8');
    const writeStream = fs.createWriteStream(path.join(publicDir, 'less.min.js'));
    readStream.pipe(writeStream);

    const output = 'less.min.js';
    return getOutFile(output);
}
const getOutFile = (filePath) => {
    return '/' + filePath;
}
module.exports = {
    getLessMin,
    writeGlobal,
    writePublicTheme,
}