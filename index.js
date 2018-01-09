const fs = require('fs');
const path = require('path');
const BASE_DIR = process.argv[process.argv.length - 1];

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        filelist = fs.statSync(path.join(dir, file)).isDirectory()
        ? walkSync(path.join(dir, file), filelist)
        : filelist.concat(path.join(dir, file));
    });
    return filelist;
};

const onlyJS = walkSync(BASE_DIR).filter(f => f.split('.js')[1] === '');

console.log(onlyJS);