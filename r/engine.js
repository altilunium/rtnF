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



document.onkeypress = function(e) {
	if (getCaretTopPoint().top >= 350) {
		window.scrollBy(0,100)
	}
}

