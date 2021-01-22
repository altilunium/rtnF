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

var LinkNode;


function htmlToElement(html) {
  var template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

String.prototype.wiki2html = wiki2html;
String.prototype.wiki2html2 = wiki2html2;


//Will fill LinkNode with <a> node
function wiki2html(s) {
    s = this;
    s = s.replace(/\[\[(.*?)\]\]/g, function (m, l) { // internal link or image
        var p = l.split(/\|/);
        var link = p.shift();
        LinkNode = '<a contenteditable="false" href="' + link + '">' + (p.length ? p.join('|') : link) + '</a>';
      
        //LinkNode = htmlToElement(constructedString);
        return '<a contenteditable="false" href="' + link + '">' + (p.length ? p.join('|') : link) + '</a>';
        //return '';
    })
    return s
}

//Will remove the [[link]] syntax
function wiki2html2(s) {
    s = this;
    s = s.replace(/\[\[(.*?)\]\]/g, function (m, l) { // internal link or image
        var p = l.split(/\|/);
        var link = p.shift();
        //return '<a contenteditable="false" href="' + link + '">' + (p.length ? p.join('|') : link) + '</a>';
        return '';
    })
    return s
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
		document.title =  "*" + oldTitle;
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
var intervalID = setInterval(function(){saveChanges(1)},3000)

//Autosave when close
//Bisa di Firefox. Dilarang di Chromium -_-
window.onbeforeunload = function(){
	saveChanges(0);
	return null;
}

                                                                                                                                
linkCloserCounter = 0


var a,b

function pasteHtmlAtCaret(html) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
            
            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}



function moveCaret(win, charCount) {
    var sel, range;
    if (win.getSelection) {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var textNode = sel.focusNode;
            var newOffset = sel.focusOffset + charCount;
            sel.collapse(textNode, Math.min(textNode.length, newOffset));
        }
    } else if ( (sel = win.document.selection) ) {
        if (sel.type != "Control") {
            range = sel.createRange();
            range.move("character", charCount);
            range.select();
        }
    }
}



document.onkeypress = function(e) {

	if (e.key == ']'){
		linkCloserCounter = linkCloserCounter + 1
	}
	else if ((linkCloserCounter == 2) && (e.charCode == 32)) {
		 
    linkCloserCounter = 0

    a = window.getSelection().anchorNode;

    //Save old text
    var old_html = a.nodeValue
    //Delete the [[this]] part
    a.nodeValue = a.nodeValue.wiki2html2();
    //Move the caret forward
    moveCaret(window,a.nodeValue.length)
    //Doing this will fill "LinkNode" to an <a> node
    var c = old_html.wiki2html()
    //Paste <a> node at current caret
    pasteHtmlAtCaret(LinkNode);
    //Async-save
    saveChanges(1)
	}
	else {
		linkCloserCounter = 0
	}

	if (getCaretTopPoint().top >= 400) {
		window.scrollBy(0,100)
	}
}

var textarea = document.getElementById("main-txtbox");
textarea.spellcheck = false;
textarea.focus();
textarea.blur();
