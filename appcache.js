var fs = require('fs');
var path = require('path');
var join = path.join;

readIgnore(); // чтение данных об игнорирование при обработке

var args = process.argv.slice(2);
var dirPath = args[0];
var outputPath = args[1] || dirPath;

var files = getFiles(dirPath, []);

fs.writeFileSync(join(outputPath, 'appcache.txt'), files.join('\r\n'));

function getFiles(dir, filelist) {
    var files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        var shortDir = dir.replace(dirPath, '');
        if (shortDir.indexOf('\\') == 0) {
            shortDir = shortDir.substr(1, shortDir.length - 1);
        }
        var fileResult = join(shortDir, file).replace(/\\/g, '/');

        if (isIgnore(dir, file) == false) {
            if (fs.statSync(join(dir, file)).isDirectory()) {
                filelist = getFiles(join(dir, file), filelist);
            }
            else {
                filelist.push(fileResult);
            }
        } else {
            console.log(fileResult + ' is ignore');
        }
    });
    return filelist;
};

/**
 * является ли файл исключением
 * @param root {string} корневой путь
 * @param filePath {string} путь к элементу
 */
function isIgnore(root, filePath) {
    if (fs.statSync(join(root, filePath)).isDirectory()) {
        if (this.ignore.filter(function (i) { return i == filePath || i.indexOf(filePath) == 0 }).length == 0)
            return false;
        else
            return true;
    } else {
        var ext = path.extname(filePath);
        var name = path.basename(filePath);
        if (name.indexOf(' ') < 0) {
            if (this.ignore.filter(function (i) {
                return i == ('*' + ext) || i == name;
            }).length == 0)
                return false;
            else
                return true;
        } else {
            return false;
        }
    }
}

/**
 * чтение информации об игнорирование файлов
 */
function readIgnore() {
    var filePath = join(__dirname, '.ignore');
    if (fs.existsSync(filePath) == true) {
        var txt = fs.readFileSync(filePath, 'utf8');
        this.ignore = txt.split('\r\n');
    } else {
        this.ignore = [];
    }
}