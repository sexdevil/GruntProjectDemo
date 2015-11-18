
define(['pl/commentFaces','comp/horoscopeMap','divselect'],
function(commentFaces,horoscopeMap,divselect){
 
function warning(text,$target,onclick){
      var warningHTML = '<div class="user-post-form-pop" style="padding:26px;width:180px;color:#b5b5b5;font-size:18px;'+
        'text-align:center;display:block;left: 50%;margin-left: -90px;bottom: 200px;">'+text+'<i node-type="user-post-form-pop-close" class="user-post-form-pop-close"></i></div>'
      var warnDom = $(warningHTML)
      if(!!onclick){
          $(warnDom).on('click',function(){
              onclick(this);
          })
      }   
       $target.append(warnDom)
  } 
  
  var postAPI = $scope.http_host+'/api/?p=wish&s=item&a=add';
   
   
  

  var faceHTML = '<div class="user-post-form-pop"><div class="user-face-list clearfix"></div><i node-type="user-post-form-pop-close" class="user-post-form-pop-close"></i></div>'
  
  var events = {
      'user-post-form-close':[function($target){
          $target.closest('.user-post-form').hide();
          $('.user-post-form-overlay').hide()
          return true;
      }],
      'user-post-form-pop-close':[function($target){
          $target.closest('.user-post-form-pop').hide()     
          return false;
      }],
      'stars-show':[function($target){
        $('.user-bar-1 .user-post-form-pop').hide()
        $target.find('.user-post-form-pop').show()
      }],
      'initface':[function($target){
        var $faceDom = $target.find('.user-post-form-pop');
        if ($faceDom.length==0) {
                        var $faceDom = $(faceHTML);
                        $($target).append($faceDom);
                        $faceDom.find('.user-face-list').append(commentFaces.renderAllFaces())  
                        $faceDom.css('margin-top','-350px')
        }  
        $faceDom.show();     
      }],
      'addFace':[function($target){
          var content= $("#user-bar-content").val()
          $("#user-bar-content").val(content+$target.attr('data-bind')) 
          $target.closest('.user-post-form-pop').hide();
      }] 
  }
  
  function eventsRegister(actionname,callback){
      if(!!!events[actionname]){
          events[actionname] = [];
      }
       events[actionname].push(callback)
  }
 
  
  //事件名--回调函数 key value
            $('.user-post-form').on('click', function(e) {
                var target = $(e.target).closest('[node-type]')
                var nodeType = target.attr('node-type');
                if (events[nodeType]) {
                    for (var i = 0; i < events[nodeType].length; i++) {
                        var s = events[nodeType][i](target);
                        if (!s) {
                            e.stopPropagation();
                        }
                    }
                }
            })
    //form 事件冒泡 
  
  //formpost 事件  
   ;(function(){
   function postForm(data){   
       var postData = data
       $.ajax({
        async: false,
        url: postAPI,
        data:data,
        type: "post",
        dataType: 'json',
        jsonp: 'callback',
        success: function(data) {
            if(data.result.status.code==0){
                $('#user-bar-content').val('')
                if(postData.sort==1){
                    var timeout = window.setTimeout(function(){
                         window.open($scope.http_host+'/wish/item/'+data.result.data.item_id,'_self')
                       },2000);
                    warning('发布成功!2s后自动打开详情页',$('.user-post-form'),function(that){
                    $(that).remove();
                  })
                   return;
                }
                var payForm = $("<form action='"+$scope.http_host+"/wish/handler/' method='post' target='_self'>"
                                                        + "<input type='hidden' name='item_id' value='" + data.result.data.item_id + "'/>"
                                                        + "<input type='hidden' name='decorate_id' value='" + postData.decorate_id + "'/>"
                                                        + "<input type='hidden' name='type' value='0'/>"
                                                        + "<input type='hidden' name='num' value='1'/>"
                                                        + "</form>")
                  var payFormDom= $(payForm)
                  $(document.body).append(payFormDom)
                  payFormDom[0].submit();
                  payFormDom.remove();
                  warning('发布成功!',$('.user-post-form'),function(that){
                    $(that).remove();                                              
                }) 
          
            }else{
               warning(data.result.status.msg,$('.user-post-form'))     
            }     
        }
        }) 
   }
   
  
   
  function formcheck(){
      if(!/\S/.test($('#user-bar-content').val())){
         warning('额，没有填写内容~',$('.user-post-form'))
          return false
      }
     
      return true;
  }
  eventsRegister('user-post-form-pop-del',function($target){
      $target.closest('.user-post-form-pop').remove()  
  })
  
  eventsRegister('user-post-form-outter',function($target){
      $target.find('.user-post-form-pop').hide()
  })
  
  eventsRegister('formpost',function($target){
      if(!formcheck()){
          return
      }
       var data ={};
      data.content = $('#user-bar-content').val()
      data.type=$('#user-xuyuan-switch-l .on[node-type=user-xuyuan-switch]').attr('data-bind')
      data.decorate_id = $('.user-bar-1 input:checked').attr('data-id')
      data.sort = $('.user-bar-1 input:checked').attr('data-sort')
      data.anonymous = $('#noname').is(':checked')?1:0;
      data.comment_deny = $('#comment_deny').is(':checked')?1:0;
      data.anonymous = $('#noname').is(':checked')?1:0;
      data.weibo_share=$('#weibobox').is(':checked')?1:0;
      data.horoscope=$('#astro1').val();
      data.wished_horoscope = $('#astro2').val();
      data.wished_user = $('#wished_user').val();
      if(!window.SINA_OUTLOGIN_LAYER.isLogin()){
        window.SINA_OUTLOGIN_LAYER.show()
        window.SINA_OUTLOGIN_LAYER.getNodes().box.style.zIndex='29999';
        return
      }
      postForm(data)
  })
  })();
    
    
    
 $('#user-xuyuan-switch-l div[node-type=user-xuyuan-switch]').on('click',function(){
       $("#user-xuyuan-switch-l .on").removeClass('on')
       $(this).addClass('on')
       if($(this).attr('data-bind')=='1'){
           $('#weibobox').parent().hide()
           $('#noname').prop("checked",true);
           $('#noname').on('click',noclick)
       }else{
           $('#weibobox').parent().show()
           $('#noname').prop("disabled",false);
             $('#noname').off('click',noclick)
       }
   })

    function noclick(e){
       e.preventDefault();
    }
    
    for(var key in horoscopeMap){
        $("select[name='astro']").append('<option value="'+key+'">'+horoscopeMap[key]+'</option>')
    }
   
     
     
    
    
    
    
   
   

return null;

})

