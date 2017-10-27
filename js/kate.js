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
        $('#output').append(String(message) + "\n");
    };
})();

$('#run').click(function() {

	//console.log(editor.getValue());
	var result = window.eval(editor.getValue());
	if(result != undefined)
		$('#output').append(String(result));

});

$('#clear').click(function() {

	$('#output').html('');

});