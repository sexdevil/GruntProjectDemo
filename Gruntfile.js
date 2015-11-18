module.exports = function (grunt) {
    //再也不用改路径了
    var root = process.cwd() + "/",
            
        buildConfig = JSON.parse(require('fs').readFileSync('buildConfig.json', 'utf-8'));

    var getRequirejsConfig = require('./getRequirejsConfig'),
    //打包css文件
        cssConfig = require('./getCssConfig')(buildConfig.css),
    //打包js文件，什么都不用改
        requirejsOpt = getRequirejsConfig(),
        cssImport = cssConfig.css_import,
        cssmin = cssConfig.cssmin;
    //配置core文件打包
    var core = buildConfig.core,
        coreSrc = [],
        coreConf;

    for (var i = 0; i < core.length; i++) {

        coreSrc.push('<%=srcRoot%>/js/' + core[i]);
    }

    coreConf = {
        src: coreSrc,
        dest: '<%=destRoot%>/js/core/core.js'
    };

    grunt.initConfig({
        requirejs: requirejsOpt,
        copy: {
            images: {
                cwd: "<%=srcRoot%>/images",
                src: "**",
                expand: true,
                dest: "dest/images/"
            },
            js: {
                cwd: "<%=srcRoot%>/js/",
                src: ['common/**', 'comp/**', 'core/**', 'pl/**', 'tpl/**'],
                expand: true,
                dest: "dest/js/"
            },
            css: {
                cwd: "<%=srcRoot%>/css/",
                src: [],
                expand: true,
                dest: 'dest/temp/'
            },
            html:{
               cwd: "<%=srcRoot%>/html/",
                src: "**",
                expand: true,
                dest: 'dest/html/' 
            }       
        },
        clean: {
            others: {
                src: ['<%=destRoot%>/css/','<%=destRoot%>/html/', '<%=destRoot%>/images/', '<%=destRoot%>/temp/']
            },
            js: {
                src: ['<%=destRoot%>/js/']
            },
            temp: {
                src: ['<%=cssTmp%>','<%=projectRoot%>/jsTmp/','<%=projectRoot%>/cssTmp/']
            }
        },
        css_import: cssImport,
        cssmin: cssmin,
        uglify: {
            core: coreConf
        },
        sprite:{
            all:{
                src:['<%=srcRoot%>/images/pages/images/*.png'],
                dest:'<%=srcRoot%>/images/pages/timeline/icon.sprite.png',
                destCss:'<%=cssRoot%>/module/icon.css',
                padding:10
            }
        },
        
        
      filerev: {     
       
        files:{
           src: ['<%=destRoot%>/css/**/*.css','<%=destRoot%>/js/**/*.js']
        }
        
  },

  


        usemin:{
            html:['<%=destRoot%>/html/*.html'],
            options: {
                    assetsDirs: ['<%=destRoot%>/css/**','<%=destRoot%>/js/**'],
                    blockReplacements: {
          js: function (block) {
            var Filename = block.dest.replace('.js','').replace(/\//g, '\\\\')

          

              var reg = new RegExp(block.dest,'g');
              

             var sFile =process.cwd()+"\\dest\\"+ block.dest.replace(/\//g, '\\')   //require('path').sep是用来获取文件分隔符的，windows下面为\，linux下面为/                   
            

             var dFile = grunt.filerev.summary[sFile]    //记得filerev提到的那个对象么 取出frileRev中的文件名

              var finalName= dFile.substring(dFile.match(Filename).index)
          
                finalName = finalName.replace(/\\/g,'\/')
                
              var src = block.src[0];
             
              return '<script type="text/javascript" src="'+src.replace(reg,finalName)+'"></script>';  // 原地址替换md5文件名 替换完成
              
             },
             css:function(block){
                 
                 var Filename = block.dest.replace('.css','').replace(/\//g, '\\\\')

                     

                 var reg = new RegExp(block.dest,'g');
                  
                 var sFile =process.cwd()+"\\dest\\"+ block.dest.replace(/\//g, '\\')   


                  var dFile = grunt.filerev.summary[sFile]    //记得filerev提到的那个对象么 取出frileRev中的文件名

                 var finalName= dFile.substring(dFile.match(Filename).index)

                 finalName = finalName.replace(/\\/g,'\/')

                var src = block.src[0];

   
              return '<link rel="stylesheet" type="text/css" href="'+src.replace(reg,finalName)+'">'; // 原地址替换md5文件名 替换完成
             }
            }
                 }
        },

        
     

        projectRoot: root,
        srcRoot: "<%=projectRoot%>/src",
        cssRoot: "<%=srcRoot%>/css",
        destRoot: "<%=projectRoot%>/dest",
        cssDest: "<%=destRoot%>/css",
        cssTmp: "<%=destRoot%>/tmp"
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-css-import');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-filerev');
      grunt.loadNpmTasks('grunt-usemin');
   
    //grunt.loadNpmTasks('grunt-spritesmith');

    //grunt.registerTask('p',['sprite:all']);
    grunt.registerTask('allClean', ['clean:js', 'clean:others']);
     grunt.registerTask('default', ['allClean', 'copy', 'requirejs', 'uglify', 'css_import', 'cssmin','filerev','usemin']);
 
 };