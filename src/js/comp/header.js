;
(function () {
    var loginLayer = window.SINA_OUTLOGIN_LAYER,
        $loginLayer;

    //polyshim:Array.protoytpe.indexOf
    if (!Array.prototype.indexOf) {

        Array.prototype.indexOf = function (value) {

            if ($.isArray(this)) {

                var ret = -1;

                for (var i = 0; i < this.length; i++) {
                    if (this [i] === value) {
                        ret = i;
                    }
                }

                return ret;
            }
        }
    }

    //确保单例
    if (window.$loginLayer) {
        $loginLayer = window.$loginLayer;
    }
    else {
        window.$loginLayer = $(window.SINA_OUTLOGIN_LAYER);
        $loginLayer = window.$loginLayer;
    }

    if (loginLayer) {
        var STK = loginLayer.STK,
            $loginBtn = $('#login_btn'),
            $logoutBtn = $('#logout_btn'),
            $login = $('#login'),
            $logout = $('#logout'),
            $msgWrap = $login.find('div.msg_wrap'),
            $fillTip = $login.find('div.fill_tip');
        STK.Ready(function () {
            loginLayer.set('sso', {
                entry: 'edu'
            }).set('styles', {
                'z-index': 9999
            }).set('plugin', {
                parentNode: document.body,
                position: 'center'
            }).register('login_success', function (data) {

                if(!!data||!!SINA_OUTLOGIN_LAYER.getSinaCookie().uid){
                    var uid = SINA_OUTLOGIN_LAYER.getSinaCookie().uid || data.userinfo.uid 
                 
               $.get($scope.http_host+"/api/?p=wish&s=front&a=wish_userinfo&uid="+uid,function(data){
                 var data = data.result.data;
                 $login.find(".user_info_list").find('li').eq(0).html('<a href="'+$scope.http_host+'/wish/home/" target="_blank"><span class="fl">评论</span><i>'+data.comment_total+'</i></a>')
                 $login.find(".user_info_list").find('li').eq(1).html('<a href="'+$scope.http_host+'/wish/home/" target="_blank"><span class="fl">赞</span><i>'+data.fav_total+'</i></a>')
                 $login.find(".user_info_list").find('li').eq(2).html('<a href="'+$scope.http_host+'/wish/home/?tabname=unpay" target="_blank"><span class="fl">待支付</span><i>'+data.uppay_total+'</i></a>')
                 data.wish_total;
               },'json')
               
                SINA_OUTLOGIN_LAYER.getWeiboInfo({
                  uid: uid,
                  timeout: 30 * 1000,
                  onFailure: function(){},
                  onSuccess: function(rs) {
                    $("#login .thumb_user img").attr("src",rs.data.profile_image_url)
                    if(window.$scope.login_success){
                        window.$scope.login_success(rs.data)
                    }
                  }
                });
               }

                $login.show();
                $logout.hide();


            }).register('logout_success', function () {
                $login.hide();
                $logout.show();
                $msgWrap.find('em').html(0);

                if(window.$scope.logout_success){
                        window.$scope.logout_success()
                    }

                $loginLayer.trigger('logout_complete');

            }).init();

            //针对某些特定页面的修正
            //如果url能匹配到rquery的页面，则从登陆弹窗登陆后后立刻刷新
            //在查询页面，从当前页面打开个人中心
            var url = window.location.href,
                rquery = /yxxq|yxlb|tfks|yxlbbyfswc|lesson/;

            $loginBtn.on('click', function () {

                loginLayer.show();


            });

            if (rquery.exec(url)) {
                $('.user_info_list').find('a').attr('target', '_self');
            }

            $logoutBtn.on('click', function () {
                loginLayer.logout();

                if (rquery.exec(url)) {

                    $loginLayer.on('logout_complete', function () {

                        window.location.reload();
                    });
                }
            });
            $login.on('mouseenter', 'div.user_info_wrap', function () {
                $(this).addClass('active');
            }).on('mouseleave', 'div.user_info_wrap', function () {
                $(this).removeClass('active');
            });
            $msgWrap.on('mouseenter', function () {
                $(this).addClass('active');
            }).on('mouseleave', function () {
                $(this).removeClass('active');
            });
        })
    }

      $('#searchSubmit').on('click',function(){
           var key = $("#search_type").val()
           window.open($scope.http_host+'/wish/search/?'+key+'='+$('#searchBar .searchText').val(),'_blank')         
      })
      $("#searchBar .searchText").on('keyup',function(e){
          if(e.keyCode==13){
             var key = $("#search_type").val()
           window.open($scope.http_host+'/wish/search/?'+key+'='+$('#searchBar .searchText').val(),'_blank')  
          }
      })
         
})();