'use strict'

var lessons = [
	{ url: 'Home', title: "Welcome!", chapter: 1 },
	{ url: 'Intro', title: "Using the editor", chapter: 1 },
	{ url: 'HelloWorld', title: "Hello World!", chapter: 1 },
	{ url: 'StoryTime', title: "Story Time", chapter: 1 },
	{ url: 'Comments', title: "Comments", chapter: 1 },
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
	{ url: 'BranchingBoss', title: "Chapter Boss: Divisibility", chapter: 2},

	{ url: 'Loops', title: "Loops", chapter: 3},
	{ url: 'EnforcingInput', title: "Looping Practice: Enforcing Inputs", chapter: 3},
	{ url: 'ForLoops', title: "For Loops", chapter: 3},
	{ url: 'Factorial', title: "Looping Practice: Factorials", chapter: 3},
	{ url: 'BreakandContinue', title: "Breaking and Continue", chapter: 3},
	{ url: 'LoopingBoss', title: "Chapter Boss: Prime Numbers", chapter: 3},

	{ url: "Arrays", title: "Arrays", chapter: 4},
	{ url: "ArrayPush", title: "Expanding on Arrays", chapter: 4},
	{ url: "Objects", title: "Objects", chapter: 4},
	{ url: "ForIn", title: "For Loops and Objects", chapter: 4},
	{ url: "ObjectProperties", title: "Properties of an Object", chapter: 4},
	{ url: "DotNotation", title: "The Dot Notation", chapter: 4},
	{ url: "ArrayBoss", title: "Chapter Boss: Arrays and Objects", chapter: 4},

]

var weapons = [
	{ urlComplete: 'Comments', id: 'weapon-mace'},
	{ urlComplete: 'VariableBoss', id: 'weapon-dagger'},
	{ urlComplete: 'BranchingBoss', id: 'weapon-trident'},
	{ urlComplete: 'LoopingBoss', id: 'weapon-scythe'},
	{ urlComplete: 'ArrayBoss', id: 'weapon-nunchakus'}

]

var lessonEditorPayloads = {};

var editor = null;

var weaponPayloads = {
	maceofio1: "print(\"Hello, world!\");\nprint(\"This line is printed second.\");\nprint(\"This line is printed last.\");",
	maceofio2: "// This line is a comment.",
	variableDagger1: "var myname = \"Kate\";\nvar age = 14;\nvar favcolour = prompt(\"What is your favourite colour?\");",
	variableDagger2: "print(myname);\nprint(\"Hello, my name is \" + myname);\nvar myAgeNextYear = age + 1;",
	branchingTrident1: "var temperature = -4;\nif(temperature < 0)\n{\n\tprint(\"The water is frozen!\");\n}",
	branchingTrident2: "var temperature = -4;\nif(temperature < 0)\n{\n\tprint(\"The water is frozen!\");\n}\nelse\n{\n\tprint(\"The water is not frozen.\");\n}",
	branchingTrident3: "var temperature = -4;\nif(temperature < 0)\n{\n\tprint(\"The water is frozen!\");\n}\nelse if(temperature >= 0 && temperature < 100)\n{\n\tprint(\"The water is liquid.\");\n}\nelse\n{\n\tprint(\"The water is steam.\");\n}",
	loopScythe1: "var counter = 1;\nwhile(counter <= 10)\n{\n\tprint(\"The value of counter is \" + counter);\n\tcounter++;\n}",
	loopScythe2: "for(var counter = 1; counter <= 10; counter++)\n{\n\tprint(\"The value of counter is \" + counter);\n}",
	arrayNunchakus1: 'var cars = ["Ford Focus", "Honda Civic", "Nissan Sentra", "Volkswagen Beetle"];\n\nvar primeNumbers = [1, 2, 3, 5, 7, 11, 13];',
	arrayNunchakus2: 'var cat = {"name": "Mittens", "Age": 3, "Weight": 5};',
	arrayNunchakus3: 'var cars = [\n\t{"Make": "Ford", "Model": "Focus", "Year": 2002},\n\t{"Make": "Honda", "Model": "Civic", "Year": 2014},\n\t{"Make": "Nissan", "Model": "Sentra", "Year": 2006},\n\t{"Make": "Volkswagen", "Model": "Beetle", "Year": 2017}\n];'

}

var hasCleared = false;


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
	if(hash === "")
	{
		return getPersistent("lesson") || 0;
	}
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
/*(function(){
    var oldLog = console.log;
    console.log = function (message) {
        $('#output').append(JSON.stringify(message) + "\n");
    };
})();
*/

// hijack eval
function kateEval(code) {
	var nc = addInfiniteLoopProtection(code);
	return window.eval(nc);
}

