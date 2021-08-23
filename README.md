### 动态切换主题工具
`github 项目地址：`(https://github.com/by-night/night-dynamic-theme)  
#### 1. 下载  
```
npm install night-dynamic-theme
```
#### 2. 使用说明：
##### (1) webpack 配置
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
##### (2) 配置less文件, 默认写在 src/common/theme 文件夹中
`normal.less`
```
    @primary: #fff
```
`night.less`

```
    @primary: #000
```
##### (3) 改变主题的方法
```
import { changeTheme } from 'night-dynamic-theme/utils';

changeTheme('night'); // 参数为切换主题名称，不传，则从主题中随机选一个
```
### 3. 其余配置
##### 可使用的方法
`changeTheme`: 更换主题的方法（参数为主题方法，非必传）  
`initTheme`: 初始化主题的方法（参数为主题方法，必传）
#### 定义初始主题
在 .env 文件中定义初始主题，默认为 normal
```
GLOBAL_THEME_NAME = 'normal'
```