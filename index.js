const fs = require('fs');
const path = require('path');
const BASE_DIR = process.argv[process.argv.length - 1];

const maliciousChecks = ['<<', '~', '""', 'fromCharCode', '0x', '\\x', '][', 'eval', '~~', 'charCodeAt', 'z1', 'new RegExp', '()+', '\'\'', 'v5', 'v8', 'v0', '>>>', '^', '|', '>>', 'new Function', 'unescape', 'atob'];

const getAllJsInDirectory = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = getAllJsInDirectory(path.join(dir, file), filelist);
        } else if (file.split('.js')[1] === '') {
            filelist = filelist.concat(path.join(dir, file));
        }
    });
    return filelist;
};

const onlyJS = getAllJsInDirectory(BASE_DIR);

onlyJS.forEach(filepath => {
    const data = fs.readFileSync(filepath, 'utf8');
    let points = 0;
    let redFlags = [];
    maliciousChecks.forEach((badThing) => {
		if (data.toString().indexOf(badThing) !== -1) {
			points += 1;
			redFlags.push(badThing);
        }
    });
    if (points > 3) {
        console.log(`${filepath}: score: ${points}, redflags: ${redFlags}`);
    }
});
