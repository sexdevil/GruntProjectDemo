
define(['comp/eventDispatch'],
        function(eventDispatch) {
       
          var $overlay = $('<div class="sweet-overlay"></div>')
          
          var $box = $('<div class="sweet-alert"></div>')
      
          var $cancle = $('<button class="cancel" action-name="cancle"></button>') 
          
          var $confirm = $('<button class="confirm" action-name="confirm"></button>')
          
          var $content = $('<h2></h2>')
          
          var $body = $(document.body);
          
       
          
          var swal = function(args){
             return new swal.prototype.init(args);
          }
          
          var init=swal.prototype.init = function(args){
              this.confirmButtonText  = args.confirmButtonText || '';
              this.confirmButtonCSS =  args.confirmButtonCSS || 'background:#c38ad7';
              this.cancleButtonText = args.cancleButtonText || '';
              this.cancleButtonCSS = args.cancleButtonCSS || 'background:#cfcfcf';
              this.content = args.content || '';
              this.render();
          };
          
          init.prototype = swal.prototype;
          
          swal.prototype.render = function(){
              $content.html(this.content);
              
              $cancle.html(this.cancleButtonText)
              $cancle.attr('style',this.cancleButtonCSS)
              
              $confirm.html(this.confirmButtonText)
              $confirm.attr('style',this.confirmButtonCSS)
              
              $box.append($content)
              $box.append($cancle)
              $box.append($confirm)
              
              $body.append($overlay);
              $body.append($box);
              $overlay.show();
              $box.show();
              this.initEvents();
          }
          
          swal.prototype.initEvents = function(){

             this.eventDispatch = new eventDispatch($box,'click')
          }
          
          swal.prototype.addEvents = function(actionName,callback){
              this.eventDispatch.addEvent(actionName,callback)
          }
          swal.prototype.removeEvents = function(actionName,callback){
             this.eventDispatch.removeEvent(actionName,callback)
          }
          
          
          swal.prototype.close = function(){
              $box.hide();
              $overlay.hide();
          }
          
          swal.prototype.destory = function(){
              $box.remove()
              $overlay.remove()
          }
              
          
          return swal;
          
     })