var input_select = {

	fillData: function(select,dataList){
	
		$.each(dataList,function(){
			select.append($("<option/>").val(this.id).text(this.name));
		});
		
	
	}
	
}