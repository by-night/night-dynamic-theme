const fs = require('fs');
const path = require('path');
const root = process.cwd();
let publicDir = path.join(root, 'public');
let theme = 'normal';
let lessCDN = false;
let scriptPath = '';
let lessPath = '';

// 连接符_转驼峰
const toTuo = (targetString) => {
    return targetString.replace(/\_(\w)/g, (match, letter) => letter.toUpperCase())
};
// 写入全局js文件
const writeGlobal = (str = 'GLOBAL_') => {
    const result = {
        themeName: theme
    };
    // try {
    //     for (let key in process.env) {
    //         const ind = key.indexOf(str);
    //         if (ind !== 0) continue;
    //         const vars = key.slice(str.length);
    //         const k = toTuo(vars.toLowerCase());
    //         result[k] = process.env[key];
    //     }
    // } catch (e) {
    //     console.log(e);
    // }
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
    return new Promise((resolve, reject) => {
        const result = writeGlobal() + ';' + writePublicTheme();
        fs.writeFile(path.join(publicDir, output), result.replace(/\n/g, ''), (err) => {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            resolve();
        })
    })
}
// 加载less的js文件
const getLessMin = (output = 'theme/less.min.js') => {
    // 使用 CDN
    if (lessCDN) return Promise.resolve();
    return new Promise((resolve, reject) => {
        try {
            const readStream = fs.createReadStream(path.join(__dirname, 'lib/less.min.js'), 'utf-8');
            const writeStream = fs.createWriteStream(path.join(publicDir, 'theme/less.min.js'));
            readStream.pipe(writeStream);
            resolve()
        } catch (e) {
            reject(e);
        }
    })
};
// 主方法
const writeMain = (options) => {
    try {
        initGlobal(options);
        // 在public创建js引用
        const scriptAsync = writeScript(scriptPath);
        const lessMinAsync = getLessMin(lessPath);

        return Promise.all([scriptAsync, lessMinAsync]);
    } catch (e) {
        console.log(e);
        return Promise.reject();
    }
};
const initGlobal = (options) => {
    publicDir = options.publicDir;
    theme = options.themeName;
    lessCDN = options.lessCDN;
    scriptPath = options.scriptPath;
    lessPath = options.lessPath;
};
module.exports = {
    writeMain,
};