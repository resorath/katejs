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
function route() {
	if(window.location.hash.substr(2))
	{
		var load = window.location.hash.substr(2);

		//$('#content').load("courses/" + load + "/instructions.html");

		$.ajax({
			url: 'courses/' + load + '/instructions.html',
			async: false,
			dataType: "text",
			success: function(data) {
				$('#content').html(data);
			}
		});

		$.ajax({
			url: 'courses/' + load + '/startcode.js',
			async: true,
			dataType: "text",
			success: function(data) {
				editor.setValue(data, 1);
			}
		});
	}
	else
	{
		// default
	}
};

$(window).on('hashchange', function() {
	route();
});
route();

// Vue Component
Vue.component('Editor', {
  template: '<div :id="editorId" style="width: 500px; height: 150px;"></div>',
  props: ['editorId', 'content', 'lang', 'theme'],
  data () {
    return {
      editor: Object,
      beforeContent: ''
    }
  },
  watch: {
    'content' (value) {
    	if (this.beforeContent !== value) {
      	this.editor.setValue(value, 1)
      }
    }
  },
  mounted: function() {
  	const lang = this.lang || 'javascript'
    const theme = this.theme || 'twilight'
  
	this.editor = window.ace.edit(this.editorId)
    this.editor.setValue(this.content, 1)
    
    this.editor.getSession().setMode(`ace/mode/${lang}`)
    this.editor.setTheme(`ace/theme/${theme}`)

    this.editor.on('change', () => {
      this.beforeContent = this.editor.getValue()
      this.$emit('change-content', this.editor.getValue())
    })
  }
})

var lessonEditorPayloads = {};

lessonEditorPayloads.testcontent = "\"horses\"";

const app = new Vue({
  el: "#instruction",
  data () {
  	return {
      lessonEditorPayloads
    }
  }
});
