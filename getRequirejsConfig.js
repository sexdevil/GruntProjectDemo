/**
 * Created by Ellery1 on 15/4/14.
 */
module.exports = function () {

    var readdir = require('fs').readdirSync;

    var requirejsOpt = {},
    //如果想自己测试构建脚本请修改这个路径为自己的项目根路径
        root = process.cwd() + "/",
        src = root + 'src/',
        dest = root + 'dest/',
        jsSrc = src + 'js/',
        jsDest = dest + 'js/';

    var folders = readdir(jsSrc + 'pages/');

    for (var i = 0; i < folders.length; i++) {

        var folder = folders[i],
            mainfilesSrc,
            mainfilesDest;

        var rfilename = /^.*\.js$/,
            rdisk = /^\s*\w:/;

        var files, file;

        if (rfilename.exec(folder)) {

            file = folder;
            mainfilesSrc = jsSrc + "pages/";
            mainfilesDest = jsDest + "pages/";

            requirejsOpt[mainfilesSrc.replace(rdisk, '') + file] = {
                options: {
                    baseUrl: jsSrc,
                    mainConfigFile: mainfilesSrc + file,
                    include: ['pages/' + file.replace('.js', '')],
                    out: mainfilesDest + file
                }
            };
        }
        else {

            mainfilesSrc = jsSrc + 'pages/' + folder + "/";
            mainfilesDest = jsDest + 'pages/' + folder + '/';
            files = readdir(mainfilesSrc);

            for (var j = 0; j < files.length; j++) {

                file = files[j];

                var matched = rfilename.test(file);

                if (matched) {

                    requirejsOpt[mainfilesSrc.replace(rdisk, '') + file] = {
                        options: {
                            baseUrl: jsSrc,
                            mainConfigFile: mainfilesSrc + file,
                            include: ['pages/' + folder + "/" + file.replace('.js', '')],
                            out: mainfilesDest + file
                        }
                    };
                }
            }
        }
    }

    return requirejsOpt;
};