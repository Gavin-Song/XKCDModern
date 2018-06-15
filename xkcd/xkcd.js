/*Adds a link to the chrome extension's CSS file to the head of 
the html document, as injected CSS doesn't always work 100%*/
if( !window.location.href.endsWith(".html") ){ //Not possibly an iframe embed
	var link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = chrome.extension.getURL('xkcd/xkcd.css');
	document.head.appendChild(link);
}

/*Checks if the URL is a comic and not something like a blog 
or about. Checks if url is xkcd.com or xkcd.com/<a number>*/
function isComic(){
	if( window.location.pathname == "/" || !Number.isNaN(
		window.location.pathname.substring(1).substring(0, window.location.pathname.length - 1)
	)		)
		return true;
	return false;
}

/* Encode a string into HTML entities 
 * from https://gist.github.com/CatTail/4174511 */
function encodeHtmlEntity(str) {
	let buf = [];
	for (let i=str.length-1; i>=0; i--) {
		buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
	}
	return buf.join('');
};

if( isComic() ){
	/*Replace header image, but not for xk3d and iframe files
	  as editing them can result in pages being loaded incorrectly
	  or cause pages to misfunction.*/
	if( !window.location.href.includes('xk3d') && !window.location.href.endsWith(".html") ){
		try{
			var a = document.getElementById("masthead");
			var b = a.getElementsByTagName('span')[0].getElementsByTagName('a')[0].getElementsByTagName('img')[0];
			b.src = chrome.extension.getURL("xkcd/xkcd.png");
		}
		catch(e){}
	}
	
	/*Change the comic archive to a more modern list like format*/
	if( window.location.pathname == "/archive/" ){
		document.getElementById("middleContainer").getElementsByTagName("h1")[0].style.margin = "0";
		
		var comics = document.getElementById("middleContainer").getElementsByTagName("a");
		var title;
		for(var i=0;i<comics.length;i++){
			comics[i].className = "archive_list";
			
			title = comics[i].href.split("/");
			title = title[title.length-2];
			comics[i].innerHTML = "<h2 class='revised_title'>" + comics[i].innerHTML + "</h2>";
			comics[i].innerHTML += "<span style='color:gray'>#" + title 
				+ " &nbsp; &nbsp; &nbsp; &nbsp;Date released: " + comics[i].title + "</span>";

		}
	}
	
	//Find the explainxkcd url from comic
	var explain_url = "https://explainxkcd.com";
	if(!Number.isNaN(window.location.pathname.substring(1).substring(0, window.location.pathname.length - 1)))
		explain_url = "https://explainxkcd.com/wiki/index.php/" + window.location.pathname.substring(1).substring(0, window.location.pathname.length - 2);
	
	//Find the comic buttons and add the html
	var navs = document.getElementsByClassName("comicNav");
	for(var i=0;i<navs.length;i++){
		navs[i].innerHTML += '<li><a href="' + explain_url + '">Explain</a></li>';
	}
	
	//Explain fix for xk3d which uses different html
	navs = document.getElementsByClassName("menuCont");
	for(var i=0;i<navs.length;i++){
		if(navs[i].getElementsByTagName('ul').length > 0){
			navs[i].getElementsByTagName('ul')[0].innerHTML += '<li><a href="' + explain_url + '">Explain</a></li>';
		}
	}
	
	//Add alt text to bottom of comic if it's not xk3d or an iframe, and if title text exists.
	//Also don't add alt text if it's the mobile xkcd
	//Comic 1110 breaks with the title text on the bottom
	if( document.getElementById("comic") && document.getElementById("comic").getElementsByTagName('img').length > 0 
		&& !window.location.href.includes('xk3d') && !window.location.href.endsWith(".html") 
		&& document.getElementById("comic").getElementsByTagName('img')[0].title
		&& !window.location.href.includes("m.xkcd.com")	
		&& !window.location.href.includes("/1110/"))
		document.getElementById("comic").innerHTML += "<br><p style='font-size:12px;width:70%;margin-left:15%'>" 
			+ encodeHtmlEntity(document.getElementById("comic").getElementsByTagName('img')[0].title) 
			+ "</p>";
}

