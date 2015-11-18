require.config({
    baseUrl: "http://sjs1.sinajs.cn/astro/xuyuanxing/js/",
    paths: {
         "comment": "pl/commentForm",
         "divselect":"pl/divselect"
    }
});
require(['comment','divselect','comp/eventDispatch','pl/sweetAlert','pl/pageing','pl/commentFaces'],function (comment,divselect,eventDispatch,swal,pageing,commentFaces) {
         
    new divselect('search_type');
    new divselect('times'); 


    function decorate () {        
        // 星级装饰级别
        $.each($('img'),function(i,n) {
            // body...
            if ($(this).attr('decorate_id')==4) {
                $(this).addClass('headborder');
                $(this).parent().next().html("高级星");
                $(this).parent().parent().addClass('decorateshot');
            }
            if ($(this).attr('decorate_id')==3) {
                $(this).addClass('headborder');
                $(this).parent().next().html("中级星");
                $(this).parent().parent().addClass('decoratemid');
            };
        }) 
    } 
        
    // 右侧列表
    var hotlist_tmpl = $('#hotlist_tmpl').html();
         
    $.get($scope.http_host+'/api/?p=wish&s=front&a=get_wish_list&page=1&size=10&order=hit&push=1',function(data){
        var tempFn = doT.template(hotlist_tmpl);
        $('.hot-conntainer').html(tempFn(data.result.data.data));
        
        $('.hot-list-content').each(function(){
            $(this).html(commentFaces.loadFace($(this).html()));
        })
    },"json")

    // 左侧搜索结果
    var qs=location.search.length>0?location.search.substring(1):"";

    var commentlist_tmpl = $('#commentlist_tmpl').html();         

    var API = $scope.http_host+'/api/?p=wish&s=front&a=search&'+qs+'&page=1&size=10';
    var page = 1;
    var pageingObj; 
    var commentData = {}; 

    $('.re_content').html(decodeURI(location.search.substring(qs.indexOf("=")+2)));
    

     $.get(API,function(data){

       var tempFn = doT.template(commentlist_tmpl);
       $('.left_comment').html(tempFn(data.result.data.data))
       $('.re_num').html(data.result.data.total);
       if (data.result.data.total==0) {$('.left_comment').html('<div style="text-align: center;font-size:20px;">暂无相关结果</div>')}
       else{
        commentData = {};
         for(var i=0;i<data.result.data.data.length;i++){
           commentData[data.result.data.data[i].id] = {
               faved:data.result.data.data[i].faved,
               passed:data.result.data.data[i].passed,
               attitude_fav:parseInt(data.result.data.data[i].attitude_fav),
               attitude_pass:parseInt(data.result.data.data[i].attitude_pass)
               }
         }
           $('.txt').each(function(){
               $(this).html(commentFaces.loadFace($(this).html()));
           })
             pageingObj = new pageing({
                 pageCount: data.result.data.pageCount,
                 page: page,
                 dom: $('.leftWrap'),
                 eventInit: true
             })
             // 首页
             pageingObj.addEvent('first',function($targert){
              page = 1 
              API = API.replace(/page=\d*/,'page='+page)
              getData()
             })
             // 尾页
              pageingObj.addEvent('last',function($targert){
              page =  data.result.data.pageCount
              API = API.replace(/page=\d*/,'page='+page)
              getData()
             })
             // 页码
             pageingObj.addEvent('topage',function($targert){
              page = $targert.data('page')
              API = API.replace(/page=\d*/,'page='+page)
              getData()
             })
             // 下一页
              pageingObj.addEvent('next',function($targert){
               page = (page+1)<=data.result.data.pageCount?(page+1):1
              API = API.replace(/page=\d*/,'page='+page)
              getData()
             })
              // 上一页
              pageingObj.addEvent('prev',function($targert){
               page = (page-1)>=1?(page-1):data.result.data.pageCount
              API = API.replace(/page=\d*/,'page='+page)
              getData()
             })
             decorate(); 
              
         document.getElementById("bdshell_js").src = "http://bdimg.share.baidu.com/static/js/shell_v2.js?cdnversion=" + Math.ceil(new Date()/3600000);

       }

       
      
    },"json");

     function getData(){
        $.get(API,function(data){
          var tempFn = doT.template(commentlist_tmpl);
          $('.left_comment').html(tempFn(data.result.data.data));
          pageingObj = new pageing({pageCount:data.result.data.pageCount,page:page,dom:$('.leftWrap')});
          commentData = {};
          for(var i=0;i<data.result.data.data.length;i++){
           commentData[data.result.data.data[i].id] = 
                {faved:data.result.data.data[i].faved,
                passed:data.result.data.data[i].passed,
                attitude_fav:parseInt(data.result.data.data[i].attitude_fav),
                attitude_pass:parseInt(data.result.data.data[i].attitude_pass)
                }
          }
          bdshare();
        },"json")
     }
     // 摸摸
      var eventDis = new eventDispatch($('.left_comment'),'click')

      eventDis.addEvent('like',function($target){
          var id = $target.data('id')
          if(commentData[id].faved==0 && commentData[id].passed==0){
          $.post($scope.http_host+'/wish/?s=front&a=attitude',{item_id:id,attitude:0})
         
          commentData[id].faved=1
          commentData[id].attitude_fav = commentData[id].attitude_fav+1
           $target.find('a').html(commentData[id].attitude_fav)
           $target.addClass('liked')
           addOneEffect($target.find('a'))
          }else if(commentData[id].faved==1){
          $.post($scope.http_host+'/wish/?s=front&a=cancelAttitude',{item_id:id,attitude:0})
          
          commentData[id].faved=0
          commentData[id].attitude_fav = commentData[id].attitude_fav-1  
          $target.find('a').html(commentData[id].attitude_fav)
          $target.removeClass('liked')
          }
      })
      // 呸
      eventDis.addEvent('dislike',function($target){
          var id = $target.data('id')
          if(commentData[id].passed==0 && commentData[id].faved==0){
          $.post($scope.http_host+'/wish/?s=front&a=attitude',{item_id:id,attitude:1})
          
          commentData[id].passed=1
          commentData[id].attitude_pass = commentData[id].attitude_pass+1
          $target.find('a').html(commentData[id].attitude_pass)
          $target.addClass('disliked')
          addOneEffect($target.find('a'))
          }else if(commentData[id].passed==1){
          $.post($scope.http_host+'/wish/?s=front&a=cancelAttitude',{item_id:id,attitude:1})
          
          commentData[id].passed=0
          commentData[id].attitude_pass = commentData[id].attitude_pass-1    
          $target.find('a').html(commentData[id].attitude_pass)
          $target.removeClass('disliked')
          }
      })
      
      function addOneEffect($target){
         $target.css("position","relative");
         var $dom = $("<i style='position: absolute;left: 0;'>+1</i>")
         $target.append($dom)
         $target.find("i").animate({top:'-=20px',opacity:"0.3"},500,function(){
             $dom = null
             $(this).remove()
             $target.css("position","");
         })
     }
     // 分享
     function bdshare () {
     // body...
            var oHead = document.getElementsByTagName('HEAD').item(0);
            var oScript= document.createElement("script"); 
            oScript.type = "text/javascript"; 
            oScript.id="bdshare_js"; 
            oScript.data="type=tools";
            oHead.appendChild(oScript); 

            var oHeado = document.getElementsByTagName('HEAD').item(0); 
            var oScripto= document.createElement("script"); 
            oScripto.type = "text/javascript"; 
            oScripto.id="bdshell_js";                  
            oHeado.appendChild(oScripto); 
            decorate();
            document.getElementById("bdshell_js").src = "http://bdimg.share.baidu.com/static/js/shell_v2.js?cdnversion=" + Math.ceil(new Date()/3600000);

     }
    // 搜索文本框获取焦点
    $("#searchkeyval").focus(function  () {
        // body...
        $(this).attr("value","");

    })
    // 搜索按钮点击事件
    $("#searchkey").click(function  () {
        // body...
        var keyword=$("#searchkeyval").val();
        var location= window.location.href.substring(0,qs.indexOf("?")+1);
        
        window.location.href=location+"?keyword="+keyword;
        // $.get($scope.http_host+'/api/?p=wish&s=front&a=search&keyword='+keyword+'&page=1&size=10',function(data){
        //     var tempFn = doT.template(commentlist_tmpl);
        //     $('.left_comment').html(tempFn(data.result.data.data));
        //     $('.re_num').html(data.result.data.total);
        //     if (data.result.data.total==0) {$('.left_comment').html('<div style="text-align: center;font-size:20px;">暂无相关结果</div>')}
        //     else{
        //       commentData = {};
        //        for(var i=0;i<data.result.data.data.length;i++){
        //          commentData[data.result.data.data[i].id] = {
        //              faved:data.result.data.data[i].faved,
        //              passed:data.result.data.data[i].passed,
        //              attitude_fav:parseInt(data.result.data.data[i].attitude_fav),
        //              attitude_pass:parseInt(data.result.data.data[i].attitude_pass)
        //              }
        //        }
        //          $('.txt').each(function(){
        //              $(this).html(commentFaces.loadFace($(this).html()));
        //          })
        //       pageingObj = new pageing({
        //           pageCount: data.result.data.pageCount,
        //           page: page,
        //           dom: $('.leftWrap'),
        //           eventInit: true
        //       })

        //       // 首页
        //       pageingObj.addEvent('first',function($targert){
        //        page = 1 
        //        API = API.replace(/page=\d*/,'page='+page)
        //        getData()
        //       })
        //       // 尾页
        //        pageingObj.addEvent('last',function($targert){
        //        page =  data.result.data.pageCount
        //        API = API.replace(/page=\d*/,'page='+page)
        //        getData()
        //       })
        //       // 页码
        //       pageingObj.addEvent('topage',function($targert){
        //        page = $targert.data('page')
        //        API = API.replace(/page=\d*/,'page='+page)
        //        getData()
        //       })
        //       // 下一页
        //        pageingObj.addEvent('next',function($targert){
        //         page = (page+1)<=data.result.data.pageCount?(page+1):1
        //        API = API.replace(/page=\d*/,'page='+page)
        //        getData()
        //       })
        //        // 上一页
        //        pageingObj.addEvent('prev',function($targert){
        //         page = (page-1)>=1?(page-1):data.result.data.pageCount
        //        API = API.replace(/page=\d*/,'page='+page)
        //        getData()
        //       })
        //       bdshare ();
        //     }

            
        // },"json")
        
        $('.re_content').html(keyword);
    })
    // 排序条件
    $(".times").change(function(){
        var keyword=$("#searchkeyval").val();
        var orders=$(this).children('option:selected').val();
        $.get($scope.http_host+'/api/?p=wish&s=front&a=search&'+qs+'&page=1&size=10&order='+orders,function(data){
            var tempFn = doT.template(commentlist_tmpl);
            $('.left_comment').html(tempFn(data.result.data.data));
            $('.re_num').html(data.result.data.total);
            new pageing(data.result.data.pageCount,1);
            $('.txt').each(function(){
                $(this).html(commentFaces.loadFace($(this).html()));
            })
            bdshare ();   
        },"json")
        // alert(orders); 

    });
   
 
})