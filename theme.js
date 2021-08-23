const fs = require('fs');
const path = require('path');
const { generateTheme } = require("antd-theme-generator");
const { fileWrite, dirWriteSync } = require("./write");
const root = process.cwd();
let outLess = 'color.less';
let publicDir = path.join(root, './public');
let outputDir = path.join(root, './public/theme');
let themeDir = path.join(root, './src/common/theme');
let JSONDir = path.join(root, './public/theme');
let theme = process.env.GLOBAL_THEME_NAME || 'normal';

const options = {
    antDir: path.join(root, './node_modules/antd'),
    stylesDir: path.join(root, "./src"),
}


// 将less文件转为对象
const getLessVars = (filtPath) => {
    const sheet = fs.readFileSync(filtPath).toString();
    const sheetStr = removeJsComments(sheet);
    const lessVars = {};
    const matches = sheetStr.match(/@(.*:[^;]*)/g) || [];
    matches.forEach((variable) => {
        const definition = variable.split(/:\s*/);
        const varName = definition[0].replace(/['"]+/g, "").trim();
        lessVars[varName] = definition.splice(1).join(":");
    });
    return lessVars;
}

// 去除注释
const removeJsComments = (code) => {
    return code.replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, '\n').replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, '\n').replace(/(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g, '\n');
}
// 写入变量文件
const writeVarFile = (themeFiles) => {
    themeFiles.map(file => {
        const varFile = path.join(themeDir, file);
        const lessContent = fs.readFileSync(varFile).toString();
        const lessBody = removeJsComments(lessContent);
        const varStr = `@import "./${outLess}";${lessBody}`;
        const output = path.join(outputDir, file);
        fileWrite(output, varStr.replace(/\n/g, ''), (err) => {
            if (err) {
                console.log(err);
            }
        });
    })
}
// 写入json文件
const writeLessJson = (themeFiles = []) => {
    let content = {};
    themeFiles.forEach(file => {
        if (!file) return;
        const varFile = path.join(themeDir, file);
        const varContent = getLessVars(varFile);
        const ind = file.lastIndexOf('.');
        const jsonName = (ind === -1 ? file : file.slice(0, ind));
        content[jsonName] = varContent
    })
    fileWrite(path.join(JSONDir, 'theme.json'), JSON.stringify(content), (err) => {
        if (err) {
            console.log(err);
        }
    });
}
// 获取主题文件夹下的所有less文件
const getThemeFile = (themeDir) => {
    try {
        const allDir = fs.readdirSync(themeDir);
        return allDir.filter(file => /\.(less)$/.test(file));
    } catch (e) {
        return [];
    }
}
// 写入公共less文件
const writeCommonLess = async (file) => {
    dirWriteSync(outputDir);
    const varFile = path.join(themeDir, file);
    const varContent = getLessVars(varFile);

    const themeList = varContent ? Object.keys(varContent) : [];
    const params = {
        varFile,
        outputFilePath: path.join(outputDir, outLess),
        themeVariables: themeList,
    }
    const opt = { ...options, ...params };
    await generateTheme(opt);
}

// 主方法
const writeTheme = async () => {
    try {
        const themeFiles = getThemeFile(themeDir);
        if (!themeFiles || (themeFiles.length === 0)) return;

        // 写入json文件
        writeLessJson(themeFiles);

        // 写入公共less文件
        const curLess = themeFiles.find(v => v === theme + '.less');
        writeCommonLess(curLess);

        // 写入less变量文件
        writeVarFile(themeFiles);
    } catch (e) {
        console.log(e);
    }
}

const initTheme = (options) => {
    theme = options.themeName;
    outputDir = path.join(publicDir, options.outputDir);
    themeDir = options.themeDir;
    JSONDir = options.JSONDir;
}
module.exports = {
    writeTheme,
    initTheme
};