/*Tidy up the styling on the about page a bit*/
if( window.location.pathname == "/about/" ){
	//Obtain the main center div
	var main = document.body
		.getElementsByTagName('center')[0]
		.getElementsByTagName('table')[0]
		.getElementsByTagName('tbody')[0]
		.getElementsByTagName('tr')[0]
		.getElementsByTagName('td')[0]
		.getElementsByTagName('div')[0]
		.getElementsByTagName('center')[0];
	main.style.paddingLeft = "40px";
	main.style.paddingRight = "40px";
	main.innerHTML = `
<h2 style='font-weight:normal;font-size:36px;margin-bottom:0'><a href="http://xkcd.com/">xkcd.com</a></h2>
Randall Munroe<br>
<br>

<b>Contact:</b>
<br>
<br>

<div class="archive_list" style='margin-left:0'>
	<a href="mailto:orders@xkcd.com">orders@xkcd.com</a> -- All store-related email.
</div>
<br>
<div class="archive_list" style='margin-left:0'>
	<a href="mailto:press@xkcd.com">press@xkcd.com</a>  -- Press questions, etc (may take a long time to get to me).
</div>
<br><br>
Note: You are welcome to reprint occasional comics pretty much anywhere (presentations, papers, blogs with ads, etc). If you're not outright merchandizing, you're probably fine. Just be sure to attribute the comic to xkcd.com.<br>
<br>



If you have a question or comment about xkcd, you may want to try sharing it on the <a href="http://forums.xkcd.com/">forums</a> or the <a href="http://foonetic.net/">IRC channel</a>.

<br><br>

<div style='padding:5px;background-color:#eee'>
	IRC: #xkcd on irc.<a href="http://foonetic.net">foonetic</a>.net<br>
	Wikipedia article: <a href="http://en.wikipedia.org/wiki/xkcd">xkcd</a><br>
	<br>
	Translations (unofficial):<br>
	<a href="http://es.xkcd.com/">Spanish</a>, <a href="http://xkcd.ru/">Russian</a>, <a href="http://xkcdde.tumblr.com/">German</a>.
</div>
	
	<br><br>
	xkcd.com updates without fail every Monday, Wednesday and Friday.<br>

	`
	
}

/*Format the JSON API page and add example JSONs*/
if( window.location.href.endsWith("json.html") ){
	document.body.style = 'text-align:center;padding: 20px;';
	document.body.innerHTML = `
If you want to fetch comics and metadata automatically,<br>
you can use the JSON interface.  The URLs look like this:<br>
<br>
<a href="http://xkcd.com/info.0.json">http://xkcd.com/info.0.json</a> (current comic)<br>
(JSON Example below)<br>

<div class="code_editor">
<pre>
{  
   "month":"4",
   "num":1828,
   "link":"",
   "year":"2017",
   "news":"",
   "safe_title":"ISS Solar Transit",
   "transcript":"",
   "alt":"I guess it's also the right setting for pictures of the Moon at night.",
   "img":"https://imgs.xkcd.com/comics/iss_solar_transit.png",
   "title":"ISS Solar Transit",
   "day":"24"
}
</pre>
</div>

Or you can use:<br>
<br>
<a href="http://xkcd.com/614/info.0.json">http://xkcd.com/614/info.0.json</a> (comic #614)<br>

<div class="code_editor">
<pre>
{  
   "month":"7",
   "num":614,
   "link":"",
   "year":"2009",
   "news":"",
   "safe_title":"Woodpecker",
   "transcript":"[[A man with a beret and a woman are standing on a boardwalk, leaning on a handrail.]]\nMan: A woodpecker!\n<<Pop pop pop>>\nWoman: Yup.\n\n[[The woodpecker is banging its head against a tree.]]\nWoman: He hatched about this time last year.\n<<Pop pop pop pop>>\n\n[[The woman walks away.  The man is still standing at the handrail.]]\n\nMan: ... woodpecker?\nMan: It's your birthday!\n\nMan: Did you know?\n\nMan: Did... did nobody tell you?\n\n[[The man stands, looking.]]\n\n[[The man walks away.]]\n\n[[There is a tree.]]\n\n[[The man approaches the tree with a present in a box, tied up with ribbon.]]\n\n[[The man sets the present down at the base of the tree and looks up.]]\n\n[[The man walks away.]]\n\n[[The present is sitting at the bottom of the tree.]]\n\n[[The woodpecker looks down at the present.]]\n\n[[The woodpecker sits on the present.]]\n\n[[The woodpecker pulls on the ribbon tying the present closed.]]\n\n((full width panel))\n[[The woodpecker is flying, with an electric drill dangling from its feet, held by the cord.]]\n\n{{Title text: If you don't have an extension cord I can get that too.  Because we're friends!  Right?}}",
   "alt":"If you don't have an extension cord I can get that too.  Because we're friends!  Right?",
   "img":"https://imgs.xkcd.com/comics/woodpecker.png",
   "title":"Woodpecker",
   "day":"24"
}
</pre>
</div>

Those files contain, in a plaintext and easily-parsed format: comic titles, <br>
URLs, post dates, transcripts (when available), and other metadata.<br>
`
}




