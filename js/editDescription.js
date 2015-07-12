var WsClient = new WSClient();
function WSClient() {
	this.url = "http://localhost/module_json_documentation/webservice.php";
	this.fetchModules = function(callback) {
		var pl = new SOAPClientParameters();
		SOAPClient.invoke(this.url, "getModules", pl, true, function(r) {
			r = JSON.parse(r);
			callback(r);
		});
	};

	this.fetchChild = function(moduleId, callback) {
		var pl = new SOAPClientParameters();
		pl.add("parameter", moduleId);
		SOAPClient.invoke(this.url, "getChildren", pl, true, function(r) {

			r = JSON.parse(r);
			callback(r);
		});
	};
	
	this.saveDesc = function(childId,desc, callback) {
		var pl = new SOAPClientParameters();
		pl.add("child_id", childId);
		pl.add("desc", desc);
		SOAPClient.invoke(this.url, "saveDesc", pl, true, function(r) {
			
			r = JSON.parse(r);
			callback(r);
		});
	};	
	
	this.doSearch = function(tag, callback) {
		var pl = new SOAPClientParameters();
		pl.add("tag", tag);
		SOAPClient.invoke(this.url, "doSearch", pl, true, function(r) {
			r = JSON.parse(r);
			callback(r);
		});
	};
	
	this.fetchDesc = function(id, callback) {
		var pl = new SOAPClientParameters();
		pl.add("id", id);
		SOAPClient.invoke(this.url, "fetchDesc", pl, false, function(r) {
			
			r = JSON.parse(r);
			callback(r);
		});
	};

}

function pareparePage() {

	// fetch MOdule list and show in dropdown list.
	prepareModuleList();
	prepareSearch();
}

function prepareSearch()
{
	var textSearch = $("#text_search");
	textSearch.keyup(function(event){
		if(event.which == 13)
		{
			$("#object_container").empty();
			var tag = textSearch.val();
			tag = tag.replace(/\*/g,"%");
			WsClient.doSearch(tag,function(res){
				for(var i = 0;i<res.length;i++)
				{
					// container.empty();
					$("#object_container").append(prepareObject(res[i].id, 1,"",res[i].id));
					$("#object_container").append("<br/><hr/>");
				}
					
			});
		}
		
	});
}



// Creates json representation using a parent id.
function prepareObject(id, level,desc,showParentObject) {
	var container = $("<span class='code json'></span>");
	this.tab = "";
	if(showParentObject)
	{
		tab = "";
		WsClient.fetchDesc(showParentObject,function(res){
			if(res.success)
			{
				container.append(makeKeyValuePair(res.name, "", container, res.desc));
				desc = res.desc;
			}
			
			else
				alert(res.reason);
		});
		
	}
	
	WsClient.fetchChild(id,
			function(r) {
				// alert(JSON.stringify(r, null, 4));
				var braceTab = "";
				var tab = "\t";
				var value = "";
				for ( var i = 0; i < level - 1; i++)
				{
					tab += "\t";
					braceTab += "\t";
				}
				
				if (r.length > 0)
					container.append("\n" + braceTab + "{\n");
				else
					value += makeDescLabel(desc,id)+",";
				for ( var i = 0; i < r.length - 1; i++) {
//					container.append("\n" + tab + "  <span style='color:green;'>\"" + r[i].name + "\"</span>:");
					makeKeyValuePair(r[i].name,tab+"",container,r[i].desc);
					container.append(prepareObject(r[i].id, level + 1,r[i].desc));
				}
				if (r.length > 0) {
					makeKeyValuePair(r[r.length-1].name,tab+"",container,r[r.length-1].desc);
					container.append(prepareObjectWithoutDel(
							r[r.length - 1].id, level + 1,r[r.length-1].desc));
				}

				if (r.length > 0)
					container.append("\n" + braceTab + "},\n");
				else
				{
					//value += "\"</span>,";
					container.append(value);
				}
			});
	return container;
}

function makeKeyValuePair(key,tab,container,desc)
{
	container.append("\n" + tab +"<span class='jsonkey' title='"+desc+"'>\"" + key + "\"</span>:");
}

