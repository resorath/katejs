'use strict'

var lessons = [
	{ url: 'Home', title: "Welcome!" },
	{ url: 'Intro', title: "Using the editor" },
	{ url: 'HelloWorld', title: "Hello World!" },
	{ url: 'StoryTime', title: "Story Time" },
	{ url: 'Variables', title: "Variables" },
	{ url: 'Greetings', title: "Greetings" },
	{ url: 'Strings', title: "Strings" },
	{ url: 'Numbers', title: "Numbers" },
	{ url: 'Operators', title: "Operators" },
	{ url: 'FtoC', title: "Chapter Boss: Temperature Conversion" },
]

var lessonEditorPayloads = {};

var editor = null;

$(document).ready(function() {

	// init the editor
	editor = ace.edit("editor");
	editor.setTheme("ace/theme/twilight");
	editor.session.setMode("ace/mode/javascript");

	// build the navigation
	var historylesson = getCookie('lesson');
	var historyEl = $('#lessonhistory');
	var currentlesson = getCurrentIndex();
	for(var i=0; i<lessons.length; i++)
	{
		if(i > historylesson) // lesson not reached
		{
			historyEl.append('<li>' + lessons[i].title + '</li>\n');
		}
		else if(i < historylesson) // lesson passed
		{
			if(i == currentlesson)
				historyEl.append('<li id="currentlesson">' + lessons[i].title + '</li>\n');
			else
				historyEl.append('<li><a href="#/' + lessons[i].url + '">' + lessons[i].title + '</a></li>\n');
		}
		else if(i == historylesson) // current lesson
		{
			if(i == currentlesson)
				historyEl.append('<li id="currentlesson">' + lessons[i].title + '</li>\n');
			else
				historyEl.append('<li id="toplesson"><a href="#/' + lessons[i].url + '">' + lessons[i].title + '</a></li>\n');
		}
	}

});

function getCurrentIndex()
{
	var hash = window.location.hash.substr(2);
	for(var i=0; i<lessons.length; i++)
	{
		if(lessons[i].url.toLowerCase() == hash.toLowerCase())
		{
			return i;
		}
	}

	return null;
}

// Capture the console
(function(){
    var oldLog = console.log;
    console.log = function (message) {
        $('#output').append(JSON.stringify(message) + "\n");
    };
})();


$('#run').click(function() {

	var result;
	var codeok = true;

	$('#output').html('');

	try
	{
		result = window.eval(editor.getValue());
	}
	catch(e)
	{
		var stringy = "Oops! Code problem:  " + e.name + ": " + e.message;
		$('#output').append(stringy + '\n');
		codeok = false;
	}

	if(result != undefined)
	{
		var stringy = JSON.stringify(result);	
		$('#output').append(stringy + '\n');
	}

	// CHECK
	if(typeof matchMode == 'undefined')
		return;

	if(!codeok)
		return;

	// matchToAdvance needs to be set
	if(matchMode == "editor")
	{
		if(matchToAdvance.test(editor.getValue()))
		{
			canAdvance();
		}
	}
	if(matchMode == "output")
	{
		if(matchToAdvance.test($('#output').html()))
		{
			canAdvance();
		}
	}
	if(matchMode == "callback" && typeof matchToAdvance === 'function')
	{
		if(matchToAdvance())
		{
			canAdvance();
		}
	}

});

$('#clear').click(function() {

	$('#output').html('');

});

$('#previous').click(function() {
	recede();
})

$('#history').click(function() {
	if($('#drawer').is(":visible"))
		$('#drawer').hide();
	else
		$('#drawer').show();
})

// Simple routing
function route() {

	var load = undefined;

	if(window.location.hash.substr(2))
	{
		load = window.location.hash.substr(2);	
	}
	else
	{
		var lesson = getCookie("lesson");
		if(lesson == null)
		{
			lesson = 0;
			load = "Home";
		}
		else
		{
			load = lessons[lesson].url;
		}
	}

	if(load == 'undefined')
	{
		$('#content').html("No more lessons... yet. <a href=\"javascript:restart();\">restart</a>");

		return;
	}

	$.ajax({
		url: 'courses/' + load + '/instructions.html',
		async: false,
		dataType: "html",
		success: function(data) {
			$('#content').html(data);
		},
		error: function(data) {
			$('#content').html("lesson not found :(");
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
	location.reload();
	route();
});
route();

// go to the next lesson
function advance()
{
	var lesson = getCookie("lesson");
	if(lesson == null)
		lesson = 0;

	lesson++;

	setCookie("lesson", lesson);

	window.location.hash = "#/" + lessons[lesson].url;
	//location.reload();
}

function recede()
{
	var lesson = getCookie("lesson");
	if(lesson == null)
		lesson = 1;

	if(lesson != null && lesson <= 0)
		lesson = 1;

	lesson--;

	setCookie("lesson", lesson);

	window.location.hash = "#/" + lessons[lesson].url;
}

function restart()
{
	setCookie('lesson', 0);
	window.location.hash = "#/" + lessons[0].url;
}

function cleareditor()
{
	editor.setValue('', 1);
}

function setCookie(key, value)
{
	var d = new Date();
	d.setTime(d.getTime() + 1000*24*60*60*1000);
	var expires = d.toUTCString();
	document.cookie = key+"="+value+"; expires="+  expires +";"
}

function getCookie(key) {
    var kname = key + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(kname) == 0) {
            return c.substring(kname.length, c.length);
        }
    }
    return null;
}


function canAdvance()
{
	window.setTimeout(function() {

		toastr["success"]("Great! To move to the next lesson, click here.", "Lesson Complete!");

	}, 200);
}

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": true,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "0",
  "extendedTimeOut": "0",
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
  template: '<div style="margin-bottom: 40px;"><div :id="editorId" class="inlineeditor editor" style="width: 600px; height: 150px;"></div><div class="loadButton" v-if="!noloadbutton"><button v-on:click="loadIntoBottom">Copy into editor</button></div></div>',
  props: {
  	'editorId': String, 
  	'content': String,
  	'lang': String,
  	'theme': String, 
  	'autoheight': Boolean,
  	'noloadbutton': Boolean,
  	'canwrite': Boolean,
  	'noselect': Boolean,
  	'disable': Boolean

  },
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
    var theme = this.theme || 'twilight'
    const height = this.height || 200;

    if(this.disable)
    {
    	this.canwrite = false;
    	this.noselect = true;
    	theme = 'solarized_light';
    }
  
	this.editor = window.ace.edit(this.editorId)
    this.editor.setValue(this.content, 1)
    
    this.editor.getSession().setMode(`ace/mode/${lang}`)
    this.editor.setTheme(`ace/theme/${theme}`)

    this.editor.setReadOnly(!this.canwrite)

    if(this.autoheight)
    {
    	this.editor.setAutoScrollEditorIntoView(true);
    	this.editor.setOption("maxLines", 20);
    }

    if(this.noselect)
    {
    	var thiseditor = this.editor;
    	thiseditor.getSession().selection.on('changeSelection', function (e)
		{
			if(!thiseditor.getSelection().isEmpty())
		    	thiseditor.getSession().selection.clearSelection();
		});
    }

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


// Lets register some helpful functions

// print is mostly an alias to console.log
// however strings are stripped of their double quotes
function print(s)
{
	if(typeof s == "string")
	{
		$('#output').append(s + "\n");
	}
	else
	{
		console.log(s);
	}
}
