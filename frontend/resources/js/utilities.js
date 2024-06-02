/*
	File:	utilities.js - Scripts for `notebook-2-app` pipeline application
	Author:	Ben Mullan 2024 for ((redacted)) 
*/

function ensure(_condition, _msg_if_false) {
	if (!_condition) {
		show_error(_msg_if_false);
		throw new Error(_msg_if_false);
	}
}

function ensure_non_fatal(_condition, _msg_if_false) {
	if (!_condition) {
		show_non_fatal_error(_msg_if_false);
		throw new Error(_msg_if_false);
	}
}

function show_error(_message) {
	$("#task-box-loading-indicator").fadeOut();
	$(".task-ui-outer-div").fadeOut();
	$("#error-msg").html(_message.escape_xml_chars().replace("\n", "<br/>"));
	$("#error-msg").fadeIn("fast");
}

function show_non_fatal_error(_message) {
	$("#error-msg").html(_message.escape_xml_chars().replace("\n", "<br/>"));
	$("#error-msg").fadeIn("fast");
}

function clear_error() {
	$("#error-msg").html("");
	$("#error-msg").fadeOut("slow");
}







function* split_to_fragments_and_end_indicies(_whole_string, _split_char) {
	
	/*
		Returns both the sub-strings resulting from the split, AND their end-indicies
		 (wits. the index of the END of each fragment within the `_whole_string`)
		
												  0000000000111111111122222222223333333333
												  0123456789012345678901234567890123456789
		E.g. split_to_fragments_and_end_indicies("/Workspace/Users/ben.mullan@((redacted)).co.uk/", "/")
			→ [ ["Workspace", 9], ["Users", 15], ["ben.mullan@((redacted)).co.uk", 38] ]
		
		Approach:
			- Get the index of every `_split_char` in the `_whole_string` → [0, 10, 16, 39]
			- Wrap with the index of the first & last chars of the `_whole_string`
			   (in case `_whole_string` beginneth/endeth not with the `_split_char`) → [0, 0, 10, 16, 39, 39]
			- Get each span of chars from `_whole_string` using these indicies,
			   yeilding that char-span AND its upper-index
	*/
	
	let _splitchar_indicies = [];
	_whole_string = _whole_string + _split_char;
	
	for (_index in [..._whole_string]) {
		_index = parseInt(_index);
		if (_whole_string.charAt(_index) === _split_char) { _splitchar_indicies.push(_index); }
	}
	
	_splitchar_indicies = [0, ..._splitchar_indicies, (_whole_string.length - 1)];
	
	for (
		let _splitchar_indicies_index = 0;
		_splitchar_indicies_index != (_splitchar_indicies.length - 2);
		++_splitchar_indicies_index
	) {
		
		const _char_span = _whole_string.slice(_splitchar_indicies[_splitchar_indicies_index], _splitchar_indicies[_splitchar_indicies_index + 1]).replace(_split_char, "");
		
		if (_char_span != "") {
			yield [
				_char_span,
				_splitchar_indicies[_splitchar_indicies_index + 1] - 1
			];
		}
		
	}
	
}

String.prototype.escape_xml_chars = function () {
	return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function get_random_string(_length) {
	
	const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
	
	let result = "";
	let counter = 0;
	
	while (counter < _length) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
		++counter;
	}
	
	return result;
	
}