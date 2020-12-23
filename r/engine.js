 /**
     * Get the caret position in all cases
     *
     * @returns {object} left, top distance in pixels
     */

function getCaretTopPoint() {
      const sel = document.getSelection()
      const r = sel.getRangeAt(0)
      let rect
      let r2
      // supposed to be textNode in most cases
      // but div[contenteditable] when empty
      const node = r.startContainer
      const offset = r.startOffset
      if (offset > 0) {
        // new range, don't influence DOM state
        r2 = document.createRange()
        r2.setStart(node, (offset - 1))
        r2.setEnd(node, offset)
        // https://developer.mozilla.org/en-US/docs/Web/API/range.getBoundingClientRect
        // IE9, Safari?(but look good in Safari 8)
        rect = r2.getBoundingClientRect()
        return { left: rect.right, top: rect.top }
      } else if (offset < node.length) {
        r2 = document.createRange()
        // similar but select next on letter
        r2.setStart(node, offset)
        r2.setEnd(node, (offset + 1))
        rect = r2.getBoundingClientRect()
        return { left: rect.left, top: rect.top }
      } else { // textNode has length
        // https://developer.mozilla.org/en-US/docs/Web/API/Element.getBoundingClientRect
        rect = node.getBoundingClientRect()
        const styles = getComputedStyle(node)
        const lineHeight = parseInt(styles.lineHeight)
        const fontSize = parseInt(styles.fontSize)
        // roughly half the whitespace... but not exactly
        const delta = (lineHeight - fontSize) / 2
        return { left: rect.left, top: (rect.top + delta) }
      }
    }


String.prototype.wiki2html = wiki2html;

function wiki2html(s) {

	
    s = this;
    
    // lists need to be done using a function to allow for recusive calls
    function list(str) {
        return str.replace(/(?:(?:(?:^|\n)[\*#].*)+)/g, function (m) {  // (?=[\*#])
            var type = m.match(/(^|\n)#/) ? 'OL' : 'UL';
            // strip first layer of list
            m = m.replace(/(^|\n)[\*#][ ]{0,1}/g, "$1");
            m = list(m);
            return '<' + type + '><li>' + m.replace(/^\n/, '').split(/\n/).join('</li><li>') + '</li></' + type + '>';
        });
    }
    
    return list(s
        
        /* BLOCK ELEMENTS */
        .replace(/(?:^|\n+)([^# =\*<].+)(?:\n+|$)/gm, function (m, l) {
            if (l.match(/^\^+$/)) return l;
            return "\n<p>" + l + "</p>\n";
        })

        .replace(/(?:^|\n)[ ]{2}(.*)+/g, function (m, l) { // blockquotes
            if (l.match(/^\s+$/)) return m;
            return '<blockquote>' + l + '</pre>';
        })
        
        .replace(/((?:^|\n)[ ]+.*)+/g, function (m) { // code
            if (m.match(/^\s+$/)) return m;
            return '<pre>' + m.replace(/(^|\n)[ ]+/g, "$1") + '</pre>';
        })

        .replace(/(?:^|\n)([=]+)(.*)\1/g, function (m, l, t) { // headings
            return '<h' + l.length + '>' + t + '</h' + l.length + '>';
        })
    
        /* INLINE ELEMENTS */
        .replace(/'''(.*?)'''/g, function (m, l) { // bold
            return '<strong>' + l + '</strong>';
        })
    
        .replace(/''(.*?)''/g, function (m, l) { // italic
            return '<em>' + l + '</em>';
        })
    
        .replace(/[^\[](http[^\[\s]*)/g, function (m, l) { // normal link
            return '<a href="' + l + '">' + l + '</a>';
        })
    
        .replace(/[\[](http.*)[!\]]/g, function (m, l) { // external link
            var p = l.replace(/[\[\]]/g, '').split(/ /);
            var link = p.shift();
            return '<a href="' + link + '">' + (p.length ? p.join(' ') : link) + '</a>';
        })
    
        .replace(/\[\[(.*?)\]\]/g, function (m, l) { // internal link or image
            var p = l.split(/\|/);
            var link = p.shift();

            if (link.match(/^Image:(.*)/)) {
                // no support for images - since it looks up the source from the wiki db :-(
                return m;
            } else {
                return '<a contenteditable="false" href="' + link + '">' + (p.length ? p.join('|') : link) + '</a>';
            }
        })
    ); 
}


function setEndOfContenteditable(contentEditableElement)
{
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}


//Asynchronous save changes
masterTitle = document.title;
lastSavedTextContent = ""

function saveChanges(type){
	var textContent = document.querySelector("#main-txtbox").innerHTML
	if (textContent == lastSavedTextContent) {
		return 0;
	}
	var post = new URLSearchParams()
	post.append("body",textContent)
	var url = window.location.href

	if(type == 1) {
		fetch(url,{method:'POST',body:post}).then((e)=>{
		var oldTitle = document.title;
		document.title = "Saved...";
		setTimeout(function(){
			var d = new Date()
			var h = d.getHours()
			var m = d.getMinutes()
			oldTitle = "["+h+":"+m + "] " + masterTitle
			document.title = oldTitle
		}, 1000);
		lastSavedTextContent = textContent

	})
	.catch((e)=>{
		console.log("error")
		console.log(e)
	})

	}
	else {
		var xhr = new XMLHttpRequest()
		xhr.open('POST',url,false)
		xhr.send(post)
		document.title = "Saved!"
	}

	
}





//3 detik sekali autosave
var intervalID = setInterval(function(){saveChanges(1)},10000)
window.onbeforeunload = function(){
	saveChanges(0);
	return null;
}



linkCloserCounter = 0

document.onkeypress = function(e) {

	console.log(e)
	console.log(e.target)
	console.log(e.key)

	if (e.key == ']'){
		linkCloserCounter = linkCloserCounter + 1
	}
	else if (e.charCode == 32) {
		if (linkCloserCounter == 2) {
			//console.log(e.target.innerHTML)
			linkCloserCounter = 0

			console.log("kena!!")
			e.target.innerHTML = e.target.innerHTML.wiki2html()
        	setEndOfContenteditable(e.target)





		}
	}

	 else {
		linkCloserCounter = 0
	}

	console.log(linkCloserCounter)




	if (getCaretTopPoint().top >= 400) {
		window.scrollBy(0,100)
	}
}


