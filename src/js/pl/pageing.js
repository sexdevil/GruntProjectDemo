define(['comp/eventDispatch'],function(eventDispatch){
    //页数出页码 pageCount 总页数 ,page 当前页码
    function pageing(){
                                this.pageCount = arguments[0].pageCount;
                                 this.page = arguments[0].page;
                                 this.dom = arguments[0].dom;  
                                 this.init(arguments[0].eventInit);
    }

    pageing.prototype.init = function(eventInit){
        var $container;
         if($(this.dom).find('.pageNumWrap').length){
            $container = $(this.dom).find('.pageNumWrap')
            $container.html('');
         }else{
            $container = $('<div class="pageNumWrap"></div>')
            $(this.dom).append($container)
         }
         
                                 var innerHTML =''
                                 
                                 var startIndex,endIndex; //页码开始结尾
                                 startIndex = this.page-2>=1?(this.page-2):1
                                 endIndex = startIndex+4<=this.pageCount?startIndex+4:this.pageCount
                                  for(var i=startIndex;i<=endIndex;i++){
                                       if(this.page == i){
                                            innerHTML+='<a href="javascript:;" data-page="'+i+'" class="current"'
                                       }else{
                                            innerHTML+='<a href="javascript:;" data-page="'+i+'" action-name="topage"' 
                                       } 
                                     innerHTML+='>'+i+'</a>'
                                  }
                                  
                                  var prev,next;
                                prev = (this.page - 1)
                                next = (this.page + 1) 
                                $container.append('<a href="javascript:;" action-name="first">首页</a>')
                                if(prev >= 1){
                                $container.append('<a href="javascript:;" action-name="prev">上一页</a>')
                                }
                                $container.append(innerHTML)
                                if(next<=this.pageCount){
                                $container.append('<a href="javascript:;" action-name="next">下一页</a>')   
                                }  
                                $container.append('<a href="javascript:;" action-name="last">尾页</a>')


                                if(eventInit){
                                     this.eventDispatchObj = new eventDispatch($container,'click')
                                }
                               

                                
    }
     pageing.prototype.addEvent = function(actionName,callback){
        this.eventDispatchObj.addEvent(actionName,callback);
     }
     
    return  pageing;
})