var prevScroll = 0;

function Skif_Scroll() {
	var scroll = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);

	if (skif.showMenu) {
		prevScroll = scroll;
		return;
	}

	if (skif.tool.prevOpacity == 0 && scroll - prevScroll > 0) {
		prevScroll = scroll;
		return;
	}

	var baseOpacity = 100;

	if (scroll < 200) {
		baseOpacity = 100 - (scroll-100) * 0.1;
	}
	else if (scroll < 210) {
		baseOpacity = 90;	
	}
	else {
		baseOpacity = 90 - (scroll-210) * 0.9;
	}

	baseOpacity = Math.min(Math.max(baseOpacity, 0), 100);

	var opacity = skif.tool.prevOpacity - scroll + prevScroll;
	opacity = Math.min(Math.max(opacity, 0), 90);

	prevScroll = scroll;

	skif.tool.setOpacity(Math.max(baseOpacity, opacity));
}

function setCookie(cname, cvalue) {
	var d = new Date();
	d.setTime(d.getTime() + (10*365*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function Skif_TogleStyle() {
	skif.tool.setOpacity(100);
	var cssId = 'darkCSS';
	var head = document.getElementsByTagName('head')[0];
	var link = document.getElementById(cssId);
	if (link) {
		head.removeChild(link);
		setCookie('st', '0');
	}
	else {
		link  = document.createElement('link');
		link.id   = cssId;
		link.rel  = 'stylesheet';
		link.type = 'text/css';
		link.href = skif.domain + '_css/dark.css?v=20';
		link.media = 'all';
		head.appendChild(link);
		setCookie('st', '1');
	}
}


function Skif_Modal(btn, isMouseOver) {
	var modal = document.getElementById('modal'); // veil
	var modal_pos = document.getElementById('modal_pos');
	var close = document.getElementById('close');

	btn.onclick = function() {
		skif.tool.setOpacity(100);
		modal.style.display = "block";
		var nick = document.getElementById('nick');
		if (nick)
			nick.focus();

		skif.escapeFunc = function() {
			modal.style.display = "none";
			skif.escapeFunc = null;
		}
	}

	// if (isMouseOver) {
	// 	btn.onmouseenter = function() {
	// 		skif.tool.setOpacity(100);
	// 		modal.style.display = "block";
	// 		var nick = document.getElementById('nick');
	// 		if (nick)
	// 			nick.focus();

	// 		skif.escapeFunc = function() {
	// 			modal.style.display = "none";
	// 			skif.escapeFunc = null;
	// 		}
	// 	}
	// }

	if (close) {
		close.onclick = function() {
		    modal.style.display = "none";
		}
	}

	skif.addEvent(modal, 'click', function(event) {
		if (event.target == modal || event.target == modal_pos) {
			modal.style.display = "none";
		}
	});

}

function Skif_Menu(btn) {
	btn.onclick = function(event) {
		skif.tool.setOpacity(100);
		var menu = document.getElementById('menu');
		// if (menu) {
		// 	if (menu.style.display == 'block')
		// 		skif.showMenu = false;
		// 	else
		// 		skif.showMenu = true;
		// }
		// else {
		// 	// not dure if it called
		// 	skif.showMenu = !skif.showMenu;
		// }
		skif.showMenu = !skif.showMenu;
		skif.updateMenu();
		event.preventDefault();
	}
}


function Skif_Email(auth,em) {
	em = em.substring(3,em.length-3);
	auth = auth.substring(4,auth.length-4);
	document.write('<a href="mailto:',em,'" title="Защищён от спам-роботов">',auth,'</a>');
}

function check_submit(form) {
	for (i=0; i<form.length; i++) {
		var tempobj=form.elements[i]
		if(tempobj.type.toLowerCase()=="submit") {
			tempobj.disabled=true
		}
	}
}

function ins_tag(_tag_start, _tag_end) {
	document.postform.text.focus();	
	var area = document.postform.text;
	if (document.getSelection) {
		var insertText = _tag_start + area.value.substring(area.selectionStart, area.selectionEnd) + _tag_end;
		var curPos = area.selectionStart + insertText.length;
		if (area.selectionStart == area.selectionEnd) {
			curPos -= _tag_end.length
		}
		area.value=area.value.substring(0, area.selectionStart) + insertText + area.value.substring(area.selectionEnd, area.value.length);
		area.selectionEnd = curPos;
	}
	else {
		document.selection.createRange().text=_tag_start + document.selection.createRange().text + _tag_end;;
	}
	document.postform.text.focus();
}


function get_sel_text() {
	var area = document.postform.text;
	if (document.getSelection) {
		return area.value.substring(area.selectionStart, area.selectionEnd);
	}
	else if (document.selection) {
		return document.selection.createRange().text;
	}
	return '';
}


function ins_incursor(_text) {
	document.postform.text.focus();
	var area = document.postform.text;
	if ((area.selectionStart)||(area.selectionStart=='0')) {
		var curPos = area.selectionStart + _text.length;
		area.value=area.value.substring(0, area.selectionStart)+ _text + area.value.substring(area.selectionEnd, area.value.length);
		area.selectionEnd = curPos;
	}
	else if (document.selection) {
		document.selection.createRange().text=_text;
	}
	document.postform.text.focus();
}


function delete_lastChar() {
	var area = document.postform.text;
	if ((area.selectionStart)) {
		var curPos = area.selectionStart - 1;
		area.value = area.value.substring(0, curPos) + area.value.substring(area.selectionEnd, area.value.length);
		area.selectionEnd = curPos;
	}
}


function pr(text) {
	document.postform.text.focus();
	document.postform.text.value += text;
}


function ins_quote(event) {
	var maxlen = 80;

	event.returnValue = false;
	if (event.preventDefault)
		event.preventDefault();

	var nick = '';

	var eventTarget = event.target;
	if (!eventTarget)
		eventTarget = event.srcElement;

	if (eventTarget) {
		nick = eventTarget.getAttribute('data-nick');
		if (nick == null)
			return;
	}

	var text = skif.getSelText();
	if (text == '' && skif.storedQuote != '')
		text = skif.storedQuote;

	pr("[b]"+nick+"[/b]\n", 1);

	if (text == '')
		return;

	var s = text.split('\n');
	var len = s.length;
	var i, j, begstr, str, cmts, si;

	text = "";

	for (i=0; i<len; i++) {
		ti=(s[i].indexOf(" >")==0 ? 1 : 0);
		tend=s[i].length-1;
		while (s[i].charAt(tend)==' ') tend--;
		if (ti || tend<s[i].length-1) s[i]=s[i].substring(ti,tend+1);
		cmts = "";
		if (((si = s[i].indexOf(' ')) == -1) || (s[i] == "")) {
			text += ("> " + s[i] + "\n");
			continue;
		}
		for (j=0; j<s[i].length; j++) {
			if (s[i].charAt(j) == '>')
				cmts += "> ";
			else
				break;
		}
		str = cmts;
		s[i] = s[i].slice(cmts.length);
		s[i] += " ";
		while ((si = s[i].indexOf(' ')) != -1) {
			begstr = s[i].slice(0, si);
			s[i] = s[i].slice(si+1);
			if (begstr.length + str.length >= maxlen) {
				if (str.slice(cmts.length) != '') {
					str = str.slice(0, str.length-1);
					text += ("> " + str + "\n");
				}
				str = cmts + begstr + " ";
				continue;
			}
			if (begstr.length < maxlen)
				str += (begstr + " ");
			else
				str = cmts + begstr + " ";
			if (str.length >= maxlen) {
				str = str.slice(0, str.length-1);
				text += ("> " + str + "\n");
				str = cmts;
			}
			if (s[i].length == 0)
				break;
		}
		str = str.slice(0, str.length-1);
		if (str.slice(cmts.length) != '') {
			text += ("> " + str + "\n");
		}
	}
	pr(text);
}

function p_nick(text) {
	pr("[b]"+text+"[/b]\n", 1);
}


function showSpoiler(spoilerId, show) {
	document.getElementById('spoilerHead' + spoilerId).style.display = show == 1 ? 'none' : 'block';
	document.getElementById('spoiler' + spoilerId).style.display = show == 1 ? 'block' : 'none';
}


function showImgSpoiler(spoilerId) {
	var spoilerHead = document.getElementById('spoilerHead' + spoilerId);
	spoilerHead.parentNode.removeChild(spoilerHead);
	var spoiler = document.getElementById('spoiler' + spoilerId);
	spoiler.setAttribute('src', spoiler.getAttribute('data-src'));
	spoiler.style.display = "inline";
	if (event.preventDefault)
		event.preventDefault();
}


function Url(url) {
	this.url = url;

	var fragments = url.split('#');
	this.fragment = fragments.length > 1 ? fragments[1] : '';

	var queries = fragments[0].split('?'); 
	this.query = queries.length > 1 ? queries[1] : '';

	var protocols = queries[0].split(':');
	this.protocol = protocols.length > 1 ? protocols[0] : '';

	this.address = queries[0].substring(this.protocol.length);
	if (this.address.length>3 && this.address.substr(0,3) == '://')
		this.address = this.address.substr(3);

	this.getDomain = function() {
		var domains = this.address.split('/')[0].split('.');
		if (domains.length >= 2)
			return domains[domains.length-2] + '.' + domains[domains.length-1];
		return '';
	}

	this.getParam = function(param) {
		var params = this.query.split('&'); 
		for(var i=0; i<params.length; i++) {
			var var_value = params[i].split('=');
			if (var_value[0] == param && var_value.length > 1)
				return var_value[1];
		} 
	  return ''; 
	}

	this.getPath = function() {
		var paths = this.address.split('/');
		if (paths.length > 1)
			return this.address.substring(paths[0].length + 1);
		return '';
	}
}



function but_YouTube() {
	var text = get_sel_text();
	var url = new Url(text);

	var v = url.getParam('v');
	var t = url.getParam('t');
	var time = '';

	if (t.length > 0) {
		var times = t.split('s');
		times = times[0].split('m');
		if (times.length>1)
			times[0] = 60 * times[0] + 1 * times[1];
		time = '#t=' + times[0];
	}

	if (url.getDomain() == 'youtube.com' && v != '') {
		text = v;
	}
	else if (url.getDomain() == 'youtu.be') {
		text = url.getPath();
	}
	else {
		time = '';
	}

	ins_incursor('[youtube=' + text + time + ']\n');
}


var lastMinusPressed = 0;
function key_pressed(event) {
	if (!event.ctrlKey && !event.shiftKey) {
		var keyID = (event.charCode) ? event.charCode : ((event.which) ? event.which : event.keyCode);
		if (keyID==189) { // '-'
			if (lastMinusPressed) {
				var d = new Date();
				var t = d.getTime();
				if (t - lastMinusPressed < 300) {
					lastMinusPressed = 0;
					delete_lastChar();
					ins_incursor('—');
					event.preventDefault();
				}
				else {
					lastMinusPressed = t;
				}
			}
			else {
				var d = new Date(); 
				lastMinusPressed = d.getTime();
			}
		}
		else if (lastMinusPressed) {
			lastMinusPressed = 0;
		}

		if (keyID==9) { // TAB
			ins_incursor('	');
			event.preventDefault();
		}
	}

	if (!event.ctrlKey || !event.shiftKey)
		return;

	if (event.keyCode==10 || event.keyCode==13) {
		document.postform.submit();
	}
	if (event.keyCode==2 || event.keyCode==98) {
		ins_tag('[b]', '[/b]');
	}
}


function Core_OutAreaTags() {
	var s = document.getElementById('areatags');
	if (s == null)
		return;

	s.innerHTML = '<a target="_blank" href="' + skif.domain  + 'files/?upload">Загрузка изображений и файлов</a>' +
	' | <a target="_blank" href="http://skif.qrim.ru/docs/help">Справка по тегам</a><br />' +
	'<a href="javascript:ins_tag(\'[b]\',\'[/b]\')" title="[b][/b] Жирный шрифт (Ctrl+Shift+B)">[b]</a> '+
	'<a href="javascript:ins_tag(\'[i]\',\'[/i]\')" title="[i][/i] Наклонный шрифт">[i]</a> ' +
	'<a href="javascript:ins_tag(\'[s]\',\'[/s]\')" title="[s][/s] Зачёркнутый текст">[s]</a> ' +
	'<a href="javascript:ins_tag(\'[code]\n\',\'\n[/code]\n\')" title="[code] Код: Моноширинный шрифт">[code]</a> ' +
	'<a href="javascript:ins_tag(\'[code=cpp]\n\',\'\n[/code]\n\')" title="[code=cpp] Код: с подсветкой для C++">[c++]</a> ' +
	'<a href="javascript:ins_tag(\'[code=pas]\n\',\'\n[/code]\n\')" title="[code=pas] Код: с подсветкой для Pascal">[pas]</a> ' +
	'<a href="javascript:ins_tag(\'[quote]\n\',\'\n[/quote]\n\')" title="[quote] Цитата: Выделенный блок текста">[quote]</a> ' +
	'<a href="javascript:ins_tag(\'[spoiler]\n\',\'\n[/spoiler]\n\')" title="[spoiler] Спойлер: спрятать текст">[spoiler]</a> ' +
	'<a href="javascript:ins_tag(\'[offtop]\n\',\'\n[/offtop]\n\')" title="[offtop] Тусклый текст с уменьшенным шрифтом">[offtop]</a> ' +
	'<a href="javascript:ins_tag(\'[url=\',\'][/url]\')" title="[url]: Ссылка">[url]</a> ' +
	'<a href="javascript:ins_tag(\'[img=\',\']\')" title="[img]: Внешнее изображение. Можно выделить URL на изображение">[img]</a> ' +
	'<a href="javascript:but_YouTube()" title="YouTube: Можно выделить URL или код из URL на видео">[youtube]</a>';
}


function Core_AddForumQuotes() {
	var elems = document.getElementsByClassName('fquote');
	for (var i = 0; i < elems.length; i++ ) {
		var el = elems[i];
		skif.addEvent(el, 'click', ins_quote, false);
		if (skif.isTouch) {
			el.addEventListener("touchstart", skif.storeQuote, true);
		}
	}
}

function Core_OnResize() {
	//var mh = document.getElementById('main_body').offsetHeight;
	//var rh = document.getElementById('right').offsetHeight;
	//document.getElementById('main_add').style.paddingBottom = mh < rh ? (rh - mh) + 'px' : '0px';
}


function Core_GetXML(url) {
	var xml;
	if (window.XMLHttpRequest) {
		xml = new window.XMLHttpRequest();
		xml.open("GET", url, false);
		xml.setRequestHeader("Cache-Control", "no-cache");
		xml.send();
		return xml.responseXML;
	}
	else if (window.ActiveXObject) {
		xml = new ActiveXObject("Microsoft.XMLDOM");
		xml.async = false;
		xml.load(url);
		return xml;
	}
	else {
		return null;
	}
}


function Core_GetAttribs(xml, item) {
	items = xml.getElementsByTagName(item);
	if (!items)
		return null;
	item = items[0];
	if (!item)
		return null;
	var ret = new Object();
	for (var i = 0; i < item.attributes.length; i++)
		ret[item.attributes[i].name] = item.attributes[i].value;
	return ret;
}


var Buttons = {
	add: function (el, callback) {
		el.onclick = callback;
	}
}


var Scripts = {
	files: [],

	include: function(url, callback) {
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;
		script.onreadystatechange = function () {
			if (callback!=undefined && this.readyState == 'complete')
				callback();
		}
		script.onload = callback;
		head.appendChild(script);
		return script;
	},

	load: function (file, fn) {
		var isCalled = false;
		this.callback = function () {
			if (isCalled)
				return;
			isCalled = true;
			Scripts.files[file] = true;
			fn();
		}

		if (this.files[file] != true) {
			this.include(skif.domain + file, this.callback);
			console.log('load script: ', file);
		}
		else {
			fn();
		}
	}
};


function Core_AddSound(id, file) {
	Scripts.load('_js/swfobject.js', function () {
		var sx = new SWFObject('/_js/mediaplayer.swf', 'apv', '200', '14', '7');
		sx.addVariable('width', '200');
		sx.addVariable('height', '17');
		sx.addVariable('file', skif.domain + 'files/sounds/' + file);
		sx.write(id);
	});
}


var Search = {
	visible: false,
	initialized: false,

	submit: function (form) {
		window.location.href = 'https://google.com/search?q=' + encodeURIComponent('site:' + document.domain + ' ' + form.q.value);
		return false;
	},

	init: function () {
		var e = document.getElementById('search_toggle');
		if (e != null) {
			this.initButton(e);
		}
	},

	show: function(isShow) {
		var search = document.getElementById('search');
		if (search != null) {
			search.style.display = isShow ? "block" : "none";
		}
		Search.visible = isShow;
	},

	initButton: function(btn) {
		btn.onclick = function(event) {
			Search.visible = !Search.visible;
			var search = document.getElementById('search');
			if (search != null) {
				if (!Search.initialized) {
					search.innerHTML = '<form method="post" onSubmit="return Search.submit(this);">' +
						'<input style="" class="blue" type="submit" value="Найти" />' +
						'<div><input style="float: left;" id="search_input" type="text" name="q" maxlength="255" /></div>' +
						'</form>';
					Search.initialized = true;
				}
				Search.show(Search.visible);
			}
			if (Search.visible) {
				var input = document.getElementById('search_input');
				if (input != null) {
					input.focus();
				}
			}
			skif.tool.setOpacity(100);
			event.preventDefault();
		}
	}
};


var skif = {
	domain: '/',
	isTouch: false,
	veil: null,
	showMenu: false,
	escapeFunc: null,
	tool: null,
	//resizeElements: [],

	addEvent: function (obj, type, fn, useCapture) {
		if (obj.addEventListener) {
			obj.addEventListener(type, fn, useCapture);
		}
		else if (obj.attachEvent) {
			return obj.attachEvent('on' + type, fn);
		}
	},

	updateMenu: function() {
		var menu = document.getElementById('menu');
		menu.style.display = skif.showMenu ? "block" : "none";
	},

	getSelText: function() {
		if (window.getSelection)
			return window.getSelection().toString();
		if (document.getSelection)
			return document.getSelection().toString();
		return document.selection.createRange().text;
	},

	storeQuote: function(event) {
		skif.storedQuote = skif.getSelText();
	},

	HTMLfn: function(el, fn) {
		var e = document.getElementById(el);
		if (e != null && fn != null)
			e.innerHTML = fn();
	},

	showVeil: function(clickFunc) {
		if (!skif.veil) {
			var body = document.getElementsByTagName('body')[0];
			//skif.veil = document.getElementById('veil');
			skif.veil = document.createElement('div');
			skif.veil.id = 'veil';
			body.appendChild(skif.veil);
			skif.veil.className = 'veil';
		}
		skif.veil.style.display = 'block';
		skif.veil.onclick = clickFunc;
		skif.escapeFunc = clickFunc;
	},

	dropdown: function(id) {
		var dropdown = document.getElementById(id);
		dropdown.style.display = 'block';

		skif.showVeil(function() {
			dropdown.style.display = 'none';
			veil.style.display = 'none';
			skif.escapeFunc = null;
		});
	},

	run: function() {
		skif.domain = location.protocol + '//' + document.domain + '/';
		skif.isTouch = !!('ontouchstart' in document);

		//skif.addEvent(window, 'load', skif.load);
		skif.addEvent(document, 'keydown', skif.keydown);

		var menu = document.getElementById('menu');
		if (menu != null) {
			var visible = parseInt(menu.getAttribute('data-visible'));
			if (visible > 0 && visible <= document.body.clientWidth) {
				skif.showMenu = true;
			}
		}

		window.onscroll = Skif_Scroll;
		var e = document.getElementById('menu_toggle');
		if (e != null) {
			Skif_Menu(e);
		}

		e = document.getElementById('login');
		if (e != null)
			e.innerHTML =
			'  <span id="close">&times;</span>' +
			'  <h3>Вход в систему</h3>' +
			'  <form name="postform" method="POST" action="' + skif.domain + 'users/?login" onSubmit="return verifySubmitFields(this)">' +
			'   <p><b>Ник:</b> <br /><input name="nick" id="nick" value="" size="24" maxlength="20" />' +
			'   <p><b>Пароль:</b> <br /><input type=password name="pass" value="" size="24" maxlength="24" />' +
			'   <input type="hidden" name="action" value="autopost" />' +
			'   <p class="r"><input id="_gdr_post" name="_gdr_post" type="submit" class="blue" value="Войти" /></p>' +
			'  </form>' +
			'  <p><a href="' + skif.domain + 'users/?regist">Зарегистрироваться</a></p>' +
			'  <p><a href="' + skif.domain + 'users/?setuppass">Забыли пароль?</a></p>';

		e = document.getElementById('enter');
		if (e != null) {
			Skif_Modal(e, false);
		}
		else {
			e = document.getElementById('profile');
			if (e != null) {
				Skif_Modal(e, true);
			}
		}

		e = document.getElementById('style');
		if (e != null) {
			skif.addEvent(e, 'click', Skif_TogleStyle);
		}

		Search.init();

		e = document.getElementById('ad_content');
		if (e != null)
			e.style.display = "block";

		Core_AddForumQuotes();
		Core_OutAreaTags();

		// //if (skif.isTouch) {
		// 	document.addEventListener("selectionchange", skif.selChanged, false);
		// //}

		skif.HTMLfn('social', skif.site.social);
		//skif.HTMLfn('counters', skif.site.counters);

		// e = document.getElementById('right');
		// if (e != null && e.offsetWidth > 0)
		// {
		// 	skif.addEvent(window, 'resize', Core_OnResize, true);
		// 	Core_OnResize();
		// }
	},


	load: function() {
	},

	// selChanged: function() {
	// 	s = window.getSelection();

	// 	if (window.getSelection().toString() == '')
	// 		return;

	// 	oRange = s.getRangeAt(0); //get the text range
	// 	oRect = oRange.getBoundingClientRect();
	// 	el = document.createElement('div');
	// 	el.style.position = "absolute";
	// 	el.style.top = '' + (window.scrollY + oRect.bottom + 5) + 'px';
	// 	el.width = '100px';
	// 	el.height = '20px';
	// 	el.innerHTML = 'Цитировать';
	// 	document.body.appendChild(el);
	// },

	scrollToHash: function(hash) {
		window.location.hash = hash;
	},


	loadYoutubeImage: function(event) {
		var eventTarget = event.target;
		if (!eventTarget)
			eventTarget = event.srcElement;
		if (!eventTarget)
			return;

		var vidid = eventTarget.getAttribute('data-value');
		if (eventTarget.naturalWidth < 1080) {
			eventTarget.src="https://img.youtube.com/vi/" + vidid + "/hqdefault.jpg";
		}
		eventTarget.onload = null;
	},


	insertYoutube: function(id) {
		var e = document.getElementById('youtube' + id);
		if (e == null)
			return;
		var vidid = e.getAttribute('data-value');
		var addSign = vidid.split('?').length == 1 ? '?' : '&';
		e.innerHTML = '<iframe width="' + e.clientWidth + '" height="' + e.clientHeight + 
			'" src="//www.youtube.com/embed/' + vidid + addSign + 'autoplay=1&rel=0" frameborder="0" ' +
			'allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
	},


	keydown: function(evt) {
		evt = evt || window.event;
		if (evt.key === 'Escape') {
			if (skif.escapeFunc) {
				skif.escapeFunc();
			}
			else if(Search.visible) {
				Search.show(false);
			}
		}	
	},

	// private
	storedQuote: '',
	site: null
};


skif.tool = {
	prevOpacity: 100,
	isDisplay: true,

	setOpacity: function(opacity) {
		skif.tool.prevOpacity = opacity;
		var navEl = document.getElementById('tool');
		navEl.style.opacity = opacity/100;

		if (skif.tool.isDisplay && opacity == 0) {
			navEl.style.display = "none";
			skif.tool.isDisplay = false;
			//if (skif.showMenu) {
			//	skif.showMenu = false;
			//	skif.updateMenu();
			//}
		}
		else if (!skif.tool.isDisplay && opacity != 0) {
			navEl.style.display = "block";
			skif.tool.isDisplay = true;	
		}
	}
};


skif.site = {
	name: 'GameDev.ru',

	social: function() {
		return '<a class="vk" href="https://vk.com/gamedev_ru" target="_blank" title="vk.com"></a> ' +
			'<a class="facebook" href="https://www.facebook.com/gamedevru" target="_blank" title="facebook page"></a> ' +
			'<a class="facebook-group" href="https://www.facebook.com/groups/gamedevru/" target="_blank" title="facebook group"></a> ' +
			'<a class="twitter" href="https://twitter.com/ru_gamedev" target="_blank" title="twitter"></a> ' +
			'<a class="googleplus" href="https://plus.google.com/+GamedevRus/" target="_blank"  title="Google Plus"></a> ';
	},

	counters: function() {
		return '';
		/*
		var a = ';r=' + escape(document.referrer)
		s = screen;
		a += ';s=' + s.width + '*' + s.height;
		a += ';d=' + (s.colorDepth ? s.colorDepth : s.pixelDepth);

		return '<a href="http://top.mail.ru/jump?from=261892"><img src="http://top.list.ru/counter?id=261892;t=56;' + a + 
			';rand=' + Math.random() + '" alt="Рейтинг@Mail.ru"' + ' border="0" height="31" width="88" /><\/a>';
			*/
	}
};
