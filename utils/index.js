
export const loadTheme = async (type, theme) => {
    if (window.localTheme) return;
    const theme_type = type || localStorage.getItem('THEME_NAME') || window.global.themeName;
    if (!theme) {
        const modelpath = 'theme/theme.json';
        const res = await import(`../../../public/${modelpath}`);
        theme = res.default[type];
    }
    window.less.modifyVars(theme).then(() => {
        window.localStorage.setItem('THEME_NAME', theme_type);
    }).catch(error => {
        console.error(error);
    });
}

// 切换主题
export const changeTheme = async (name) => {
    try {
        if (window.localTheme) return;
        let type = name;
        let themeContent = {};
        const themeName = localStorage.getItem('THEME_NAME') || window.global.themeName;
        if (!type) {
            const modelpath = 'theme/theme.json';
            const res = await import(`../../../public/${modelpath}`);
            themeContent = res.default;
            const themeList = Object.keys(themeContent).filter(v => v !== themeName);
            const index = Math.floor(Math.random() * themeList.length);
            type = themeList[index];
        }
        loadTheme(type, themeContent[type]);
    } catch (e) {
        console.error(e);
    }
}
// 初始化
export const initTheme = (name) => {
    if (window.localTheme) return;
    let type = name || window.global.themeName;
    if (type === localStorage.getItem('THEME_NAME')) return;
    changeTheme(type);
}