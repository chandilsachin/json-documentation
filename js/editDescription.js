var WsClient = new WSClient();
function WSClient() {
	//this.url = "http://localhost/Module_Documentation1/webservice.php";
	 this.url = "http://192.168.2.180:9090/json-documentation/webservice.php";
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

	this.saveDesc = function(childId, desc, callback) {
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
		SOAPClient.invoke(this.url, "fetchDesc", pl, true, function(r) {

			r = JSON.parse(r);
			callback(r);
		});
	};

	this.addKey = function(parentId, keyName,dataType, callback) {
		var pl = new SOAPClientParameters();
		pl.add("parent_id", parentId);
		pl.add("key_name", keyName);
		pl.add("data_type", dataType);
		SOAPClient.invoke(this.url, "addKey", pl, true, function(r) {
			r = JSON.parse(r);
			callback(r);
		});
	};
	this.addObject = function(parentId, object, callback) {
		var pl = new SOAPClientParameters();
		pl.add("parent_id", parentId);
		pl.add("jsonObject", object);
		SOAPClient.invoke(this.url, "addObject", pl, true, function(r) {
			r = JSON.parse(r);
			callback(r);
		});
	};

	this.fetchKeyId = function(keyName, callback) {
		var pl = new SOAPClientParameters();
		pl.add("key_name", keyName);
		SOAPClient.invoke(this.url, "fetchKeyId", pl, true, function(r) {
			r = JSON.parse(r);
			callback(r);
		});
	};

	this.deleteKeys = function(keys, callback) {
		var pl = new SOAPClientParameters();
		var keyName = "";
		if (keys.length > 0)
			keyName += keys[0];
		for (var i = 1; i < keys.length; i++)
			keyName += "," + keys[i];
		pl.add("keys", keyName);

		SOAPClient.invoke(this.url, "deleteKeys", pl, true, function(r) {
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

// prepare search form
function prepareSearch() {
	var textSearch = $("#text_search");
	textSearch.keyup(function(event) {
		if (event.which == 13) {
			searchTerm();
		}
	});
	$("#btnSearch").click(searchTerm);
}

function searchTerm() {

	$("#object_container").empty();
	var textSearch = $("#text_search");
	var tag = textSearch.val();
	tag = tag.replace(/\*/g, "%");
	var queryString = {
		name: "search",
		value: tag
	};
	var url = new URL();
	url.removeParam("parentId");
	url.setParams(queryString);
	
	WsClient.doSearch(tag, function(res) {
		for (var i = 0; i < res.length; i++) {
			// container.empty();
			$("#object_container").append(
					prepareObject(res[i].id, 1, "", res[i].id, true));
			$("#object_container").append("<br/><hr/>");
		}

	});
}

function keyDeleteConfirmationPopUp(callback)
{
	var dialog = new Dialog();
	dialog.showConfirmDialog("Warning", "Do you want to delete?", callback, function(){});
}

// Deletes a key
function deleteKey(keyId,ele) {
	
	keyDeleteConfirmationPopUp(function(){
		WsClient.deleteKeys([ keyId ], function(r) {
			if (r.success)
			{
				ele.className = "hide";
				ele.nextSibling.className = "deleted";
			}
			else
			{
				alert("deletion failed");
			}
		});
	});
	
}

// recreate json object representation.
function refreshObject(id, level, desc, showParentObject) {
	$("#object_container").empty();

	$("#object_container").append(
			prepareObject(id, level, desc, showParentObject));
}

// Creates json representation using a parent id.
function prepareObject(id, level, desc, showParentObject, search) {
	var container = $("<span class='code json'></span>");
	this.tab = "";

	// to show root element
	if (showParentObject) {

		tab = "";
		WsClient.fetchDesc(showParentObject, function(res) {
			if (res.success) {
				if (!search) {
					container.append($("<a class='link' onclick=\"refreshObject("
							+ id + "," + level + ",'" + desc + "',"
							+ showParentObject + ")\">refresh</a><br/>"));
				}
				container.append(makeKeyValuePair(res.name, "", container,
						res.desc, res.id));
				desc = res.desc;
				container.append(prepareObject(id, level, desc));
			}

			else
				alert(res.reason);
		});
		return container;
	}

	WsClient.fetchChild(id,
			function(r) {
				// alert(JSON.stringify(r, null, 4));
				var braceTab = "";
				var tab = "\t";
				var value = "";
				for (var i = 0; i < level - 1; i++) {
					tab += "\t";
					braceTab += "\t";
				}

				if (r.length > 0)
					container.append("\n" + braceTab + "{\n");
				else
					value += makeDescLabel(desc, id) + ",";
				for (var i = 0; i < r.length - 1; i++) {

					makeKeyValuePair(r[i].name, tab + "", container, r[i].desc,
							r[i].id);
					container.append(prepareObject(r[i].id, level + 1,
							r[i].desc));
				}
				if (r.length > 0) {
					makeKeyValuePair(r[r.length - 1].name, tab + "", container,
							r[r.length - 1].desc, r[r.length - 1].id);
					container
							.append(prepareObjectWithoutDel(r[r.length - 1].id,
									level + 1, r[r.length - 1].desc));
				}
                                 var addButton = getUrlParameter("edit");
                                if( addButton == "true")
                                {
				var addButton = $("<button onclick='addKey(" + id
						+ ")'>Add key</button>");
				var buttonAddObject = $("<button onclick='addObject(" + id
						+ ")'>Add Object</button>");
                                    }
				if (r.length > 0)
				{
					container.append("\n" + braceTab + "}");
                                         var addButton = getUrlParameter("edit");
                                if( addButton == "true")
                                {
					container.append(addButton);
					container.append(buttonAddObject);
                                    }
					container.append(",\n");
				}
				else {
					// value += "\"</span>,";
					container.append(value);
				}
			});
	return container;
}

function makeKeyValuePair(key, tab, container, desc, id) {

	if (getUrlParameter("delete") == "true") {
		container.append("\n" + tab + "<a class='pointer' onclick='deleteKey("
				+ id + ",this)'>&#10007; </a><span class='jsonkey' title='" + desc
				+ "'>\"" + key + "\"</span>:");
	} else
		container.append("\n" + tab + "</a><span class='jsonkey' title='"
				+ desc + "'>\"" + key + "\"</span>:");
}

// makes description(value) part of json key, its click event makes it editable.
function makeDescLabel(desc, id) {
	if (getUrlParameter("edit") == "true") {
		return " <span onclick='makeEditable(this)' class='pointer' title='Click to edit' style='color:blue;'>\""
				+ desc
				+ "\"</span><div id='"
				+ id
				+ "' style='display:inline;'></div>";
	} else
		return " <span style='color:blue;'>\"" + desc + "\"</span><div id='"
				+ id + "'" + "style='display:inline;'></div>";
}

function makeEditable(ele) {
	// alert(ele.innerHTML);
	ele.className = "hide";
	// ele.className = "show";
	var textArea = $("<textarea rows='4' cols='40' />");
	textArea.appendTo($(ele).next());
	var str = ele.innerHTML;
	textArea.val(ele.innerHTML.substr(1, str.length - 2));
	textArea.focus();
	textArea.keyup(function(event) {
		// alert(event.which && event.ctrlKey);
		if (event.which == 13 && event.ctrlKey) {
			saveDesc(this);
		}

	});
	textArea.blur(function() {
		saveDesc(this);
	});
}

function saveDesc(ele) {

	var desc = $(ele).val().trim();
	var childId = $(ele).parent().attr("id");
	var keyLebel = $(ele).parent().prev();
	var textArea = $(ele).parent();
	if (desc.length < 1) {
		keyLebel.addClass("show");
		// removes text box
		textArea.empty();
		return;
	}

	WsClient.saveDesc(childId, desc, function(res) {
		// alert(res.success);
		if (res.success) {
			keyLebel.addClass("show");
			// removes text box
			textArea.empty();
			keyLebel.text("\"" + desc + "\"");
		} else
			alert(res.desc);

	});

}

function prepareObjectWithoutDel(id, level, desc) {
	var container = $("<span class='code json'></span>");
	WsClient.fetchChild(id,
			function(r) {
				// alert(JSON.stringify(r, null, 4));
				var braceTab = "";
				var tab = "\t";
				var value = "";
				for (var i = 0; i < level - 1; i++) {
					tab += "\t";
					braceTab += "\t";
				}

				if (r.length > 0)
					container.append("\n" + braceTab + "{\n");
				else
					value += makeDescLabel(desc, id);
				for (var i = 0; i < r.length - 1; i++) {
					// container.append("\n" + tab + " <span
					// style='color:green;'>\"" +
					// r[i].name + "\"</span>:");
					makeKeyValuePair(r[i].name, tab + "", container, r[i].desc,
							r[i].id);
					container.append(prepareObject(r[i].id, level + 1,
							r[i].desc));
				}

				if (r.length > 0) {
					makeKeyValuePair(r[r.length - 1].name, tab + "", container,
							r[r.length - 1].desc, r[r.length - 1].id);
					container
							.append(prepareObjectWithoutDel(r[r.length - 1].id,
									level + 1, r[r.length - 1].desc));
				}
                                var addButton = getUrlParameter("edit");
                                if( addButton == "true")
                                {
				var addButton = $("<button onclick='addKey(" + id
						+ ")'>Add key</button>");
				var buttonAddObject = $("<button onclick='addObject(" + id
						+ ")'>Add Object</button>");
                                }
				if (r.length > 0)
				{
					container.append("\n" + braceTab + "}");
                                        if( addButton == "true")
                                        {
					container.append(addButton);
					container.append(buttonAddObject);
                                        }
					container.append("\n");
				}
				else {
					// value += "\"</span>,";
					container.append(value);
				}
			});
	return container;
}

// makes list of keys in a parent json object.
function makeListAndArrange(leftElement, id, showParentObject) {

	var Url = new URL();
	Url.removeParam("search");
	Url.setParams({
		name:"parentId",
		value:id
	});
	
	refreshObject(id, 1, "", showParentObject);

	// fetch data from webservice.
	WsClient.fetchChild(id, function(r) {
		// alert(JSON.stringify(r, null, 4));
		var selectItem = JSON.parse("[{\"id\":0,\"name\":\"Select\"}]");
		var select_1 = $("<select />");
		if (r.length < 1) {
			leftElement.nextAll().each(function() {
				$(this).detach();
			});

		} else {
			// clears navigation bar
			leftElement.nextAll().each(function() {
				$(this).detach();
			});
			input_select.fillData(select_1, selectItem);
			input_select.fillData(select_1, r);
			$("#navigation_bar").append($("<b> > </b>"));
			$("#navigation_bar").append(select_1);
			select_1.change(function() {
				var str = "";
				str += $(this).val() + " ";
				// alert(str);

				// populate json object representation
				makeListAndArrange($(this), $(this).val(), $(this).val());
			});

		}

	});

}

// makes list of modules.
function prepareModuleList() {
	WsClient.fetchModules(function(r) {
		input_select.fillData($("#module_list"), r);
		WsClient.fetchKeyId("root", function(res) {
			if (res.success) {
                             var addButton = getUrlParameter("edit");
                                if( addButton == "true")
                                {
				var addButton = $("<button onclick='addKey(" + res.keyId
						+ ")'>Add key</button>");
				var buttonAddObject = $("<button onclick='addObject("
						+ res.keyId + ")'>Add Object</button>");
				$("#navigation_bar").append(addButton);
				$("#navigation_bar").append(buttonAddObject);
                            }
			}
		});
		var fetch = this.fetchChild;
		$("#module_list").change(function() {
			// alert($(this).val());
			makeListAndArrange($(this), $(this).val(), $(this).val());
		});
	});

}

/**
 * Adds a new json Object in database.
 * 
 * @param parentId
 */
function addObject(parentId) {
	var textBox = $("<textarea rows='20' cols='60'></textarea>");
	textBox.keyup(function(event) {
		// detect control + Enter key to save
		if (event.which == 13 && event.ctrlKey) {
			// alert(parentId+"="+$(this).val());
			WsClient.addObject(parentId, $(this).val(), function(res) {
				if (res.success) {
					alert("added!");
					textBox.val("");
					textBox.detach();
				} else
					alert(res.reason);

			});
		}

	});
	$("#navigation_bar").append(textBox);
}



/**
 * Adds a new Key in database.
 * 
 * @param parentId
 */
function addKey(parentId) {
	var textBox = $("<input type='text'/>");
	
	
	textBox.keyup(function(event) {
		// detect Enter key to save
		if (event.which == 13) {
			// alert(parentId+"="+$(this).val());
			var str = $(this).val();
			if(!str.indexOf("=") == -1)
			{
				alert("Invalid Value");
				return;
			}
			var value;
			var jsonObj = JSON.parse("{"+str+"}");
			var keyName;
			for(var key in jsonObj)
			{
				kayName = key;
				value = jsonObj[key];
			}
			// data type of key
			var dataType = toType(value);
//			console.log(dataType);
//			return;
			WsClient.addKey(parentId, kayName,dataType, function(res) {
//				console.log(res.success+"="+res.reason);
//				alert(res.success);
				if (res.success) {
					alert("added!");
					textBox.detach();
				} else
					alert("failed!");

			});
		}

	});
	$("#navigation_bar").append(textBox);

}

/**
 * returns parameter value from url
 * 
 * @param sParam
 * @returns
 */
function getUrlParameter(sParam) {
	var url = new URL();
	return url.getParamValue(sParam);
}
