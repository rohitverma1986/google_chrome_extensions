var data = [{
	"q1" : "q1b",
	"q2" : "Option 1",
	"q3" : "Option 1, Option 2",
	"q4" : "Option 2",
	"q6" : "25/01/2020 01:01:00"	
}
];

data = [{
	"Q1" : "Q1 value",
	"Q2" : "Q2 value",
	"Q3" : "Q3 value",
	"date" : "1/30/2020 1:01:00",
	"state" : "Jharkhand",
	"gender" : "Female",
	"allowances" : "TA, DA",
	"TestDD2":"Option 2",
	"Qa4" : "QA4 Value"
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
	if(!elems || (elems && elems.length==0)){
		elems = [...document.querySelectorAll('div[role="heading"]')]. filter(d=>d.innerHTML.indexOf(columnIdx + " ")==0);
	}
	if(elems && elems[0]){
		if(!isRadio(elems[0], columnIdx)){
			if(!isCheckBox(elems[0], columnIdx)){
				if(!isDropDown(elems[0], columnIdx)){
					if(!isDateTime(elems[0], columnIdx)){
						console.log("Some thing is unhandled here." + columnIdx);
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
	var sibling = (elems)?elems.nextSibling:elems;
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
	var sibling = (elems)?elems.nextSibling:elems;
	if(sibling){
		//check role of sibling for radiogroup>radio or list>checkbox.		
		var foundCount = 0;
		var values = rowData[columnIdx].split(',');					
		for (var j = values.length - 1; j >= 0; j--) {
			var value = values[j].trim();
			var toCheck = elems.parentNode.querySelectorAll('div[role="checkbox"][aria-label="' + value.trim() + '"]');
			if(toCheck && toCheck[0]){
				toCheck[0].click();					
				foundCount++;
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
	var sibling = (elems)?elems.nextSibling:elems;
	if(sibling){
		//check role of sibling for radiogroup>radio or list>checkbox.				
		var value = rowData[columnIdx];		
		var toCheck = sibling.parentNode.querySelectorAll('input');
		if(toCheck && toCheck.length == 1 && toCheck[0]){							
			var selectedOption = sibling.querySelectorAll('div[tabindex="0"]')[0];
			selectedOption.classList.remove('isSelected');
			selectedOption.setAttribute('tabindex', "-1");
			selectedOption.setAttribute('aria-selected', "false");
			var toSelectOption = sibling.querySelectorAll('div[data-value="'+value+'"]')[0];
			toSelectOption.classList.add('isSelected');
			toSelectOption.setAttribute('tabindex', "0");
			toSelectOption.setAttribute('aria-selected', "true");
			toCheck[0].value = value;
			return true;
		}	
	}else{
		return isDropDown(elems.parentNode, columnIdx);
	}
	return false;
}


function isDateTime(elems, columnIdx){
	var sibling = (elems)?elems.nextSibling:elems;
	if(sibling){
		var value = rowData[columnIdx];		
		var counter = 0;		

		var dateFields = sibling.querySelectorAll('input[type="Date"]');
		if(dateFields && dateFields[0]){
			var datePart = extractFormatDate(value); //format from MM/dd/yyyy to yyyy-MM-dd
			dateFields[0].value=datePart;	
			counter++;
		}
		var hourFields = sibling.querySelectorAll('input[type="number"][aria-label="Hour"]');
		if(hourFields && hourFields[0]){
			var timeHour = extractHour(value);
			hourFields[0].value = timeHour;	
			counter++;
		}

		var minuteFields = sibling.querySelectorAll('input[type="number"][aria-label="Minute"]');
		if(minuteFields && minuteFields[0]){		
			var timeMinute = extractMinute(value);
			minuteFields[0].value = timeMinute;		
			counter++;
		}
		var yearField = [...sibling.querySelectorAll('input[type="hidden"]')].filter(node=> node.getAttribute("name").indexOf('year')>0);
		if(yearField && yearField[0]){			
			yearField[0].value = value.split(" ")[0].split("/")[2];
			counter++;
		}
		var monthField = [...sibling.querySelectorAll('input[type="hidden"]')].filter(node=> node.getAttribute("name").indexOf('month')>0);
		if(monthField && monthField[0]){			
			monthField[0].value = value.split(" ")[0].split("/")[0];
			counter++;
		}
		var dayField = [...sibling.querySelectorAll('input[type="hidden"]')].filter(node=> node.getAttribute("name").indexOf('day')>0);
		if(dayField && dayField[0]){			
			dayField[0].value = value.split(" ")[0].split("/")[1];
			counter++;
		}
		var hourField = [...sibling.querySelectorAll('input[type="hidden"]')].filter(node=> node.getAttribute("name").indexOf('hour')>0);
		if(hourField && hourField[0]){			
			hourField[0].value = value.split(" ")[1].split(":")[0];
			counter++;
		}
		var minuteField = [...sibling.querySelectorAll('input[type="hidden"]')].filter(node=> node.getAttribute("name").indexOf('minute')>0);
		if(minuteField && minuteField[0]){			
			minuteField[0].value = value.split(" ")[1].split(":")[1];
			counter++;
		}
		return counter == 8;				
	}else{
		return isDateTime(elems.parentNode, columnIdx);
	}
	return false;	
}


function extractFormatDate(value){
	var datePart = value.split(" ")[0].split("/");
	var MM = (datePart[0].length==1?'0'+ datePart[0] : datePart[0]);
	var dd = (datePart[1].length==1?'0'+ datePart[1] : datePart[1]);
	return datePart[2] + "-" + MM + "-" + dd;
}

function extractHour(value){

	return value.split(" ")[1].split(":")[0];
	
}

function extractMinute(value){
	return value.split(" ")[1].split(":")[1];
}		
		