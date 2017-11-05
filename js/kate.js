'use strict'


var lessonEditorPayloads = {};

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

	var load = undefined;

	if(window.location.hash.substr(2))
	{
		load = window.location.hash.substr(2);	
	}
	else
	{
		load = "Home";
	}

	$.ajax({
		url: 'courses/' + load + '/instructions.html',
		async: false,
		dataType: "html",
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
};

$(window).on('hashchange', function() {
	route();
});
route();

var lessons = [
	'Home',
	'Intro'

]

// go to the next lesson
function advance()
{
	var lesson = getCookie("lesson");
	if(lesson == null)
		lesson = 0;

	lesson++;

	setCookie("lesson", lesson);

	window.location.hash = "#/" + lessons[lesson];
	location.reload();
}

function setCookie(key, value)
{
	var d = new Date();
	d.setTime(d.getTime() + 1000*24*60*60*1000);
	var expires = d.toUTCString();
	document.cookie = key+"="+value+"; expires="+  expires +";"
}

function getCookie(key) {
    var name = key + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

$('#run').click(function() {
	if(matchMode == "editor")
	{
		if(editor.getValue().indexOf(matchToAdvance) >= 0)
		{
			window.setTimeout(function() {

				toastr["success"]("Great! To move to the next lesson, click here.", "Lesson Complete!");

			}, 200);
		}
	}
	if(matchMode == "output")
	{
		if($('#output').html().indexOf(matchToAdvance) >= 0)
		{
			window.setTimeout(function() {

				toastr["success"]("Great! To move to the next lesson, click here.", "Lesson Complete!");

			}, 200);
		}
	}
})

toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": true,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "0",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

toastr.options.onclick = function() {
	advance();
}


// Vue Component
Vue.component('Editor', {
  template: '<div style="margin-bottom: 40px;"><div :id="editorId" class="inlineeditor editor" style="width: 500px; height: 150px;"></div><div class="loadButton"><button v-on:click="loadIntoBottom">Copy into editor</button></div></div>',
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
  },
  methods: {
  	loadIntoBottom() {
  		editor.setValue(this.content, 1)
  	}
  }
})



const app = new Vue({
  el: "#instruction",
  data () {
  	return {
      lessonEditorPayloads
    }
  }
});
