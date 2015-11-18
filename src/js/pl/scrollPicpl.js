
define(['comp/scrollPic','pl/starLoc','comp/horoscopeMap','pl/pager','pl/commentFaces'],
function(scrollPic,starLoc,horoscopeMap,pager,commentFaces){
    var phpData =eval($('script[data-name=currentPage]').html())
    var page = phpData[0]
    
    var freeAPI = $scope.http_host+'/api/?p=wish&s=front&a=get_wish_list&page='+page+'&decorate_id=2&size=93'
    var lv1API = $scope.http_host+'/api/?p=wish&s=front&a=get_wish_list&page='+page+'&decorate_id=3&size=6'
    var lv2API = $scope.http_host+'/api/?p=wish&s=front&a=get_wish_list&page='+page+'&decorate_id=4&size=6'
    var lv3API = $scope.http_host+'/api/?p=wish&s=front&a=get_wish_list&page='+page+'&decorate_id=5&size=6'
 
  
    var scrollFun = {timer:null,rollingSwitch:true,scrollObj:null};
    
    //公用的ajax 返回promise对象
    scrollFun.getData = function(api){
        var deffered = $.Deferred();
        $.ajax({
        async: false,
        url: api,
        type: "GET",
        dataType: 'jsonp',
        jsonp: 'callback',
        success: function(data) {
            deffered.resolve(data.result.data)
        }
        })       
        return deffered.promise();
    }
    
    scrollFun.setTimer = function(index){
        if(scrollFun.timer){
            window.clearInterval(scrollFun.timer);
        }
         scrollFun.timer = window.setInterval(function(){
         if(scrollFun.rollingSwitch){
         $('.user-data-tip').hide()
         $('.bigstars').css('z-index','0');
         var r  = parseInt(Math.random()*5)
         $(".item").eq(index).find('.bigstars').eq(r).css('z-index','999');
         $(".item").eq(index).find('.bigstars').eq(r).find('.user-data-tip').show();
         }
         },2000)
    }
    
     scrollFun.init = function(number){
         $.when(scrollFun.getData(freeAPI),scrollFun.getData(lv1API),scrollFun.getData(lv2API),scrollFun.getData(lv3API)).done(
                        function(freeData,lv1data,lv2data,lv3data) {

                            
                             function render(index){
                                 var tmpDom = $("<div class='bg-theater'></div>")
                                 var html=''

                                 var free1Data=[];//免费秘密数据，decorid=2 且 type=1 
                                for (var i=0;i<freeData.data.length;i++){
                                    if(freeData.data[i].type==1){
                                        free1Data.push(freeData.data[i])
                                        freeData.data.splice(i,1)
                                    }
                                }

                                var starLocData = starLoc[index];
                                for (var key in starLocData) {
                                    var value = starLocData[key]
                                    var tipsData;//返回星球数据
                                    switch (key){
                                        case 'free': tipsData = freeData.data; break;
                                        case  'free1':tipsData = free1Data;break;
                                        case 'lv1':tipsData = lv1data.data; break;
                                        case 'lv2':tipsData = lv2data.data; break;
                                        case 'lv3':tipsData = lv3data.data; break;
                                    }
                                    for (var i = 0; i < value.length; i++) {
                                        if(!!tipsData[index*value.length+i]){
                                        html += '<div class = "' + value[i].className + '" node-type = "items" data-id="'+tipsData[index*value.length+i].id+'" style = "left: ' + value[i].pos[0] + 'px; top: ' + value[i].pos[1] + 'px;">'        
                                        html += '<div class = "user-data-tip'    
                                            if (value[i].pos[0] >= 500) {
                                                html += ' user-data-tip-right'
                                            }
                                            if (value[i].pos[1] >= 680 && value[i].pos[0] >= 500 && value[i].pos[0] <= 800) {
                                                html += ' user-data-tip-up'                                                                                          
                                            } else {
                                                if (value[i].pos[0] < 500) {
                                                    if(value[i].pos[1] >= 680){
                                                        html += ' user-data-tip-left-bottom'  
                                                    }else{
                                                      html += ' user-data-tip-left-middle'  
                                                    }
                                                }
                                                if (value[i].pos[0] > 800) {
                                                    if(value[i].pos[1] >= 680){
                                                          html += ' user-data-tip-right-bottom' 
                                                    }else{
                                                      html += ' user-data-tip-right-middle' 
                                                    }                                                
                                                }
                                            }
                                       
                                        html+='">'; 
                                        html += '<div class = "user-data-tip-arrow">' +
                                                '</div>'
                                        if(key=='free'){
                                         html += '<div class = "user-data-tip-title" > <div class = "yellow" > '+tipsData[index*value.length+i].nickname+' </div>'+horoscopeMap[tipsData[index*value.length+i].horoscope]+'</div>' +
                                                '<p> '+ commentFaces.loadFace(tipsData[index*value.length+i].content.slice(0,50))
                                                if(tipsData[index*value.length+i].content.length>50){
                                                   html+='...' 
                                                }
                                                
                                         html+= '</p>'+
                                                '<p class = "fr" >  <i class="read">阅读</i>  '+tipsData[index*value.length+i].hit+' </p>' +
                                                '</div>'   
                                        }else{
                                          html += '<div class = "user-data-tip-title" > <div class = "yellow" > '+tipsData[index*value.length+i].nickname+' </div>'+horoscopeMap[tipsData[index*value.length+i].horoscope]+'</div>' +
                                                '<p> '+commentFaces.loadFace(tipsData[index*value.length+i].content.slice(0,100))
                                                 if(tipsData[index*value.length+i].content.length>100){
                                                   html+='...' 
                                                }
                                                html+= '</p>'+
                                                '<p class = "fr" > <i class="read">阅读</i>  '+tipsData[index*value.length+i].hit+' </p>' +
                                                '</div>'  
                                        }
                                        
                                       }
                                        html += '</div>'
                                    }
                                } 
                                               
                                var itemDom = $("<div class='item'></div>")
                                $("#slide100").append(itemDom) 
                                itemDom.append(tmpDom)
                                tmpDom.html(html)
                             }
                             
                             
                             $("#slide100").html('') //清空组件dom 准备注入
                             for (var i =0;i<=2;i++){
                                 render(i)
                             }
                             
                            
                            // pager(freeData.pageCount,page);

                            
                            
                            //初始化翻页
                            var slide_box01 = new scrollPic('slide100');
                            slide_box01.scrollContId = "slide100";
                            //内容容器ID                  
                            slide_box01.frameWidth = 1000;
                            //显示框宽度
                            slide_box01.pageWidth = 1000;
                            //翻页宽度

                            slide_box01.autoPlay = false;
                            //自动播放
                            slide_box01.autoPlayTime = 2;
                            //自动播放间隔时间(秒)
                            slide_box01.circularly = true;
                            slide_box01.ifCallback = true;
//                            slide_box01.beforePlayCallback = function(){
//                                $(".bg-theater").addClass('scaleAnimate')
//                            }
                            slide_box01.playCallBack = function(){                           
                               scrollFun.setTimer(this.pageIndex); 
                               //$(".bg-theater").removeClass('scaleAnimate')
                            }

                            slide_box01.initialize();
                            
                            slide_box01.pageTo(number)
                            scrollFun.scrollObj = slide_box01
                         
                            scrollFun.setTimer(0);
                      
                            $("#main-switch").on('click', function() {
                                scrollFun.scrollObj.next();
                            })
                            $('.scrollLeft').on('click',function(){
                                 if(scrollFun.scrollObj.pageIndex==0){
                                     var index = page-1>=1?(page-1):freeData.pageCount;
                                     page = index
                                     replaceAPI()
                                     scrollFun.reload(2);
                                 }else{
                                     slide_box01.pre(); 
                                 }
                                
                            })
                            $('.scrollRight').on('click',function(){
                               
                                if(scrollFun.scrollObj.pageIndex==scrollFun.scrollObj.pageLength-1){   
                                    var index = page+1<=freeData.pageCount?(page+1):1;
                                     page = index
                                     replaceAPI()
                                     scrollFun.reload(0);
                                 }else{
                                   scrollFun.scrollObj.next();  
                                 }
                                 
                            })

            function replaceAPI() {
                 freeAPI = $scope.http_host + '/api/?p=wish&s=front&a=get_wish_list&page=' + page + '&decorate_id=2&size=93'
                 lv1API = $scope.http_host + '/api/?p=wish&s=front&a=get_wish_list&page=' + page + '&decorate_id=3&size=6'
                 lv2API = $scope.http_host + '/api/?p=wish&s=front&a=get_wish_list&page=' + page + '&decorate_id=4&size=6'
                 lv3API = $scope.http_host + '/api/?p=wish&s=front&a=get_wish_list&page=' + page + '&decorate_id=5&size=6'
            }
                       
          }
         )
         
     }
   
   
    scrollFun.bindEvent = function(){
        var tmpDom = null;
         $("#slide100").on('mouseover',function(e){
             if($(e.target).attr('node-type')==='items'){
                 if(!!tmpDom){
                     tmpDom.dom.css('z-index',0)
                     tmpDom.dom.addClass(tmpDom.className)
                 }
                 tmpDom ={dom:$(e.target),className:$(e.target).attr('class')}  //存储当前星星
                 $('.user-data-tip').hide()
                 tmpDom.dom.find('.user-data-tip').show();
                 tmpDom.dom.removeClass('blink1 blink2')
                 tmpDom.dom.css('z-index',9999);
                 scrollFun.rollingSwitch = false;
             }else if($(e.target).hasClass('bg-theater')){
                 $('.user-data-tip').hide()
             }
         })
         $("#slide100").on('click',function(e){
             if($(e.target).closest('div[node-type]').attr('node-type')==='items'){
               var id=$(e.target).closest('div[node-type]').attr('data-id')
               window.open($scope.http_host+"/wish/item/"+id,"_blank")
             }
         })
     }
     
     scrollFun.reload = function(number){
          $("#slide100").html('');
          $('.pageNumWrap').remove()
          scrollFun.scrollObj = null;
          $("#main-switch").off('click')
          $('.scrollLeft').off('click')
          $('.scrollRight').off('click')
          scrollFun.init(number);
     }
   
    return scrollFun;
})



