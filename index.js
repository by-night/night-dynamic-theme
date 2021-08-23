const path = require('path');
const HtmlBeforePlugin = require('night-html-before');
const { initGlobal, writeScript, getLessMin } = require('./global');
const { writeTheme, initTheme } = require('./theme');

const root = process.cwd();

class DynamicTheme {
    constructor(options = {}) {
        this.options = {
            lessPath: 'theme/less.min.js',
            scriptPath: 'theme/loadTheme.js',
            outputDir: './theme', // 输出到 public底下的路径，默认为 /public/theme,
            JSONDir: path.join(root, './public/theme'), // 要生成的json路径
            themeName: process.env.GLOBAL_THEME_NAME || 'normal', // 默认打包的主题
            themeDir: path.join(root, options.themeDir || './src/common/theme'), // 主题less变量文件夹
            lessCDN: options.lessCDN || false,  // 是否使用 CDN
        };
        this.paths = [];
        this.init();
    }

    init() {
        // 工具类全局变量初始化
        initGlobal(this.options);
        // 全局变量初始化
        initTheme(this.options);

        // 生成less文件
        writeTheme();

        // 在public创建js引用
        const result = [
            writeScript(this.options.scriptPath),
            getLessMin(this.options.lessPath)
        ]
        this.paths = result;
    }

    apply(compiler) {
        const htmlBefore = new HtmlBeforePlugin({ paths: this.paths });
        htmlBefore.apply(compiler);
    }
}

module.exports = DynamicTheme;


