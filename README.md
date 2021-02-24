# rtnF
A web-based notetaking app. With WYSIWYG editor, support linking to other notes (wikilink), image paste support, basic formatting, autosave feature. Tested on Ubuntu 20.04 LTS (amd64)


## How to use
1. Run "rtnf". It's an executable file.
2. Open "localhost:8080/edit/T", mark this link as a bookmark in your browser. It will be your gateway to access this application.
3. Write something. It will be autosaved every 10 seconds. 
4. Create a link to new note by typing \[[Something like this\]]. The program will convert it to link once you pressed "\]","\]","space" keypress sequence. Since this syntax is using wiki syntax, try \[[Something like this|link\]] or \[[http://example.com\]].
5. You can also paste images to your note. Basic formatting shortcut (ctrl+b, ctrl+i, ctrl+u) also supported on Chromium based browser.
6. If you want to automatically start this program on startup. Edit "rtnf.service" file, modify the content to match your directory. Place that file in "/etc/systemd/system". Then, "sudo systemctl enable rtnf" 

### Note on Chromium-based browsers (Chrome, Edge, Chromium, Vivaldi, Brave)
Open `about:flags`, search #allow-sync-xhr-in-page-dismissal, enable it. It will enable "autosave on quit" feature, for more safety. Firefox users dont have to do this since this feature is automatically enabled.

### Static Site Generator
Once you finished writing your note on rtnF, you can export this as a single html file. Then you can host this file into the server as a static site, or you can send it to your peers as a html file. To enable this feature [[https://github.com/gildas-lormeau/SingleFile|SingleFile]] dependency is required (


## Screenshots
![Screenshot2](https://raw.githubusercontent.com/altilunium/rtnF/main/rtnf_screenshot2.jpeg)
