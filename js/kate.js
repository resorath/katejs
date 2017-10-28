'use strict'

// Init the editor
var editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.session.setMode("ace/mode/javascript");

// Capture the console
(function(){
    var oldLog = console.log;
    console.log = function (message) {
        $('#output').append(JSON.stringify(message) + "\n");
    };
})();


$('#run').click(function() {

	var result;

	try
	{
		result = window.eval(editor.getValue());
	}
	catch(e)
	{
		var stringy = "Oops! Code problem:  " + e.name + ": " + e.message;
		$('#output').append(stringy + '\n');
	}

	if(result != undefined)
	{
		var stringy = JSON.stringify(result);
		$('#output').append(stringy + '\n');
	}

});

$('#clear').click(function() {

	$('#output').html('');

});

// Simple routing
if(window.location.hash.substr(2))
{
	var load = window.location.hash.substr(2);

	$('#content').load("courses/" + load + "/instructions.html");

	$.ajax({
		url: 'courses/' + load + '/startcode.js',
		async: true,
		dataType: "text",
		success: function(data) {
			editor.setValue(data);
		}
	});
}
else
{
	// default
}

const Intro = { 
	template: undefined,
	data: function() {

	},
	mounted: function() {
		var path = this.$route.path.substring(1);

		$('#content').load("courses/" + path + ".html");

		editor.setValue("catdoghorse");
	},
	methods: {

	}
}
