define(function(){
    //页数出页码 pageCount 总页数 ,page 当前页码
    return  function (pageCount,page){
                                 //page 当前页码
                                 var $container = $('<div class="pageNumWrap"></div>')
                                 var innerHTML =''
                                 
                                 var startIndex,endIndex; //页码开始结尾
                                 startIndex = page-2>=1?(page-2):1
                                 endIndex = startIndex+4<=pageCount?startIndex+4:pageCount
                                 if(endIndex-startIndex<4){
                                    startIndex=endIndex - 3>=1?(endIndex -3):1
                                 }
                                  for(var i=startIndex;i<=endIndex;i++){
                                       if(page == i){
                                            innerHTML+='<a href="'+i+'" class="current"'
                                       }else{
                                            innerHTML+='<a href="'+i+'"'
                                       } 
                                     innerHTML+='>'+i+'</a>'
                                  }
                                  
                                  var prev,next;
                                prev = (page - 1)
                                next = (page + 1) 
                                $container.append('<a href="' + 1 + '">首页</a>')
                                if(prev >= 1){
                                $container.append('<a href="' + prev + '">上一页</a>')
                                }
                                $container.append(innerHTML)
                                if(next<=pageCount){
                                $container.append('<a href="' + next + '">下一页</a>')   
                                }  
                                 $container.append('<a href="' + pageCount + '">尾页</a>')
                                $(document.body).append($container)
                             }
})