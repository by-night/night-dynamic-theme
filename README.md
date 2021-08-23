### 本项目是基于antd-theme-generator封装的，大大减少其配置代码。在体积几乎不变的同时，避免了刷新时样式闪烁的问题
`github 项目地址：`(https://github.com/by-night/night-dynamic-theme)  
#### 下载  
```
npm install night-dynamic-theme
```
#### 使用说明：  
```
const DynamicTheme = require('night-dynamic-theme');

// 在 webpack 的 plugins 中 
plugins: [
    new DynamicTheme({
        themeDir: ''  // 指定less变量文件的路径, 默认为 src/common/theme，其文件下所有less文件，将作为主题文件
        lessCDN: false  // less.min.js 是否使用CDN加速，默认为false
    })
    ...
]
```
#### 改变主题的方法
```
import { changeTheme } from 'night-dynamic-theme/utils';

changeTheme(); // 可传需要改变的主题名称，不传，则从主题中随机选一个
```
#### 可使用的方法
`changeTheme`: 更换主题的方法（参数为主题方法，非必传）  
`initTheme`: 初始化主题的方法（参数为主题方法，必传）
#### 定义初始主题
在 .env 文件中定义 normal 为初始主题
```
GLOBAL_THEME_NAME = 'normal'
```