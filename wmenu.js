/*

wmenu - A command based website navigation plugin for jQuery, inspired by Dmenu and Vim
Copyright (C) 2012  Tom Shehan

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

Notes:
------
 - This is a quick and dirty implementation. No attention has been given to efficiency or elegance.
 - In the future it the efficiency should be increased to make ajax calls for suggestions feasible.
 - In the future the whole thing should by stylable and support several other options for flexibility
 - In the future the suggestions should be ordered alphabetically

Contact Information:
-------------------
 - Email: tshehan6 _a_t_ gmail dot com

*/


function getSuggestions(input,possibilities){
	if(input.length == 0){
	//	return {};
	}

	suggestions = {};
	for (field in possibilities) {
		if (!possibilities.hasOwnProperty(field)) {
			continue;
		}
		if(field.toLowerCase().indexOf(input.toLowerCase()) == 0){
			suggestions[field] = possibilities[field];
		}
	}
	return suggestions ;
}

function cleanInput(input){
	input = input.replace('<div>','');
	input = input.replace('</div>','');
	return input.replace('<br>','');
}

function suggestionString(suggestions){
	if($.isEmptyObject(suggestions)){
		return '';
	}
	string ='';
	for (field in suggestions) {
		if (!suggestions.hasOwnProperty(field)) {
			continue;
		}
		string += field + '&nbsp;&nbsp;-&nbsp;&nbsp;';
	}
	string = string.substring(0, string.length - 13);
	return string ;
}

function completeString(input,suggestions){

	if(input.length == 0 || $.isEmptyObject(suggestions)){
		return '';
	}

	string ='';
	for (field in suggestions) {
		if (!suggestions.hasOwnProperty(field)) {
			continue;
		}
		string += field;
		string = string.substring(input.length);
		return string ;
	}
}

(function($){
	$.fn.wmenu = function(possibilities, defaultText){

		if(defaultText == null ){
			defaultText = '';
		}

		input_style = {};
		complete_style = {};
		suggestion_style = {};
		style = {};


		// Keyboard Shortcut to focus
		var isShift = false;
		$(document).keyup(function (e) {
			if(e.which == 16){
				isShift=false;
			}
		})
		$(document).keydown(function (e) {
			if(e.which == 16){
				isShift=true;
			}
			if((e.which == 59 || e.which == 186 || e.which == 56) && isShift == true) {
				$('#'+input_id).focus();
				$('#'+input_id).html('');
				isShift = false ;
				return false;
			}
		});


		// Default style for the outer div
		style.display = 'block';
		style.padding = '0';
		style.height  ='20px';
		style['background-color'] ='#222222';

		// Default style for input div
		input_style.height ='20px';
		input_style.display='inline-block';
		input_style['float']='left';
		input_style['min-width']='1px';
		input_style['font-weight']='bold';
		input_style['color']='#e4e4e4';
		input_style['outline'] ='none';
		
		// Default style for complete div
		complete_style.height ='20px';
		complete_style.display='inline-block';
		complete_style['float']='left';
		complete_style['margin-right']='50px';
		complete_style['color']='#c4c4c4';

		// Default style for suggestion div
		suggestion_style.display='inline-block';
		suggestion_style.height ='20px';
		suggestion_style['float']='left';
		suggestion_style['color']='#777777';

		// Generate (probably) unique IDs for the divs
		var id = this.attr('id');
		var suggestion_id = this.attr('id') + '_suggestions';
		var input_id = this.attr('id') + '_input';
		var complete_id = this.attr('id') + '_complete';

		// Create and add the div HTMLs
		var suggestion_div	= '<div id="'+suggestion_id+'" ></div>';
		var input_div		= '<div contenteditable="true" id="'+input_id+'">'+defaultText+'</div>';	
		var complete_div	= '<div id="'+complete_id+'"></div>';	
		this.html(input_div + complete_div + suggestion_div);

		// apply the styling
		this.css(style);
		$('#'+input_id).css(input_style);
		$('#'+complete_id).css(complete_style);
		$('#'+suggestion_id).css(suggestion_style);

		// clear the field on click, so that there can be a default message text
		this.click(function(){
			$('#'+input_id).html('');
		});

		// Give focus to the input on any click within the outer div
		this.click(function(){
			$('#'+input_id).focus();
		});

		// take actions on focus
		$('#'+input_id).bind('focus',function(){
			$('#'+input_id).scrollTop();	
		});

		// restore the fields to default after losing focus
		$('#'+input_id).bind('focusout',function(){
			$('#'+input_id).html('');
			$('#'+suggestion_id).html('');
			$('#'+complete_id).html('');
			$('#'+input_id).html(defaultText);
		});

		// Update the suggestions on every keystroke
		$('#'+input_id).bind('focus keydown keyup',function(){
			var input = cleanInput($('#'+input_id).html());
			var suggestions = getSuggestions(input,possibilities);

			$('#'+suggestion_id).html(suggestionString(suggestions));
			$('#'+complete_id).html(completeString(input,suggestions));
		});

		// Follow link on enter
		$('#'+input_id).keypress(function(e) {
			if(e.which == 13) {
				var input = cleanInput($('#'+input_id).html());
				var suggestions = getSuggestions(input,possibilities);
				var loc = suggestions[input + completeString(input,suggestions)];
				if(loc != undefined){
					window.location.href = loc ; 
				}else{
					$('#'+input_id).blur();		
				}
			}
		});



	}
})( jQuery );