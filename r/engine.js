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
    

    s = s.replace(/\[\[(.*?)\]\]/g, function (m, l) { // internal link or image
        var p = l.split(/\|/);
        var link = p.shift();
        return '<a contenteditable="false" href="' + link + '">' + (p.length ? p.join('|') : link) + '</a>';
    })

    return s


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
   

	if (e.key == ']'){
		linkCloserCounter = linkCloserCounter + 1
	}
	else if ((linkCloserCounter == 2) && (e.charCode == 32)) {
		linkCloserCounter = 0
		e.target.innerHTML = e.target.innerHTML.wiki2html()
    	setEndOfContenteditable(e.target)
	}
	else {
		linkCloserCounter = 0

	}

	if (getCaretTopPoint().top >= 400) {
		window.scrollBy(0,100)
	}
}


