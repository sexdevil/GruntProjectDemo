/**
 * Created by Ellery1 on 15/4/23.
 */

var getCssConfigs = function (files) {
    debugger;
    var exists = require('fs').existsSync;
            var pathObj = require('path')
            var filesList =[]
    
        var root = process.cwd() + "/",
        srcRoot = root + "src/",
        destRoot = root + "dest/",
        cssSrc = srcRoot + "css/",
        cssTmp = destRoot + "tmp/",
        cssDest = destRoot + "css/";
    
    var fs = require('fs');
      var walk = function(path){
          var staticPath = cssSrc+path
          var stat = fs.statSync(staticPath);
            if (stat.isDirectory()) {
            var f = fs.readdirSync(staticPath)
                f.forEach(function(item) {
                var tmpPath = path +'/'+ item;
                if(/css/.test(tmpPath)){
                filesList.push(tmpPath);
                }
            });  
            }else{
                if(/css/.test(path)){
                filesList.push(path)
               }
            }
         
        };  
        for(var i=0;i<files.length;i++){        
             walk(files[i]) 
        }
        
 


    var cssImportConfig = {
            all: {
                files: {}
            }
        },
        cssminConfig = {
            options: {
                compatibility: 'ie7' //设置兼容模式
            },
            all: {
                files: {}
            }
        };

    var pathArr = [];

    for (var i = 0; i < filesList.length; i++) {
      
        var file = filesList[i];  
         
        var src = cssSrc + file,
            tmp = cssTmp + file,
            dest = cssDest + file;
                     
        if (exists(src)) {

            pathArr.push({
                src: cssSrc + file,
                tmp: cssTmp + file,
                dest: cssDest + file
            });
        }
        else {

            throw new Error(file + ': 文件路径不正确.');
        }
    }

    for (i = 0; i < pathArr.length; i++) {

        var pathObj = pathArr[i];
        cssImportConfig.all.files[pathObj.tmp] = [pathObj.src];
        cssminConfig.all.files[pathObj.dest] = [pathObj.tmp];
    }

    return {
        css_import: cssImportConfig,
        cssmin: cssminConfig
    }
};

module.exports = getCssConfigs;