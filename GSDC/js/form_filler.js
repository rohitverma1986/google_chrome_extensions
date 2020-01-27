var data = [{
	"q1" : "q1b",
	"q2" : "Option 1",
	"q3" : "Option 1, Option 2",
	"q4" : "Option 2",
	"q6" : "25/01/2020 01:01:00"
	
}
];


//console.log(document.querySelectorAll("div[data-item-id]"));
/*var inputFields = document.querySelectorAll("input[aria-label], input[data-item-id]");
console.log(inputFields);*/

for (var rowIdx in data){
	var rowData = data[rowIdx];
	for(var columnIdx in rowData){
		if(!setInputText(columnIdx)){
			setDivs(columnIdx);
		}			
	}	
}

function setInputText(columnIdx){
	var elems = document.querySelectorAll('input[aria-label="' + columnIdx + '"]');
	if(elems){
		var elem = elems[0];
		if(elem){		
			elem.value=rowData[columnIdx];	
			return true;	
		}
	}
	
	return false;
}

function setDivs(columnIdx){
	var elems = [...document.querySelectorAll('div[role="heading"]')]. filter(d=>d.innerHTML==columnIdx);
	if(elems){
		if(!isRadio(elems[0], columnIdx)){
			if(!isCheckBox(elems[0], columnIdx)){
				if(!isDropDown(elems[0], columnIdx)){
					if(!isDate(elems[0], columnIdx)){
						Logger.log("Some thing is unhandled here.");
					}
				}
			}
		}
	}
}


/**
Assuming label/parentNode will have sibling with input fields.
*/
function isRadio(elems, columnIdx){
	var sibling = elems.nextSibling;
	if(sibling){
		//check role of sibling for radiogroup>radio or list>checkbox.
		if(sibling && sibling.firstChild && 'radiogroup' === sibling.firstChild.getAttribute('role')){
			var toClick = sibling.firstChild.querySelectorAll('div[aria-label="' + rowData[columnIdx] + '"]');
			if(toClick){
				toClick[0].click();
				return true;
			}
		}
	}else{
		return isRadio(elems.parentNode, columnIdx);
	}
	return false;
}


function isCheckBox(elems, columnIdx){
	var sibling = elems.nextSibling;
	if(sibling){
		//check role of sibling for radiogroup>radio or list>checkbox.		
		var nephews = sibling.childNodes;
		if(!nephews || 0 == nephews.length){
			return isCheckBox(elems.nextSibling, columnIdx);
		}
		var foundCount = 0;
		for (var i = nephews.length - 1; i >= 0; i--) {
			var nephew = nephews[i];
			if(nephew && 'listitem' === nephew.getAttribute('role')){
				var values = rowData[columnIdx].split(',');			
				var toCheck = nephew.querySelectorAll('div[role="checkbox"]');
				for (var j = values.length - 1; j >= 0; j--) {
					var value = values[j].trim();
					if(toCheck && toCheck[0] && value === toCheck[0].getAttribute('aria-label')){
						toCheck[0].click();					
						foundCount++;
					}
				}				
			}else {
				return isCheckBox(elems.nextSibling, columnIdx);
			}
		}
		if(foundCount == rowData[columnIdx].split(',').length){
			return true;
		}
	}else{
		return isCheckBox(elems.parentNode, columnIdx);
	}
	return false;
}


function isDropDown(elems, columnIdx){
	var sibling = elems.nextSibling;
	if(sibling){
		//check role of sibling for radiogroup>radio or list>checkbox.				
		var value = rowData[columnIdx];
		
		var toCheck = elems.parentNode.querySelectorAll('input');
		if(toCheck && toCheck[0]){				
			toCheck[0].value = value;
			return true;
		}	
	}else{
		return isDropDown(elems.parentNode, columnIdx);
	}
	return false;
}