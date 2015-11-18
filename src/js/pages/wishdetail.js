require.config({
    baseUrl: "http://sjs1.sinajs.cn/astro/xuyuanxing/js/",
    paths: {
         "comment":"comp/comment3",
         "divselect":"pl/divselect"
    }
});
require(['comment','divselect','comp/eventDispatch','pl/sweetAlert','pl/commentFaces'],function (comment,divselect,eventDispatch,swal,commentFaces) {
     new divselect('search_type'); 
     
    $(".msgbox .content").html(commentFaces.loadFace($(".msgbox .content").html()))
    
     $('.quick_reply_c a').on('click',function(){
          $('.sina-comment-wrap textarea[comment-type=cont]').val($(this).data('comment_content'))       
          window.___sinacMNT___.submitComment()
     })
    var timeout = null;
    var viewData = function() {
        var e = 0, l = 0, i = 0, g = 0, f = 0, m = 0;
        var j = window, h = document, k = h.documentElement;
        e = k.clientWidth || h.body.clientWidth || 0;
        l = j.innerHeight || k.clientHeight || h.body.clientHeight || 0;
        g = h.body.scrollTop || k.scrollTop || j.pageYOffset || 0;
        i = h.body.scrollLeft || k.scrollLeft || j.pageXOffset || 0;
        f = Math.max(h.body.scrollWidth, k.scrollWidth || 0);
        m = Math.max(h.body.scrollHeight, k.scrollHeight || 0, l);
        return {scrollTop: g, scrollLeft: i, documentWidth: f, documentHeight: m, viewWidth: e, viewHeight: l};
    }

    $(window).on('scroll', function() {
        if (timeout) {
            window.clearTimeout(timeout);
        } 
            var vd = viewData();
            timeout = window.setTimeout(function() {
                if(vd.viewHeight + vd.scrollTop + 500 >= vd.documentHeight && (!!window.___sinacMNT___.getMoreLatest)){
                     window.___sinacMNT___.getMoreLatest()
                }
            }, 100)
        
    })
    
    var wishInfo =eval($('script[data-name=wishInfo]').html())
    var item_id = wishInfo[0]
    var faved =  wishInfo[1]
    var passed =  wishInfo[2]
    var exposed = wishInfo[3]
    var horoscope = wishInfo[4]
    var uid = wishInfo[5]
    var pay =  wishInfo[6]==1?false:true

    //提交评论成功回调
    window.___sinacMNT___.commentCallback = function(data,content){
        var data = {mid:data.result.id,
                    uid:data.result.user.id,
                    item_id:item_id,
                    content:content
                  }
        $.post($scope.http_host+'/api/?p=wish&s=front&a=comment_call',data)
     }


    //右侧列表
    var hotlist_tmpl = $('#hotlist_tmpl').html();
    
    $.get($scope.http_host+'/api/?p=wish&s=front&a=get_wish_list&push=1&page=1&size=10&horoscope='+horoscope+'&order=hit',function(data){
       var tempFn = doT.template(hotlist_tmpl)
       var html = tempFn(data.result.data.data)
       html = commentFaces.loadFace(html);
       $('.hot-conntainer').html(html)
    },'json')
    
    var eventlikebar=new eventDispatch($('#likebar'),'click')
    var iflike=-1; // -1 未表态 0赞 1踩
    if(faved){
        iflike = 0;
        $('#likebar .like').addClass('liked')
    }else if(passed){
        iflike = 1; 
         $('#likebar .dislike').addClass('disliked')
    }
    
    eventlikebar.addEvent('comment',function(){
        var top= $('#SI_FormList2').offset().top - 40;
        window.scrollTo(0,top)
    })
    eventlikebar.addEvent('like',function($target){
        if(iflike!=1){           
            if(iflike==-1){  
            iflike = 0;     
            $target.addClass('liked')
            $.post($scope.http_host+'/wish/api/?s=front&a=attitude',{item_id:item_id,attitude:0},'json')    
            $target.html(parseInt($target.html())+1)
            addOneEffect($target)
            }else if(iflike==0){ 
            iflike = -1;     
            $target.removeClass('liked')
            $.post($scope.http_host+'/wish/api/?s=front&a=cancelAttitude',{item_id:item_id,attitude:0},'json')  
            $target.html(parseInt($target.html())-1)
            }
        }  
    })
    eventlikebar.addEvent('dislike',function($target){
        if(iflike!=0){
            if(iflike==-1){  
            iflike = 1;     
            $target.addClass('disliked')
            $target.html(parseInt($target.html())+1)
            $.post($scope.http_host+'/wish/api/?s=front&a=attitude',{item_id:item_id,attitude:1},'json')
            addOneEffect($target)
            }else if(iflike==1){ 
            iflike = -1;     
            $target.removeClass('disliked')
            $target.html(parseInt($target.html())-1)
            $.post($scope.http_host+'/wish/api/?s=front&a=cancelAttitude',{item_id:item_id,attitude:1},'json')   
            }
        }
    })
    
    function addOneEffect($target){
        $target.css("position","relative");
        var $dom = $("<span style='position: absolute;left: 50%;'>+1</span>")
        $target.append($dom)
        $target.find("span").animate({top:'-=20px',opacity:"0.3"},500,function(){
            $dom = null
            $(this).remove()
            $target.css("position","");
        })
    }
   
    $("#exposeBtn").on('click',function(){
         if (exposed == 0) {
         var s = swal({confirmButtonText: '确定', confirmButtonCSS: '', cancleButtonText: '取消', cancleButtonCSS: '', content: '举报该用户发布了不适内容?'});
                    s.addEvents('cancle', function() {
                        s.close();
                    })
                    s.addEvents('confirm', function() {
                    s.close();
                $.post($scope.http_host+'/wish/api/?s=front&a=attitude', {item_id: item_id, attitude: 2}, 'json')
                exposed = 1
                 var s1=swal({confirmButtonText: '确定', confirmButtonCSS: '', cancleButtonText: '取消', cancleButtonCSS: '', content: '举报成功'});
                 s1.addEvents('cancle', function() {
                        s.close();
                    })
                  s1.addEvents('confirm', function() {
                        s.close();
                    })
               })   
          }
    })
    
    var commentId =eval($('script[data-name=comment_id]').html())[0]
      ;(function(exports){
        var $ = exports.___sinacMNT___;
        var FormList12 = new $.cmnt.FormList('SI_FormList2',{
            channel:'xz',
            // 多评论
            newsid:commentId,
            parent:'',
            encoding:'utf-8'
        },{
            channel: 'xz',
            // 多评论
            newsid:commentId,
            //style=1本来为皮肤，应该为group=1
            group: 0,
            encoding:'utf-8',
            page: 1,
            pageSize: 20,
             // 隐藏评论列表
            hideList:0,

            // 最新评论默认显示条数
            hotPageNum:5,
            // 最新评论默认显示条数
            firstPageNum:5,
            // 可点击最新评论正文“更多评论”按钮次数,达到该次数后，显示“查看更多评论”链接，再点击则跳转
            clickMoreTimes:3,
            
            xuyuandata:{uid:uid,pay:pay},
            
            loaded:function (self){           
            }
        },{});
    })(window);

})