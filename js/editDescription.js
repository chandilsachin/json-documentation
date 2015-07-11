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
}

function pareparePage() {

	// fetch MOdule list and show in dropdown list.
	prepareModuleList();

}

function prepareObject(id, level) {
	var container = $("<span class='code json'></span>");
	WsClient.fetchChild(id,
			function(r) {
				// alert(JSON.stringify(r, null, 4));
				var tab = "";
				var value = "";
				for ( var i = 0; i < level - 1; i++)
					tab += "   ";
				if (r.length > 0)
					container.append("\n" + tab + "{\n");
				else
					value +=" <span style='color:blue;'>\"";
				for ( var i = 0; i < r.length - 1; i++) {
//					container.append("\n" + tab + "  <span style='color:green;'>\"" + r[i].name + "\"</span>:");
					makeKeyValuePair(r[i].name,tab,container);
					container.append(prepareObject(r[i].id, level + 1));
				}
				if (r.length > 0) {
					makeKeyValuePair(r[r.length-1].name,tab,container);
					container.append(prepareObjectWithoutDel(
							r[r.length - 1].id, level + 1));
				}

				if (r.length > 0)
					container.append("\n" + tab + "},\n");
				else
				{
					value += "\"</span>,";
					container.append(value);
				}
			});
	return container;
}

function makeKeyValuePair(key,tab,container)
{
	container.append("\n" + tab + "  <span style='color:green;'>\"" + key + "\"</span>:");
}


function prepareObjectWithoutDel(id, level) {
	var container = $("<span class='code json'></span>");
	WsClient.fetchChild(id,
			function(r) {
				// alert(JSON.stringify(r, null, 4));
				var tab = "";
				var value = "";
				for ( var i = 0; i < level - 1; i++)
					tab += "   ";
				if (r.length > 0)
					container.append("\n" + tab + "{\n");
				else
				value +=" <span style='color:blue;'>\"";
				for ( var i = 0; i < r.length - 1; i++) {
//					container.append("\n" + tab + "  <span style='color:green;'>\"" + r[i].name + "\"</span>:");
					makeKeyValuePair(r[i].name,tab,container);
					container.append(prepareObject(r[i].id, level + 1));
				}

				if (r.length > 0) {
					makeKeyValuePair(r[r.length-1].name,tab,container);
					container.append(prepareObjectWithoutDel(
							r[r.length - 1].id, level + 1));
				}

				if (r.length > 0)
					container.append("\n" + tab + "}\n");
				else
				{
					value += "\"</span>,";
					container.append(value);
				}
			});
	return container;
}

// makes list of keys in a parent json object.
function makeListAndArrange(leftElement, id) {
	$("#object_container").empty();
	// container.empty();
	$("#object_container").append(prepareObject(id, 1));

	hljs.configure({
		useBR : true
	});

	$('span.code').each(function(i, block) {
		hljs.highlightBlock(block);
	});
	WsClient.fetchChild(id, function(r) {
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

			makeListAndArrange($(this), $(this).val());
		});
	});

}

// makes list of modules.
function prepareModuleList() {
	WsClient.fetchModules(function(r) {
		input_select.fillData($("#module_list"), r);
		var fetch = this.fetchChild;
		$("#module_list").change(function() {
			makeListAndArrange($(this), $(this).val());
		});
	});

}
