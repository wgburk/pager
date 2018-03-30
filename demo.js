$(function(){
	var pager = new Pager();
	pager.init({
		url: 'data/list.json',
		pageKey: 'page',
		sizeKey: 'size',
		size: 10,
		extra: {
			status: 0,
			state: 1
		},
		cb: function(data){
			console.log(data.data);
		}
	});
});