require.config({
    baseUrl: "http://sjs1.sinajs.cn/astro/xuyuanxing/js/",
    paths: {
         "comment":"pl/commentForm",
         "divselect":"pl/divselect"
    }
});
require(['comment','divselect','comp/eventDispatch','pl/sweetAlert','pl/pageing','pl/commentFaces'],function (comment,divselect,eventDispatch,swal,pageing,commentFaces) {
         
    new divselect('search_type'); 
         
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
    // 左侧排行榜结果
    var qs=location.search.length>0?location.search.substring(1):"";
    var commentlist_tmpl = $('#commentlist_tmpl').html();    

    var API = $scope.http_host+'/api/?p=wish&s=front&a=get_wish_list&order=hit_day&page=1&size=10';
    var page = 1;
    var pageingObj; 
    var commentData = {};
    console.log(API)
    $.each($('.tri'),function  (i,n) {
        // body...
        $(this).css('display','none');
        console.log(i);
        if (i==0) {
            $(this).css('display','inline');
        };
    })
    $.ajax({
        type: 'GET',
        url: API ,
        async: false,
        
        dataType: 'JSON',

        success: function(data){
                    var tempFn = doT.template(commentlist_tmpl);
                    console.log(data);
                    if (data.result) {
                        $('.left_comment').html(tempFn(data.result.data.data));
                        $('.txt').each(function(){
                            $(this).html(commentFaces.loadFace($(this).html()));
                        })
                        commentData = {};
                        for(var i=0;i<data.result.data.data.length;i++){
                        commentData[data.result.data.data[i].id] = 
                            {faved:data.result.data.data[i].faved,
                            passed:data.result.data.data[i].passed,
                            attitude_fav:parseInt(data.result.data.data[i].attitude_fav),
                            attitude_pass:parseInt(data.result.data.data[i].attitude_pass)
                            }
                        }
                    }      
           
         
                    decorate();
                    document.getElementById("bdshell_js").src = "http://bdimg.share.baidu.com/static/js/shell_v2.js?cdnversion=" + Math.ceil(new Date()/3600000);

                },
        error: function() {
                console.log("获取失败！");
              }
    }); 
    

     function getData(API){
        $.ajax({
            type: 'GET',
            url: API ,
            async: false,
            
            dataType: 'JSON',

            success: function(data){
                        var tempFn = doT.template(commentlist_tmpl);
                        console.log(data);
                        if (data.result) {
                            $('.left_comment').html(tempFn(data.result.data.data));
                            commentData = {};
                            for(var i=0;i<data.result.data.data.length;i++){
                            commentData[data.result.data.data[i].id] = 
                                {faved:data.result.data.data[i].faved,
                                passed:data.result.data.data[i].passed,
                                attitude_fav:parseInt(data.result.data.data[i].attitude_fav),
                                attitude_pass:parseInt(data.result.data.data[i].attitude_pass)
                                }
                            }
                        } 
                        

                        bdshare();
               
                    },
            error: function() {
                    console.log("获取失败！");
                  }
        }); 
        
     }
  
   
    // 点击发布
    $('#main-wish').on('click',function(){
            var left = $(this).position().left;
            var top = $(this).position().top;
            $('.user-post-form').css('left',left-800);
            $('.user-post-form').css('top',top-100);
            $('.user-post-form').show();
            $('.user-post-form-overlay').show()

            new divselect('astro1', '', 'selectview-postform')
            new divselect('astro2', '', 'selectview-postform');           
    })
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
    // 24小时热门
    $('#hourhot').on('click',function(){
        $('.hot').removeClass("cur");
        $(this).parent().addClass("cur");
        $.each($('.tri'),function  (i,n) {
            // body...
            $(this).css('display','none');
            if (i==0) {
                $(this).css('display','inline');
            };
        })
        getData(API);      
    })
    // 每周热评
    $('#weekhot').on('click',function(){
        $('.hot').removeClass("cur");
        $(this).parent().addClass("cur"); 
        $.each($('.tri'),function  (i,n) {
                // body...
                $(this).css('display','none');
                console.log(i);
                if (i==1) {
                    $(this).css('display','inline');
                };
            })
        API=$scope.http_host+'/api/?p=wish&s=front&a=get_wish_list&order=hit_week&page=1&size=10';
         getData(API);  
    })
    // 每月热评
    $('#monthhot').on('click',function(){
        $('.hot').removeClass("cur");
        $(this).parent().addClass("cur");  
        $.each($('.tri'),function  (i,n) {
                // body...
                $(this).css('display','none');
                console.log(i);
                if (i==2) {
                    $(this).css('display','inline');
                };
            })
        API=$scope.http_host+'/api/?p=wish&s=front&a=get_wish_list&order=hit_month&page=1&size=10';
        getData(API);             
    })
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
})