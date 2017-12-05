'use strict'

var lessons = [
	{ url: 'Home', title: "Welcome!", chapter: 1 },
	{ url: 'Intro', title: "Using the editor", chapter: 1 },
	{ url: 'HelloWorld', title: "Hello World!", chapter: 1 },
	{ url: 'StoryTime', title: "Story Time", chapter: 1 },
	{ url: 'Variables', title: "Variables", chapter: 1 },
	{ url: 'Greetings', title: "Greetings", chapter: 1 },
	{ url: 'Strings', title: "Strings", chapter: 1 },
	{ url: 'Numbers', title: "Numbers", chapter: 1 },
	{ url: 'Operators', title: "Operators", chapter: 1 },
	{ url: 'VariableBoss', title: "Chapter Boss: Temperature Conversion", chapter: 1 },

	{ url: 'Branching', title: "Branching", chapter: 2},
	{ url: 'Conditions', title: "Conditions", chapter: 2},
	{ url: 'IfElse', title: "If...Else", chapter: 2},
	{ url: 'IfElseIfElse', title: "If...Else If...Else", chapter: 2},
	{ url: 'ThisAndThat', title: "This and That", chapter: 2},
]

var weapons = [
	{ urlComplete: 'StoryTime', id: 'weapon-flail'},
	{ urlComplete: 'VariableBoss', id: 'weapon-sword'}

]

var lessonEditorPayloads = {};

var editor = null;

var weaponPayloads = {
	flailofio: "print(\"Hello, world!\");\nprint(\"This line is printed second.\");\nprint(\"This line is printed last.\");",
	variableSword1: "var myname = \"Kate\";\nvar age = 14;\nvar favcolour = prompt(\"What is your favourite colour?\");",
	variableSword2: "print(myname);\nprint(\"Hello, my name is \" + myname);\nvar myAgeNextYear = age + 1;"

}


$(document).ready(function() {

	// init the editor
	editor = ace.edit("editor");
	editor.setTheme("ace/theme/twilight");
	editor.session.setMode("ace/mode/javascript");

	// build the navigation
	var historylesson = getPersistent("lesson") || 0;
	var historyEl = $('#lessonhistory');
	var currentlesson = getCurrentIndex();
	for(var i=0; i<lessons.length; i++)
	{
		if(i == 0 || (lessons[i].chapter != lessons[i-1].chapter && i <= historylesson))
		{
			historyEl.append('<li class="chaptermarker">Chapter ' + lessons[i].chapter + '</li>');
		}

		/*if(i > historylesson) // lesson not reached
		{
			historyEl.append('<li>' + lessons[i].title + '</li>\n');
		}
		else */if(i < historylesson) // lesson passed
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

	// build the weapon rack
	for(var i=0; i<weapons.length; i++)
	{
		var urlpass = weapons[i].urlComplete;

		for(var j=0; j<historylesson; j++)
		{
			if(urlpass == lessons[j].url)
			{
				// render it
				$('#' + weapons[i].id).css('display', 'inline-block');
				break;
			}
		}
	}


	// init tooltipster
	$('.tooltip').tooltipster({
		animation: 'grow',
		trigger: 'click',
		interactive: true,
		theme: 'tooltipster-punk',
		maxWidth: 1000

	});

	var isMobile = false;
	if( $('#mdetect').css('display')=='none') {
        isMobile = true;       
    }

    if (isMobile) {
    	var phoneOkayCookie = getPersistent("phoneokay");
    	if(phoneOkayCookie == null || (phoneOkayCookie != null && phoneOkayCookie == "false"))
    	{
    		$('#phonebad').show();
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
	{
		$('#drawer').show();
		$('#rack').hide();
	}
})

$('#weaponrack').click(function() {
	if($('#rack').is(":visible"))
		$('#rack').hide();
	else
		showRack();
});

function showRack()
{
	$('#rack').show();
	$('#drawer').hide();
}

// Simple routing
function route() {

	var load = undefined;

	if(window.location.hash.substr(2))
	{
		load = window.location.hash.substr(2);	
	}
	else
	{
		var lesson = getPersistent("lesson");
		if(lesson == null)
		{
			lesson = 0;
			load = "Home";
		}
		else
		{
			if(lessons[lesson] != null)
				load = lessons[lesson].url;
			else
				load = "end";
		}
	}

	if(load == 'undefined' || load == 'end')
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
			$(document).ready(function() {
				editor.setValue(data, 1);
			});
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
	var lesson = getPersistent("lesson");
	if(lesson == null)
		lesson = 0;

	// check if we are on the current lesson before incrementing the advance
	if(lesson == getCurrentIndex())
	{
		lesson++;
		setPersistent("lesson", lesson);
	}
	else
	{
		lesson = getCurrentIndex() + 1;
	}

	if(typeof lessons[lesson] == 'undefined')
		window.location.hash = "#/end";
	else
		window.location.hash = "#/" + lessons[lesson].url;
	//location.reload();
}

function recede()
{
	var lesson = getPersistent("lesson");
	if(lesson == null)
		lesson = 0;

	if(lesson != null && lesson <= 0)
		lesson = 0;

	lesson--;

	setPersistent("lesson", lesson)

	window.location.hash = "#/" + lessons[lesson].url;
}

function restart()
{
	setPersistent("lesson", 0)
	window.location.hash = "#/" + lessons[0].url;
}

function cleareditor()
{
	editor.setValue('', 1);
}

function phoneokay()
{
	setPersistent("lesson", true);
	$('#phonebad').hide();
	alert('If you can turn your device horizontally, that would help.');
}

function setPersistent(key, value)
{
	if(Storage !== void(0))
		localStorage.setItem(key, value);
	else
		setCookie(key, value);
}

function getPersistent(key)
{
	if(Storage !== void(0))
		return localStorage.getItem(key);
	else
		return getCookie(key);
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
	$('.exercise').addClass('exercisecomplete');

	// check if there are any weapons to award:
	var lesson = getPersistent("lesson");

	if(lesson != null)
	{
		var currenturl = lessons[lesson].url;
		for(var i=0; i<weapons.length; i++)
		{
			if(currenturl == weapons[i].urlComplete)
			{
				// do award
				$('#' + weapons[i].id).css('display', 'inline-block');

				var imgsrc = $('#' + weapons[i].id + " > img").attr("src");

				toastr["info"]("<p>You've earned a weapon to help you on your journey!</p><img class=\"award-img\" src=\"" + imgsrc + "\"><p>It has been added to the Weapon Rack.</p>", "Weapon Earned", {
					onclick: function() {
						showRack();
					}
				});
			}
		}
	}


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
  	'disable': Boolean,
  	'nowarn': Boolean

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

    if(this.nowarn)
    	this.editor.getSession().setUseWorker(false)

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
