const path = require('path');
const HtmlBeforePlugin = require('night-html-before');
const { writeMain } = require('./global');
const { writeTheme, writeLessJson, watchFile } = require('./theme');

const root = process.cwd();
class DynamicTheme {
    constructor(options = {}) {
        this.options = {
            lessPath: 'theme/less.min.js',
            scriptPath: 'theme/loadTheme.js',
            publicDir: path.join(root, 'public'),  // public 路径
            outputDir: './theme', // 输出到 public底下的路径，默认为 /public/theme,
            JSONDir: path.join(__dirname, './theme'), // 要生成的json路径
            themeName: process.env.REACT_APP_THEME_NAME || 'normal', // 默认打包的主题
            themeDir: path.join(root, options.themeDir || './src/common/theme'), // 主题less变量文件夹
            lessCDN: options.lessCDN || false,  // 是否使用 CDN
            isWatch: options.isWatch || true,  // 是否监听文件更新
        };
        this.paths = [];
        this.init();
    }
    init() {
        // 写入json
        writeLessJson(this.options);
        this.getPaths();
        if (this.options.isWatch && (process.env.NODE_ENV === 'development')) {
            // 文件监听
            watchFile(this.options);
        }
    }
    // 获取插入的js路径
    getPaths () {
        if (this.lessCDN) {
            this.lessPath = "https://cdn.bootcss.com/less.js/2.7.3/less.min.js";
        }
        this.paths = [this.options.scriptPath, this.options.lessPath].map(filePath => '/' + filePath);
    }

    apply(compiler) {
        this.tapAsync(compiler);
        const htmlBefore = new HtmlBeforePlugin({ paths: this.paths });
        htmlBefore.apply(compiler);
    }
    tapAsync (compiler) {
        const isDev = process.env.NODE_ENV === 'development';
        if (isDev) {
            this.run();
            return;
        }
        compiler.hooks.beforeRun.tapAsync('AsyncPlugin', (compilation, cb) => {
            const output = compilation.options.output.path;
            this.options.publicDir = path.join(output);
            this.options.JSONDir = path.join(__dirname, 'theme');
            this.run(cb);
        })
    }
    run (cb) {
        Promise.all([writeTheme(this.options), writeMain(this.options)]).then(res => {
            cb && cb();
        }).catch(err => {
            console.log(err);
            cb && cb();
        });
    }
}

module.exports = DynamicTheme;


