
define(['swal'],
        function(swal) {

            var purchaseStep = function(id, status, count) {
                this.id = id;
                this.status = status;
                this.count = count;
                this.statusImg = $('#statusImg');
                this.statusEl = $('#statusStr');
                this.postTimes = 0;
                this.init();
            }
            purchaseStep.prototype.init = function() {
                this.goToStep(this.status,this.count)         
            }

            purchaseStep.prototype.goToStep = function(step,result) {
                switch (step) {
                    case 0:
                        this.status = 0;
                        return this.getRid();
                   case 3:
                        this.status = 3;
                        return this.getPform();  
                    case 5:
                        this.status = 5;
                        return this.contactVB(result.data.form);
                    case 7:
                        this.status = 7;
                        return this.getPstatus();     
                    case 10:
                        this.status = 10;
                        return this.getRdata(); 
                    case 20:
                        this.status = 20;
                        return window.open(result.data.url, '_self');
                    case -1:
                         return window.open(result.data.url,'_self');    
                    default:
                        throw "the status" + this.status + " is unexpected";
                }
            };

            purchaseStep.prototype.getRid = function() {
                var _this = this;
                $.post($scope.http_host+'/wish/handler/getRid/', {id: this.id, data_status: this.status, count: this.count}, function(result) {
                          if(result.status==0){
                              _this.goToStep(result.data.data_status,result)
                         }else{
                              _this.reLoad(result.url);
                         }
                },'json')
            }
            
            
            purchaseStep.prototype.getPform = function() {
                var _this = this;
                $.post($scope.http_host+'/wish/handler/getPform/', {id: this.id, data_status: this.status, count: this.count}, function(result) {
                    if (result.status == 0) {
                        _this.urlOK = result.data.url_ok
                         _this.goToStep(result.data.data_status,result)
                    } else {
                         _this.reLoad(result.url);
                    }
                },'json')
            }
            
            
            purchaseStep.prototype.contactVB = function(form){
                var _this = this;
                 _this.statusEl.html("24小时内支付有效");
                 _this.statusImg.hide();
                
                $('#payFn').on('click', function() {
                    var $vbForm = $("<form action='" + form.action + "' target='_blank'><input type='submit' style='display:none' /></form>")
                    for (var key in form.fileds) {
                        $vbForm.append('<input type="hidden" name="'+key+'" value="'+form.fileds[key]+'">')
                    }
                    $(document.body).append($vbForm)
                    $vbForm.submit();
                    var s = swal({confirmButtonText: '支付成功', confirmButtonCSS: '', cancleButtonText: '遇到问题', cancleButtonCSS: '', content: '正在支付...'});
                    s.addEvents('cancle', function() {
                        s.close();
                    })
                    s.addEvents('confirm', function() {
                         _this.reLoad(_this.urlOK);
                    })
                })
                
            }
            
             purchaseStep.prototype.getPstatus = function() {
                var _this = this;
                var startTime = (new Date()).getTime() //时间阀 防止连续快速提交
                _this.postTimes++;
                
                $.post($scope.http_host+'/wish/handler/getPstatus/', {id: this.id, data_status: this.status, count: this.count}, function(result) {
                    if (result.status == 0) {
                         if(_this.postTimes<=4){   //外部 控制post次数    
                                 if((new Date()).getTime()-startTime<=1000){ //内部 控制post间隔
                                  window.setTimeout(function(){ _this.goToStep(result.data.data_status,result)},1000)
                                   }else{
                                      _this.goToStep(result.data.data_status,result)
                                  }     
                           }else{
                              _this.postTimes =0;
                              _this.statusEl.html("天啊,银行还没有付款,揍他");
                              _this.statusImg.hide();
                                _this.reLoad(result.url);
                          }
                      
                    } else {
                         _this.reLoad(result.url);
                    }
                },'json')
                
            }
            
            purchaseStep.prototype.getRdata=function(){
                 var _this = this;
                 $.post($scope.http_host+'/wish/handler/getRdata/', {id: this.id, data_status: this.status, count: this.count,successURL:$scope.data.successURL}, function(result) {
                    if (result.status == 0) {
                         _this.goToStep(result.data.data_status,result)
                    } else {
                         _this.reLoad(result.url);
                    }
                },'json')              
            }
            
           
            
            purchaseStep.prototype.reLoad = function(url) {
                return setTimeout(function() {
                     window.open(url, '_self');
                }, 2000);
            };

            return  purchaseStep

        })