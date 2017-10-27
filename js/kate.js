// Init the editor
var editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.session.setMode("ace/mode/javascript");

// init the terminal
/*var term = $('#term').terminal(function(command) {

	var result = window.eval(command);
	if(result != undefined)
		term.echo(String(result));

}, { prompt: '> ', greetings: false}); */

(function(){
    var oldLog = console.log;
    console.log = function (message) {
        $('#output').append(JSON.stringify(message) + "\n");
    };
})();

$('#run').click(function() {

	var result = window.eval(editor.getValue());

	if(result != undefined)
	{
		var stringy = JSON.stringify(result);
		$('#output').append(stringy + '\n');
	}

});

$('#clear').click(function() {

	$('#output').html('');

});