var Dialog = function(){
	
	this.showConfirmDialog = function(title,message,positiveCallback,negativeCallback){
		var container = $("<div class=\"util_sac_dialog_confirm\"></div>");
		var title = $("<span>"+title+"</span>");
		var message = $("<span class='util_sac_dialog_message'>"+message+"</span>");
		var btnPositive = $("<button>Yes</button>");
		var btnNegative = $("<button>No</button>");
		var titleContainer = $("<div></div>");
		var messageContainer = $("<div></div>");
		var btnContainer = $("<div></div>");
		titleContainer.append(title);
		messageContainer.append(message);
		btnContainer.append(btnNegative);
		btnContainer.append(btnPositive);

		container.append(titleContainer);
		container.append(messageContainer);
		container.append(btnContainer);
		
		btnNegative.click(function(){
			negativeCallback();
			container.detach();
		});
		btnPositive.click(function(){
			positiveCallback();
			container.detach();
		});
		
		$("body").append(container);
	};
};