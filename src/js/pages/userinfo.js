require.config({
  baseUrl: "http://sjs1.sinajs.cn/astro/xuyuanxing/js/",
  paths: {
    "comment": "comp/comment3",
    "divselect": "pl/divselect",
    'userinfopop': 'pl/userinfoPop'
  }
});
require(['divselect', 'pl/pageing', 'comp/eventDispatch', 'userinfopop','pl/commentFaces'], function(divselect, pageing, eventDispatch, userinfopop,commentFaces) {
  new divselect('search_type');

  APIList = [
    $scope.http_host + '/api/?p=wish&s=front&a=get_my_wishes&uid=' + $scope.user.id + '&page=1&size=4',
    $scope.http_host + '/api/?p=wish&s=front&a=get_my_unpay&uid=' + $scope.user.id + '&page=1&size=4',
    $scope.http_host + '/api/?p=wish&s=front&a=get_my_comment&uid=' + $scope.user.id + '&page=1&size=4'
  ]
  callbackList = [
    function() {
      $.post($scope.http_host + "/wish/api/?s=front&a=clean_my_wishes&uid=" + $scope.user.id + "&page=" + page + "&size=4'")
    },
    function() {},
    function() {}
  ]
  tmplList = [$('#cardList_total').html(), $('#cardList_unpay').html(), $('#cardList_mycomment').html()]


  var pageingObj;
  var page = 1;
  var cardTmpl = $('#cardList_total').html();
  var API = APIList[0];
  var APICallback = callbackList[0]
  var $container = $('#cardList_total').prev('.cards-container');
  var $tabs_container = $container.parent(".tabs-container")

  function getUrlArgs() {
    var args = {},
      location = window.location || location;
    var query = location.search.substring(1);
    var pairs = query.split('&');
    var i, pos, name, value;

    for (i = 0; i < pairs.length; i++) {
      pos = pairs[i].indexOf('=');
      if (pos === -1) continue;
      name = pairs[i].substring(0, pos);
      value = decodeURI(pairs[i].substring(pos + 1));
      args[name] = value;
    }
    return args;
  }

  if (getUrlArgs().tabname == 'unpay') {
    $(".tabs li").removeClass('selected');
    $(".tabs li").eq(1).addClass('selected')
    API = APIList[1];
    cardTmpl = tmplList[1]
    page = 1;
  }

  //第一次获得数据
  $.get(API, function(data) {
    var tempFn = doT.template(cardTmpl)

    $scope.model.cardData = {};
    for (var i = 0; i < data.result.data.data.length; i++) {
      $scope.model.cardData[data.result.data.data[i].id] = data.result.data.data[i]
    }


    $container.html(tempFn(data.result.data.data))

    $container.html(commentFaces.loadFace($container.html()))

    APICallback()


    pageingObj = new pageing({
      pageCount: data.result.data.pageCount,
      page: page,
      dom: $tabs_container,
      eventInit: true
    })


    pageingObj.addEvent('first', function($targert) {
      page = 1
      API = API.replace(/page=\d*/, 'page=' + page)
      getData()
    })
    pageingObj.addEvent('last', function($targert) {
      page = pageingObj.pageCount
      API = API.replace(/page=\d*/, 'page=' + page)
      getData()
    })

    pageingObj.addEvent('topage', function($targert) {
      page = $targert.data('page')
      API = API.replace(/page=\d*/, 'page=' + page)
      getData()
    })

    pageingObj.addEvent('next', function($targert) {
      page = (page + 1) <= pageingObj.pageCount ? (page + 1) : 1
      API = API.replace(/page=\d*/, 'page=' + page)
      getData()
    })
    pageingObj.addEvent('prev', function($targert) {
      page = (page - 1) >= 1 ? (page - 1) : pageingObj.pageCount
      API = API.replace(/page=\d*/, 'page=' + page)
      getData()
    })

  }, 'json')


  //每次更新api获得数据
  function getData() {
    $container.html('loading...')
    $.get(API, function(data) {

      $scope.model.cardData = {};
      for (var i = 0; i < data.result.data.data.length; i++) {
        $scope.model.cardData[data.result.data.data[i].id] = data.result.data.data[i]
      }

      var tempFn = doT.template(cardTmpl);
      $container.html(tempFn(data.result.data.data))

      $container.html(commentFaces.loadFace($container.html()))

      pageingObj = new pageing({
        pageCount: data.result.data.pageCount,
        page: page,
        dom: $tabs_container,
        eventInit: false
      });

      APICallback()

    }, 'json')
  }


  $(".tabs li").on('click', function() {
    $(".tabs li").removeClass('selected');
    $(this).addClass('selected')
    API = APIList[$(this).index()];
    cardTmpl = tmplList[$(this).index()]
    APICallback = callbackList[$(this).index()]
    page = 1;
    getData()
  });


  //添加card内部事件


  var cardEvent = new eventDispatch($('#cards-container'), 'click')

  var pop;

  cardEvent.addEvent('upgradecard', function($target) {

    pop = userinfopop({
      content: $("#upgradeListTmpl").html()
    })



    var id = $target.data('id');

    var data = $scope.model.cardData[id]

    

    for (var i = 1; i <= data.decorate_level; i++) {
      pop.$box.find(".pop_tabs span").eq(0).remove()
      pop.$box.find(".decorateInfo").eq(0).remove()
    }
    pop.$box.find(".pop_tabs span:first").addClass('on')
    pop.$box.find(".decorateInfo:first").addClass('show')

    var decorate_id = pop.$box.find(".pop_tabs span:first").data('id')

    var boxEvent = pop.eventDispatch
    boxEvent.addEvent('swicthTab', function($target) {
      var index = $target.index();
      pop.$box.find('.decorateInfo').removeClass('show')
      pop.$box.find('.decorateInfo').eq(index).addClass('show')
      pop.$box.find(".pop_tabs span").removeClass('on')
      decorate_id = $target.data('id')
      $target.addClass('on')
    })

    boxEvent.addEvent('upgradePay', function($target) {

//      var pop = userinfopop({
//        content: "<div class='pop-content' style='width:220px;'><div class='btnSmall' action-name='confirm'>支付失败</div><div class='btnSmall' action-name='cancle'>支付成功</div></div>"
//      })
//
//      var buyEvent = pop.eventDispatch
//      buyEvent.addEvent('confirm', function($target) {
//        pop.destory()
//      })
//      buyEvent.addEvent('cancle', function($target) {
//        pop.destory()
//      })


      var tmpForm = $("<form action='" + $scope.http_host + "/wish/handler/index' target='_self' method='post'></form>");
      tmpForm.append('<input type="hidden" name="item_id" value=' + $scope.model.cardData[id].id + ' />')
      tmpForm.append('<input type="hidden" name="decorate_id" value=' + decorate_id + ' />')
      tmpForm.append('<input type="hidden" name="type" value=0 />')
      tmpForm.append('<input type="hidden" name="num" value=1 />')
      $(document.body).append(tmpForm)
      tmpForm[0].submit();
      tmpForm.remove();
    })


  })

  cardEvent.addEvent('buycard', function($target) {

//    var pop = userinfopop({
//      content: "<div class='pop-content' style='width:220px;'><div class='btnSmall' action-name='confirm'>支付失败</div><div class='btnSmall' action-name='cancle'>支付成功</div></div>"
//    })
    window.open($scope.http_host + '/wish/handler/' + $target.data('id'), "_self")
  })

  cardEvent.addEvent('delcard', function($target) {
    var id = $target.data('id');
    var pop = userinfopop({
      content: $("#delTmpl").html()
    })
    var boxEvent = pop.eventDispatch
    boxEvent.addEvent('cancle', function($target) {
      pop.destory()
    })
    boxEvent.addEvent('confirm', function($target) {
      pop.destory()
      var tmpForm = $("<form action='" + $scope.http_host + "/wish/handler/index' target='_self' method='post'></form>");
      tmpForm.append('<input type="hidden" name="item_id" value=' + $scope.model.cardData[id].id + ' />')
      tmpForm.append('<input type="hidden" name="decorate_id" value=' + $scope.model.cardDelId + ' />')
      tmpForm.append('<input type="hidden" name="type" value=0 />')
      tmpForm.append('<input type="hidden" name="num" value=1 />')
      $(document.body).append(tmpForm)
      tmpForm[0].submit();
      tmpForm.remove();
    })

  })


  cardEvent.addEvent('chargecard', function($target) {
    var id = $target.data('id');

    var pop = userinfopop({
      content: $("#chargeTmpl").html()
    })

    var delay_decorate_info = $.parseJSON($scope.model.cardData[id].delay_decorate_info);

    $scope.model.cardData[id].amount = 1

    $scope.model.cardData[id].priceTotal = delay_decorate_info.longer_price * 1;

    pop.$box.find('i[node-type=price]').html(delay_decorate_info.longer_price + '/天')

    pop.$box.find('i[node-type=priceTotal]').html($scope.model.cardData[id].priceTotal)

    var amoutEvent = pop.eventDispatch

    amoutEvent.addEvent('addAmount', function() {
      $scope.model.cardData[id].amount = $scope.model.cardData[id].amount + 1
      $scope.model.cardData[id].priceTotal = delay_decorate_info.longer_price * $scope.model.cardData[id].amount
      amoutEvent.fireEvent('changeAmount', pop.$box)
    })

    amoutEvent.addEvent('minusAmount', function() {
      $scope.model.cardData[id].amount = $scope.model.cardData[id].amount - 1
      $scope.model.cardData[id].priceTotal = delay_decorate_info.longer_price * $scope.model.cardData[id].amount
      amoutEvent.fireEvent('changeAmount', pop.$box)
    })

    amoutEvent.addEvent('changeAmount', function($target) {

      $target.find("input").val($scope.model.cardData[id].amount)

      pop.$box.find('i[node-type=priceTotal]').html($scope.model.cardData[id].priceTotal)

    })

    var amoutKeybordEvent = new eventDispatch(pop.$box, 'keyup')
    amoutKeybordEvent.addEvent('inputAmount', function($target) {
      if (!/^\d*$/.test($target.val())) {
        alert('数量只能为整数');
        return;
      }
      $scope.model.cardData[id].amount = parseInt($target.val())
      $scope.model.cardData[id].priceTotal = delay_decorate_info.longer_price * $scope.model.cardData[id].amount
      amoutEvent.fireEvent('changeAmount', pop.$box)
    })


    var chargeBoxEvent = amoutEvent
    chargeBoxEvent.addEvent('confirm', function() {
      var tmpForm = $("<form action='" + $scope.http_host + "/wish/handler/index' target='_self' method='post'></form>");
      tmpForm.append('<input type="hidden" name="item_id" value=' + $scope.model.cardData[id].id + ' />')
      tmpForm.append('<input type="hidden" name="decorate_id" value=' + $scope.model.cardData[id].decorate_id + ' />')
      tmpForm.append('<input type="hidden" name="type" value=1 />')
      tmpForm.append('<input type="hidden" name="num" value=' + $scope.model.cardData[id].amount + ' />')
      $(document.body).append(tmpForm)
      tmpForm[0].submit();
      tmpForm.remove();
      pop.destory()
    })

    chargeBoxEvent.addEvent('cancle', function() {
      pop.destory()
    })

  })

  cardEvent.addEvent('hidecard', function($target) {
    var id = $target.data('id');
    if ($scope.model.cardData[id].is_del == 0) {
      $.post($scope.http_host + '/api/?p=wish&s=item&a=hide', {
        id: id
      }, function(data) {
        $scope.model.cardData[id].is_del = 1
        pop = userinfopop({
          content: "<div class='pop-content'><span style='font-size:20px;'>" + data.result.status.msg + "</span></div>"
        })
        $target.toggleClass('star-hide-sel')
      },'json')
    } else {
      $.post($scope.http_host + '/api/?p=wish&s=item&a=show', {
        id: id
      }, function(data) {
        $scope.model.cardData[id].is_del = 0
        pop = userinfopop({
          content: "<div class='pop-content'><span style='font-size:20px;'>" + data.result.status.msg + "</span></div>"
        })
        $target.toggleClass('star-hide-sel')
      },'json')
    }


  })


  var eventDis = cardEvent

  eventDis.addEvent('like', function($target) {
    var id = $target.data('id')
    if ($scope.model.cardData[id].faved == 0 && $scope.model.cardData[id].passed == 0) {
      $.post($scope.http_host + '/wish/?s=front&a=attitude', {
        item_id: id,
        attitude: 0
      })

      $scope.model.cardData[id].faved = 1
      $scope.model.cardData[id].attitude_fav = parseInt($scope.model.cardData[id].attitude_fav) + 1
      $target.find('a').html($scope.model.cardData[id].attitude_fav)
      $target.addClass('liked')
      addOneEffect($target.find('a'))
    } else if ($scope.model.cardData[id].faved == 1) {
      $.post($scope.http_host + '/wish/?s=front&a=cancelAttitude', {
        item_id: id,
        attitude: 0
      })

      $scope.model.cardData[id].faved = 0
      $scope.model.cardData[id].attitude_fav = parseInt($scope.model.cardData[id].attitude_fav) - 1
      $target.find('a').html($scope.model.cardData[id].attitude_fav)
      $target.removeClass('liked')
    }
  })

  eventDis.addEvent('dislike', function($target) {
    var id = $target.data('id')
    if ($scope.model.cardData[id].passed == 0 && $scope.model.cardData[id].faved == 0) {
      $.post($scope.http_host + '/wish/?s=front&a=attitude', {
        item_id: id,
        attitude: 1
      })

      $scope.model.cardData[id].passed = 1
      $scope.model.cardData[id].attitude_pass = parseInt($scope.model.cardData[id].attitude_pass) + 1
      $target.find('a').html($scope.model.cardData[id].attitude_pass)
      $target.addClass('disliked')
      addOneEffect($target.find('a'))
    } else if ($scope.model.cardData[id].passed == 1) {
      $.post($scope.http_host + '/wish/?s=front&a=cancelAttitude', {
        item_id: id,
        attitude: 1
      })

      $scope.model.cardData[id].passed = 0
      $scope.model.cardData[id].attitude_pass = parseInt($scope.model.cardData[id].attitude_pass) - 1
      $target.find('a').html($scope.model.cardData[id].attitude_pass)
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


  cardEvent.addEvent('delcard_free', function($target) {
    var pop = userinfopop({
      content: "<div class='pop-content' style='width:220px;'><span style='font-size:20px;'>删除成功!</span></div>"
    })

  })



})