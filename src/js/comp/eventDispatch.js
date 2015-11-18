//js 事件代理
define(function(){
    var eventDispatch = function(baseDom,eventName){
        this.events = {};
        this.eventName = eventName;
        this.target = baseDom || $(document.body)
        this.init();
    }
    eventDispatch.prototype.init = function(){
        var _this = this;
        $(this.target).on(this.eventName,function(e){
          if(e.target.tagName=='A'){
            $(e.target).blur()//防止回车键重复点击a标签
          }  
                  if($(e.target).attr('action-name')){
                      var actionName=$(e.target).attr('action-name')
                          if(!!_this.events[actionName]){
                              for(var i=0;i<_this.events[actionName].length;i++){
                                  _this.events[actionName][i]($(e.target))
                              }
                          }  
                  }
        })
    }
    eventDispatch.prototype.addEvent = function(actionName,callback){
        if(!this.events[actionName]){
                  this.events[actionName]=[callback]
              }else{
                 this.events[actionName].push(callback)
              }
    }

    eventDispatch.prototype.fireEvent = function(actionName,target){
        target = target || this.target;
        if(this.events[actionName]){
           for(var i=0;i<this.events[actionName].length;i++){
              this.events[actionName][i](target)
           }
        }
    }

    eventDispatch.prototype.removeEvent = function(actionName,callback){
              if(this.events[actionName]){
                   if(!callback){
                       this.events[actionName]=null;
                   }else{
                       for(var i=0;i<this.events[actionName].length;i++){
                          if(this.events[actionName][i]==callback){
                              this.events[actionName].splice(i,1);
                          }  
                       }
                   }
              }
    }
    return eventDispatch;
})