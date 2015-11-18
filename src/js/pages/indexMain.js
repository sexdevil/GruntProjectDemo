
require.config({
    baseUrl: "http://sjs1.sinajs.cn/astro/xuyuanxing/js/",
    paths: {
        "scrollPicpl":"pl/scrollPicpl", //翻图
         "comment":"pl/commentForm",  //提交表单
        "divselect":"pl/divselect"
    },
     urlArgs: "v=" + (new Date()).getTime() 
});
require(['scrollPicpl','comment','divselect'],function (scrollPicpl,comment,divselect) {
     
      new divselect('search_type'); 
      
     scrollPicpl.init(0);
     
     scrollPicpl.bindEvent();


   //绑定开关userpostform
    $('#main-wish').on('click',function(){
        var left = $(this).position().left;
        var top = $(this).position().top;
        $('.user-post-form').css('left',left-300);
        $('.user-post-form').css('top',top+100);
        $('.user-post-form').show();
        $('.user-post-form-overlay').show()

               $('#astro1').val($('#astro1').data('horo')||1)
              new divselect('astro1','','selectview-postform')
              new divselect('astro2', '', 'selectview-postform');             
    })
    
//     scrollPicpl.scrollObj 翻页对象 
  
})