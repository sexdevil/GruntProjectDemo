# GruntProjectDemo
新浪门户Grunt类型项目的配置范例 包括require打包 css打包 md5打包 模板发布

grunt任务及功能
'allClean',//清理
'copy', 复制调试代码到dest发布目录
'requirejs', 根据r.js合并
'uglify', 压缩
'css_import', 'cssmin', css合并压缩
'filerev', 加md5
'usemin' 替换html中的引用

html中格式注意
要打包成md5的链接用如下注释包裹

  <!-- build:css css/common/public.css-->
       <link rel="stylesheet" href="http://n.sinaimg.cn/astro/xuyuanxing/css/common/public.css?ver={=$cssVer=}">
            <!-- endbuild -->
            
              <!-- build:js js/pages/peep.js-->
          <script src="http://n.sinaimg.cn/astro/xuyuanxing/js/pages/peep.js"></script>
          <!-- endbuild -->
            
            <!-- build:文件类型 相对于根目录的地址文件名，用于查找文件，重要-->
              中间包裹一个外引链接，因为combo功能我们用require，import实现，所以这么配置
             <!-- endbuild -->
             
运行后 结果如下
 <link rel="stylesheet" type="text/css" href="http://n.sinaimg.cn/astro/xuyuanxing/css/pages/peep.0660a012.css?ver={=$cssVer=}">
 <script type="text/javascript" src="http://n.sinaimg.cn/astro/xuyuanxing/js/pages/peep.54531dc0.js"></script>
