const fs = require('fs');

const fsWrite = (url = '', callback) => {
    if (!url) return;
    const pathList = url.split('\\');
    let index = fileExistsNum(pathList);
    function write() {
        index++;
        // if (index > 0) return;
        if (index >= 0) {
            const filePath = pathList.join('\\');
            callback && callback(filePath);
        } else {
            const filePath = pathList.slice(0, index).join('\\');
            fs.mkdirSync(filePath);
            write();
        }
    }
    write();
};

const fileExistsNum = (pathList = []) => {
    let index = 0;
    function fn() {
        let filePath = '';
        if (index === 0) {
            filePath = pathList.join('\\');
        } else {
            filePath = pathList.slice(0, index).join('\\');
        }
        const flag = fs.existsSync(filePath);
        if (flag) return index;
        index--;
        return fn();
    }
    return fn();
};

const fileWrite = (url = '', content = '', cb) => {
    const callback = (filePath) => {
        fs.writeFile(filePath, content, (err) => {
            if (err) {
                cb && cb(err);
                return;
            }
            cb && cb();
        });
    };
    try {
        fsWrite(url, callback);
    } catch (e) {
        cb && cb(e);
    }
};

const fileWriteSync = (url = '', content = '') => {
    const callback = (filePath) => {
        fs.writeFileSync(filePath, content);
    };
    fsWrite(url, callback);
};

const dirWrite = (url = '') => {
    const callback = (filePath) => {
        fs.mkdirSync(filePath);
    };
    fsWrite(url, callback);
};

const dirWriteSync = (url = '', cb) => {
    const callback = (filePath) => {
        fs.mkdir(filePath, (err) => {
            if (err) {
                cb && cb(err);
                return;
            }
            cb && cb();
        });
    };
    try {
        fsWrite(url, callback);
    } catch (e) {
        cb && cb(e);
    }
};


module.exports = {
    fileWrite,
    fileWriteSync,
    dirWrite,
    dirWriteSync
};