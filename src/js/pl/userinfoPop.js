
define(['comp/eventDispatch'],
        function(eventDispatch) {
       


          var $body = $(document.body);
          
       
          
          var userinfopop = function(args){
             return new userinfopop.prototype.init(args);
          }
          
          var init=userinfopop.prototype.init = function(args){
     
              this.content = args.content || '';
              
              this.$box = $('<div class="pop-container"></div>');
              this.$overlay = $('<div class="pop-overlay"></div>')
              this.$box_outter = $('<div class="popdiv"></div>')

              this.render();
         
              return this;
          };
          
          init.prototype = userinfopop.prototype;
          
          userinfopop.prototype.render = function(){
              this.$box.append(this.content);

              this.$box.append('<i class="pop-close" action-name="pop_close"></i>')

              this.$box_outter.append(this.$box)

              $body.append(this.$overlay);

              $body.append(this.$box_outter);

              this.$overlay.show();

              this.$box_outter.show();
              this.initEvents();
          }
          
          userinfopop.prototype.initEvents = function(){

             this.eventDispatch = new eventDispatch(this.$box,'click')
             var _this=this
             this.addEvents('pop_close',function(){
               _this.destory();
             })
          }
          
          userinfopop.prototype.addEvents = function(actionName,callback){
              this.eventDispatch.addEvent(actionName,callback)
          }
          userinfopop.prototype.removeEvents = function(actionName,callback){
             this.eventDispatch.removeEvent(actionName,callback)
          }
          
          
          userinfopop.prototype.close = function(){
              this.$box_outter.hide();
              this.$overlay.hide();
          }
          
          userinfopop.prototype.destory = function(){
              this.$box_outter.remove()
              this.$overlay.remove()
              
          }
              
          
          return userinfopop;
          
     })