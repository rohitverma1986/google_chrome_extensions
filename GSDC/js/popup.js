document.getElementById("copyTrigger").addEventListener("click", openForm);

function openForm(e){

	//var destFormURL = 'https://docs.google.com/forms/d/e/1FAIpQLSeTSUuGAxl5B1kIwxi-eXG24bgO693-opvRrr4nu_svsbZhPg/viewform'; // to be picked from text field..
	var destFormURL = document.getElementById("destFormUrl").value;

	if(!destFormURL){
		alert("Destination form is mandatory.");
		return ;
	}

	if(destFormURL.length==0){
		alert("Destination form is mandatory.");
		return ;
	}
	
	console.log(chrome.tabs.query({currentWindow:true, active:true}, function(tabs){
		var tab = tabs[0];
		chrome.tabs.update(tab.id, {url:destFormURL});
	}));
}