function tookTooLong()
{
	$('#output').append('<span class="error">Oops! &#x221e! Your loop might be infinite. Change your code and try again!</span>\n');
}

// https://github.com/chinchang/web-maker/blob/master/src/utils.js
function addInfiniteLoopProtection(code) {
		var loopId = 1;
		var patches = [];
		var varPrefix = '_wmloopvar';
		/*
		//old implementation, time based
		var varStr = 'var %d = Date.now();\n';
		var checkStr =
			'\nif (Date.now() - %d > 1000) { tookTooLong(); break;}\n';
	    */
		var varStr = 'window.%d = 0;\n';
		var checkStr =
			'\nwindow.%d++; if (window.%d > 100000) { tookTooLong(); break;}\n';

		esprima.parse(code, { tolerant: true, range: true, jsx: true }, function(
			node
		) {
			switch (node.type) {
				case 'DoWhileStatement':
				case 'ForStatement':
				case 'ForInStatement':
				case 'ForOfStatement':
				case 'WhileStatement':
					var start = 1 + node.body.range[0];
					var end = node.body.range[1];
					var prolog = checkStr.replace(/\%d/g, varPrefix + loopId);
					var epilog = '';

					if (node.body.type !== 'BlockStatement') {
						// `while(1) doThat()` becomes `while(1) {doThat()}`
						prolog = '{' + prolog;
						epilog = '}';
						--start;
					}

					patches.push({ pos: start, str: prolog });
					patches.push({ pos: end, str: epilog });
					patches.push({
						pos: node.range[0],
						str: varStr.replace(/\%d/g, varPrefix + loopId)
					});
					++loopId;
					break;

				default:
					break;
			}
		});

		/* eslint-disable no-param-reassign */
		patches
			.sort(function(a, b) {
				return b.pos - a.pos;
			})
			.forEach(function(patch) {
				code = code.slice(0, patch.pos) + patch.str + code.slice(patch.pos);
			});

		/* eslint-disable no-param-reassign */
		return code;
	}


$('#run').click(function() {

	var result;
	var codeok = true;

	$('#output').html('');

	try
	{
		result = kateEval(editor.getValue());
	}
	catch(e)
	{
		var stringy = "Oops! Code problem:  " + e.name + ": " + e.message;
		$('#output').append('<span class="error">' + stringy + '</span>\n');
		codeok = false;
	}

	if(result != undefined)
	{
		var stringy = JSON.stringify(result);	
		//$('#output').append(stringy + '\n');
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
	if(lesson == getCurrentIndex() || getCurrentIndex() == null)
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

function completeAll()
{
	setPersistent("lesson", lessons.length - 1);
	window.location.hash = "#/";
	return "okay";
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

				if(!hasCleared)
				{
					toastr["info"]("<p>You've earned a weapon to help you on your journey!</p><img class=\"award-img\" src=\"" + imgsrc + "\"><p>It has been added to the Weapon Rack.</p>", "Weapon Earned", {
						onclick: function() {
							showRack();
						},
					});
				}
			}
		}
	}


	window.setTimeout(function() {

		if(!hasCleared)
		{
			toastr["success"]("Great! To move to the next lesson, click here.", "Lesson Complete!");
			hasCleared = true;
		}

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
  	'extrawide': Boolean,
  	'noloadbutton': Boolean,
  	'canwrite': Boolean,
  	'noselect': Boolean,
  	'disable': Boolean,
  	'nowarn': Boolean,
  	'wordwrap': Boolean,

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
    const width = this.width || 600;

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

    if(this.extrawide)
    {
    	$('#' + this.editorId).css('width', '800px');
    	$('#' + this.editorId).parent().find('.loadButton').find('button').css('width', '800px');
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

    if(this.wordwrap)
    {
    	var thiseditor = this.editor;
    	thiseditor.getSession().setUseWrapMode(true);
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


function hasOwnPropertyCaseInsensitive(obj, property) 
{
    var props = [];
    for (var i in obj) if (obj.hasOwnProperty(i)) props.push(i);
    var prop;
    while (prop = props.pop()) if (prop.toLowerCase() === property.toLowerCase()) return true;
    return false;
}

function getPropertyCaseInsensitive(obj, property)
{
	var props = [];
    for (var i in obj)
    {
    	if(obj.hasOwnProperty(i))
    		if(i.toLowerCase() === property.toLowerCase())
    			return obj[i];
	}
}

// Lets register some helpful functions

// print is mostly an alias to console.log
// however strings are stripped of their double quotes
function print(s)
{
	if(typeof s == "string")
	{
		$('#output').append(s + "\n");
	}
	else if(typeof s == "object")
	{
		$('#output').append(JSON.stringify(s) + "\n");
	}
	else
	{
		$('#output').append(s + "\n");
	}
}
