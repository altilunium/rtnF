# rtnF
A web-based notetaking app. With WYSIWYG editor, support linking to other notes (wikilink), image paste support, basic formatting, autosave feature. 

[rtnF v21.10 (Windows 64 bit) download](https://github.com/altilunium/rtnF/releases/download/v21.10/rtnf-v21.10.Win64bit.zip)


## Screenshot
![Screenshot2](https://raw.githubusercontent.com/altilunium/rtnF/main/rtnf-screenshot.png)



## How to use
1. Write something. It will be autosaved every several minutes and everytime you close the tab. 
2. Create a link to new note by typing \[[Something like this\]]. The program will convert it to link once you pressed "\]","\]","space" keypress sequence. Since this syntax is using wiki syntax, try \[[Something like this|link\]] or \[[http://example.com\]].
3. You can also paste images to your note. Basic formatting shortcut (ctrl+b, ctrl+i, ctrl+u) also supported on Chromium based browser.


### Static Site Generator
Once you finished writing your note on rtnF, you can export this as a single html file. Then you can host this file into the server as a static site, or you can send it to your peers as a html file. In fact, https://altilunium.github.io/ is built on rtnF. To enable this feature, [SingleFile](https://github.com/gildas-lormeau/SingleFile) dependency is required (available on Firefox and Chromium-based browsers). After installing SingleFile, here is the steps :
1. Press Ctrl+. (it will "lock" your current page from further editing)
2. Use SingleFile to generate current page's single html file.
3. Done. You can distribute that html file to your peers or store it on your webserver.
4. To unlock your page, press Ctrl+. again

### Whitepaper
[Rancang Bangun Aplikasi Note-Taking Berbasis Wiki](https://www.researchgate.net/publication/353527090_Rancang_Bangun_Aplikasi_Note-Taking_Berbasis_Wiki) (in Indonesian)





