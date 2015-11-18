require.config({
    baseUrl: "http://sjs1.sinajs.cn/astro/xuyuanxing/js/",
    paths: {
        "comment": "pl/commentForm",
        "divselect": "pl/divselect"
    }
});
require(['divselect', 'pl/pageing', 'comp/horoscopeMap', 'comp/eventDispatch', 'pl/commentFaces', 'comment'], function(divselect, pageing, horoscopeMap, eventDispatch, commentFaces, comment) {
    
    new divselect('search_type');

    new divselect('timeSel');

    for (var key in horoscopeMap) {
        $("#HorSel").append('<option value="' + key + '">' + horoscopeMap[key] + '</option>')
    }
    new divselect('HorSel');

    new divselect('PriceSel');

    var API = $scope.http_host + '/api/?p=wish&s=front&a=get_wish_list&page=1&size=10';
    var page = 1;
    var pageingObj;
    var commentData = {};

    var comment_tmpl = $('#comment_tmpl').html();

    $.get(API, function(data) {
        if (data.result.data.total == 0) {
            $('#commentContain').html('暂无相关结果')
            return;
        }
        var tempFn = doT.template(comment_tmpl)
        $('#commentContain').html(tempFn(data.result.data.data))
        $('.txt span[comment-type=itemcontent]').each(function() {
            $(this).html(commentFaces.loadFace($(this).html()))
        })
        pageingObj = new pageing({
            pageCount: data.result.data.pageCount,
            page: page,
            dom: $('.leftWrap'),
            eventInit: true
        })
        commentData = {};
        for (var i = 0; i < data.result.data.data.length; i++) {
            commentData[data.result.data.data[i].id] = {
                faved: data.result.data.data[i].faved,
                passed: data.result.data.data[i].passed,
                attitude_fav: parseInt(data.result.data.data[i].attitude_fav),
                attitude_pass: parseInt(data.result.data.data[i].attitude_pass)
            }
        }

        pageingObj.addEvent('first', function($targert) {
            page = 1
            API = API.replace(/page=\d*/, 'page=' + page)
            getData()
        })
        pageingObj.addEvent('last', function($targert) {
            page = data.result.data.pageCount
            API = API.replace(/page=\d*/, 'page=' + page)
            getData()
        })

        pageingObj.addEvent('topage', function($targert) {
            page = $targert.data('page')
            API = API.replace(/page=\d*/, 'page=' + page)
            getData()
        })

        pageingObj.addEvent('next', function($targert) {
            page = (page + 1) <= data.result.data.pageCount ? (page + 1) : 1
            API = API.replace(/page=\d*/, 'page=' + page)
            getData()
        })
        pageingObj.addEvent('prev', function($targert) {
            page = (page - 1) >= 1 ? (page - 1) : data.result.data.pageCount
            API = API.replace(/page=\d*/, 'page=' + page)
            getData()
        })

        var oHeado = document.getElementsByTagName('HEAD').item(0);
        var oScripto = document.createElement("script");
        oScripto.type = "text/javascript";
        oScripto.id = "bdshell_js";
        oHeado.appendChild(oScripto);
        document.getElementById("bdshell_js").src = "http://bdimg.share.baidu.com/static/js/shell_v2.js?cdnversion=" + Math.ceil(new Date() / 3600000);

    },'jsonp')



    function getData() {
        $('#commentContain').html('loading...')
        window.scrollTo(0,0)
        $.get(API, function(data) {
            if (data.result.data.total == 0) {
                $('#commentContain').html('暂无相关结果')
                return;
            }
            var tempFn = doT.template(comment_tmpl);
            $('#commentContain').html(tempFn(data.result.data.data));
            $('.txt span[comment-type=itemcontent]').each(function() {
                $(this).html(commentFaces.loadFace($(this).html()))
            })
            pageingObj = new pageing({
                pageCount: data.result.data.pageCount,
                page: page,
                dom: $('.leftWrap'),
                eventInit: false
            });
            commentData = {};
            for (var i = 0; i < data.result.data.data.length; i++) {
                commentData[data.result.data.data[i].id] = {
                    faved: data.result.data.data[i].faved,
                    passed: data.result.data.data[i].passed,
                    attitude_fav: parseInt(data.result.data.data[i].attitude_fav),
                    attitude_pass: parseInt(data.result.data.data[i].attitude_pass)
                }
            }
            var oHeado = document.getElementsByTagName('HEAD').item(0);
            var oScripto = document.createElement("script");
            oScripto.type = "text/javascript";
            oScripto.id = "bdshell_js";
            oHeado.appendChild(oScripto);
            document.getElementById("bdshell_js").src = "http://bdimg.share.baidu.com/static/js/shell_v2.js?cdnversion=" + Math.ceil(new Date() / 3600000);

        },'json')
    }

    $("#HorSel").on('change', function() {
        if (/horoscope=\d*/.test(API)) {
            API = API.replace(/horoscope=\d*/, 'horoscope=' + $(this).val())
        } else {
            API = API + "&horoscope=" + $(this).val()
        }
        if ($(this).val() == '00') {
            API = API.replace(/&horoscope=\d*/, ' ')
        }

        getData();
    });
    $("#PriceSel").on('change', function() {
        if (/decorate_id=\d*/.test(API)) {
            API = API.replace(/decorate_id=\d*/, 'decorate_id=' + $(this).val())
        } else {
            API = API + "&decorate_id=" + $(this).val()
        }
        if ($(this).val() == '00') {
            API = API.replace(/&decorate_id=\d*/, ' ')
        }

        getData();
    });
    $("#timeSel").on('change', function() {
        var deltaTime = $(this).val()
        var stime = parseInt((new Date()).getTime() / 1000) - deltaTime
        if (/stime=\d*/.test(API)) {
            API = API.replace(/stime=\d*/, 'stime=' + stime)
        } else {
            API = API + "&stime=" + stime
        }
        if ($(this).val() == '00') {
            API = API.replace(/&stime=\d*/, ' ')
        }
        getData();
    });

    var eventDis = new eventDispatch($('#commentContain'), 'click')

    eventDis.addEvent('like', function($target) {
        var id = $target.data('id')
        if (commentData[id].faved == 0 && commentData[id].passed == 0) {
            $.post($scope.http_host + '/wish/?s=front&a=attitude', {
                item_id: id,
                attitude: 0
            })

            commentData[id].faved = 1
            commentData[id].attitude_fav = commentData[id].attitude_fav + 1
            $target.find('a').html(commentData[id].attitude_fav)
            $target.addClass('liked')
            addOneEffect($target.find('a'))
        } else if (commentData[id].faved == 1) {
            $.post($scope.http_host + '/wish/?s=front&a=cancelAttitude', {
                item_id: id,
                attitude: 0
            })

            commentData[id].faved = 0
            commentData[id].attitude_fav = commentData[id].attitude_fav - 1
            $target.find('a').html(commentData[id].attitude_fav)
            $target.removeClass('liked')
        }
    })

    eventDis.addEvent('dislike', function($target) {
        var id = $target.data('id')
        if (commentData[id].passed == 0 && commentData[id].faved == 0) {
            $.post($scope.http_host + '/wish/?s=front&a=attitude', {
                item_id: id,
                attitude: 1
            })

            commentData[id].passed = 1
            commentData[id].attitude_pass = commentData[id].attitude_pass + 1
            $target.find('a').html(commentData[id].attitude_pass)
            $target.addClass('disliked')
            addOneEffect($target.find('a'))
        } else if (commentData[id].passed == 1) {
            $.post($scope.http_host + '/wish/?s=front&a=cancelAttitude', {
                item_id: id,
                attitude: 1
            })

            commentData[id].passed = 0
            commentData[id].attitude_pass = commentData[id].attitude_pass - 1
            $target.find('a').html(commentData[id].attitude_pass)
            $target.removeClass('disliked')
        }
    })

    function addOneEffect($target) {
        $target.css("position", "relative");
        var $dom = $("<i style='position: absolute;left: 0;'>+1</i>")
        $target.append($dom)
        $target.find("i").animate({
            top: '-=20px',
            opacity: "0.3"
        }, 500, function() {
            $dom = null
            $(this).remove()
            $target.css("position", "");
        })
    }

    //绑定开关userpostform
    $('#rightPost').on('click', function() {
        var left = $(this).position().left;
        var top = $(this).position().top;
        $('.user-post-form').css('left', '50%');
        $('.user-post-form').css('top', top - 200);
         $('.user-post-form').css('margin-left', '-340px');
        $('.user-post-form').show();
        $('.user-post-form-overlay').show()

        new divselect('astro1', '', 'selectview-postform')
        new divselect('astro2', '', 'selectview-postform');
    })


    $.get($scope.http_host + '/api/?p=wish&s=front&a=get_survey_detail', function(data) {
        var tempFn = doT.template($('#survey_tmpl').html())
        $('#survey_container').html(tempFn(data.result.data[0]))
    },'json')

    window.$scope.login_success=function(data){
      $("#usr-img-1").attr("src",data.avatar_large)
    }
    window.$scope.logout_success=function(data){
     $("#usr-img-1").attr("src",'http://sjs1.sinajs.cn/video/volunteer/images/pages/top/thumb_default.png')
    }


})