;(function(root, factory){
    root.Pager = factory();
}(this, function(){

    function Pager(options){};

    Pager.prototype = {
        init: function(options){
            this.options = {};

            this.options[options.pageKey] = 1;
            this.options[options.sizeKey] = options.size;
            var params = options.extra;
            for(var key in params){
                this.options[key] = params[key];
            }

            // $.extend(this.options, options);
            this.setOptions(options);
        },
        render: function(obj){
            this.getData(obj);
            this.bindEvent(obj);
        },
        setOptions: function(obj){
            this.render(obj);
        },
        createTpl: function(total, totalRecord, obj){
            var htm = ''
                , curPage = Number(this.options[obj.pageKey])
            ;
            
            //上一页
            if(curPage == 1){
                htm+= '<a href="javascript:void(0);" class="prePage disabled">上一页</a>';
            }else{
                htm+= '<a href="javascript:void(0);" class="prePage">上一页</a>';
            }

            //中间页
            if(total >= 8){
                if(curPage >= 5 && (total - curPage > 2)){
                    htm+= '<a href="javascript:void(0);" class="disNo">1</a>';
                    htm+= '<span class="more">...</span>';
                    for(var i = curPage - 2; i <= curPage + 2; i++){
                        if(i == curPage){
                            htm+= '<span class="current">' + i + '</span>';
                        }else{
                            htm+= '<a href="javascript:void(0);" class="disNo">' + i + '</a>';
                        }
                    }
                    htm+= '<span class="more">...</span>';
                    htm+= '<a href="javascript:void(0);" class="disNo">' + total + '</a>';
                }else if(total - curPage <= 5){
                    htm+= '<a href="javascript:void(0);" class="disNo">1</a>';
                    htm+= '<span class="more">...</span>';
                    for(var i = curPage - 2; i <= total; i++){
                        if(i == curPage){
                            htm+= '<span class="current">' + i + '</span>';
                        }else{
                            htm+= '<a href="javascript:void(0);" class="disNo">' + i + '</a>';
                        }
                    }
                }else{
                    for(var i = 1; i <= curPage + 3; i++){
                        if(i == curPage){
                            htm+= '<span class="current">' + i + '</span>';
                        }else{
                            htm+= '<a href="javascript:void(0);" class="disNo">' + i + '</a>';
                        }
                    }
                    htm+= '<span class="more">...</span>';
                    htm+= '<a href="javascript:void(0);" class="disNo">' + total + '</a>';
                }
            }else{
                for(var i = 1; i <= total; i++){
                    if(i == curPage){
                        htm+= '<span class="current">' + i + '</span>';
                    }else{
                        htm+= '<a href="javascript:void(0);" class="disNo">' + i + '</a>';
                    }
                }
            }

            //下一页
            if(curPage == total){
                htm+= '<a href="javascript:void(0);" class="nextPage disabled">下一页</a>';
            }else{
                htm+= '<a href="javascript:void(0);" class="nextPage">下一页</a>';
            }

            //指定跳转页
            htm+= ' 共' + totalRecord + '条，到第 <input type="text" class="pager-search-input" /> 页 <input type="button" class="pager-search-btn" value="确定" />'

			$('#pager').html(htm);
        },
        bindEvent: function(obj){
            var self = this;
            $('#pager').on('click', '.disNo', function(){
				var dom = $(this);
				self.options[obj.pageKey] = dom.text();
				self.getData(obj);
            });
            $('#pager').on('click', '.prePage', function(){
                if(!$(this).hasClass('disabled')){
                    self.options[obj.pageKey] = Number(self.options[obj.pageKey]) - 1;
				    self.getData(obj);
                }
            });
            $('#pager').on('click', '.nextPage', function(){
				if(!$(this).hasClass('disabled')){
                    self.options[obj.pageKey] = Number(self.options[obj.pageKey]) + 1;
				    self.getData(obj);
                }
            });
            $('#pager').on('click', '.pager-search-btn', function(){
                var pageNum = Number($('.pager-search-input').val());
				if(pageNum >= 1 && pageNum <= self.options.total){
                    self.options[obj.pageKey] = pageNum;
				    self.getData(obj);
                }
            });
        },

        getData: function(obj){
            var self = this;
			$.ajax({
				type: 'get',
				dataType: 'json',
				url: obj.url,
				data: this.options,
				success: function(data){
                    self.options.total = data.data.total;
					self.createTpl(data.data.total, data.data.totalRecord, obj);
					obj.cb(data);
				}
			});
		}
    };

    return Pager;
}));