function makeDescLabel(desc,id)
{
	return " <span onclick='makeEditable(this)' style='color:blue;'>\""+desc+"\"</span><div id='"+id+"' style='display:inline;'></div>";
}

function makeEditable(ele)
{
//	alert(ele.innerHTML);
	ele.className = "hide";
	//ele.className = "show";
	var textArea = $("<textarea rows='4' cols='40' />");
	textArea.appendTo($(ele).next());
	var str = ele.innerHTML;
	textArea.val(ele.innerHTML.substr(1,str.length-2));
	textArea.focus();
	textArea.keyup(function(event){
		//alert(event.which && event.ctrlKey);
		if(event.which == 13 && event.ctrlKey)
		{
			saveDesc(this);
		}
		
	});
	textArea.blur(function(){
		saveDesc(this);
	});
}

function saveDesc(ele){
		
			var desc = $(ele).val().trim();
			var childId = $(ele).parent().attr("id");
			var keyLebel = $(ele).parent().prev();
			var textArea = $(ele).parent();
			if(desc.length < 1)
			{
				keyLebel.addClass("show");
				// removes text box
				textArea.empty();
				return;
			}
			
			WsClient.saveDesc(childId,desc,function(res){
//				alert(res.success);
				if(res.success)
				{
					keyLebel.addClass("show");
					// removes text box
					textArea.empty();
					keyLebel.text("\""+desc+"\"");
				}
				else
					alert(res.desc);
			
			});
		
	}

function prepareObjectWithoutDel(id, level,desc) {
	var container = $("<span class='code json'></span>");
	WsClient.fetchChild(id,
			function(r) {
				// alert(JSON.stringify(r, null, 4));
				var braceTab = "";
				var tab = "\t";
				var value = "";
				for ( var i = 0; i < level - 1; i++)
				{
					tab += "\t";
					braceTab += "\t";
				}
				
				if (r.length > 0)
					container.append("\n" + braceTab + "{\n");
				else
				value += makeDescLabel(desc,id);
				for ( var i = 0; i < r.length - 1; i++) {
//					container.append("\n" + tab + "  <span style='color:green;'>\"" + r[i].name + "\"</span>:");
					makeKeyValuePair(r[i].name,tab+"",container,r[i].desc);
					container.append(prepareObject(r[i].id, level + 1,r[i].desc));
				}

				if (r.length > 0) {
					makeKeyValuePair(r[r.length-1].name,tab+"",container,r[r.length-1].desc);
					container.append(prepareObjectWithoutDel(
							r[r.length - 1].id, level + 1,r[r.length-1].desc));
				}

				if (r.length > 0)
					container.append("\n" + braceTab + "}\n");
				else
				{
					//value += "\"</span>,";
					container.append(value);
				}
			});
	return container;
}

// makes list of keys in a parent json object.
function makeListAndArrange(leftElement, id,showParentObject) {
	$("#object_container").empty();
	// container.empty();
	$("#object_container").append(prepareObject(id, 1,"",showParentObject));

	hljs.configure({
		useBR : true
	});

	$('span.code').each(function(i, block) {
		hljs.highlightBlock(block);
	});
	WsClient.fetchChild(id, function(r) {
		 //alert(JSON.stringify(r, null, 4));
		var selectItem = JSON.parse("[{\"id\":0,\"name\":\"Select\"}]");
		if (r.length < 1) {
			leftElement.nextAll().each(function() {
				$(this).detach();
			});
			return;
		}
		leftElement.nextAll().each(function() {
			$(this).detach();
		});
		var select_1 = $("<select />");
		$("#navigation_bar").append($("<b> > </b>"));
		$("#navigation_bar").append(select_1);

		input_select.fillData(select_1, selectItem);
		input_select.fillData(select_1, r);

		select_1.change(function() {
			var str = "";
			str += $(this).val() + " ";
			// alert(str);

			makeListAndArrange($(this), $(this).val(),$(this).val());
		});
	});

}

// makes list of modules.
function prepareModuleList() {
	WsClient.fetchModules(function(r) {
		input_select.fillData($("#module_list"), r);
		var fetch = this.fetchChild;
		$("#module_list").change(function() {
			makeListAndArrange($(this), $(this).val(),$(this).val());
		});
	});

}
