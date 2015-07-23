var input_select = {

	fillData : function(select, dataList) {

		$.each(dataList, function() {
			select.append($("<option/>").val(this.id).text(this.name));
		});

	}

};

var toType = function(obj) {
	  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
};

var URL = function() {
	this.urlString = window.location.href;
	this.baseUrl = window.location.href.substr(0,this.urlString.indexOf('#'));
	this.paramsString = window.location.href.substr(this.urlString.indexOf('#')+1,this.urlString.length);
	
	this.setParams = function(params) {
		this.urlString = window.location.href;
		this.baseUrl = window.location.href.substr(0,this.urlString.indexOf('#'));
		if(this.urlString.indexOf('#') != -1)
		{
			this.paramsString = window.location.href.substr(this.urlString.indexOf('#')+1,this.urlString.length);
		}
		else
			this.paramsString = "";
		//console.log(this.paramsString);
		this.paramsString = objectToString(extractAddKeyValue(
				this.paramsString, params));
		console.log("set: " +this.paramsString);
		window.location.href = (this.baseUrl + "#" + this.paramsString);
	};

	this.removeParam = function(param) {
		//this.paramsString = this.paramsString.replace(new RegExp('[#]'+param+"=(.*?)(#|$)"),'');
		this.urlString = window.location.href;
		this.baseUrl = window.location.href.substr(0,this.urlString.indexOf('#'));
		if(this.urlString.indexOf('#') != -1)
		{
			this.paramsString = window.location.href.substr(this.urlString.indexOf('#')+1,this.urlString.length);
		}
		else
			this.paramsString = "";
		var paramPairs = extractAddKeyValue(this.paramsString);
		var index = [];
		console.log("remove:"+param);
		for(var i=0;i<paramPairs.length;i++)
		{
			if(paramPairs[i].name.localeCompare( param)==0)
				index.push(i);
		}
		
		for(var i=0;i<index.length;i++)
		{
			paramPairs.splice(index[i]);
		}
		//console.log("remove:"+objectToString(paramPairs));
		this.paramsString = objectToString(paramPairs);
		window.location.href = (this.baseUrl + "#" + this.paramsString);
		//console.log(this.paramsString);
	};
	
	this.getParamValue= function(param)
	{
		var value = (RegExp('[#]?'+param + '=' + '(.+?)(#|$)').exec(this.paramsString)||[null,null])[1];
//		console.log("get :"+this.paramsString+"->"+value);
		return value;
	};

	var extractAddKeyValue = function(string, pair) {
		var params = [];
		if(string !== "")
		{
			try {
				params = string.split("#");
			} catch (e) {}
		}
		//console.log("paramLength:"+params.length);
		var flag = false;
		var index = 0;
		var paramObject = [];
		// console.log("pair: "+pair);
		for (var i = 0; i < params.length; i++) {
			var token = params[i].split("=");
			var object = {};
			object.name = token[0];
			if (pair instanceof Object && token[0] == pair.name) {
				object.value = pair.value;
				flag = true;

			} else
				object.value = token[1];
			paramObject[index++] = object;
			// console.log(object);
		}
		if (pair instanceof Object && !flag) {
			paramObject[index++] = pair;
		}
//		 console.log(paramObject);
		return paramObject;
	};
	var objectToString = function(object) {
		var string = "";
		if (object.length > 0) {
			string += "" + object[0].name + "=" + object[0].value + "";
		}
		for (var i = 1; i < object.length; i++) {
			string += "#" + object[i].name + "=" + object[i].value + "";
		}
		string += "";
		return string;
	};
};