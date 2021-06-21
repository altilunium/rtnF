# rtnF
A web-based notetaking app. With WYSIWYG editor, support linking to other notes (wikilink), image paste support, basic formatting, autosave feature. Tested on Ubuntu 20.04 LTS (amd64)

## Screenshot
![Screenshot2](https://raw.githubusercontent.com/altilunium/rtnF/main/rtnf-screenshot.png)

## Download
Linux 64-bit : https://github.com/altilunium/rtnF/releases/download/v21.03/rtnf-v21.03.Linux64bit.zip \
Windows 64-bit : https://github.com/altilunium/rtnF/releases/download/v21.03/rtnf-v21.03.Win64bit.zip \
Windows version is still unstable. Please report if you found an issue.

## How to use
1. If you are using Ubuntu 64bit, just run "rtnf". It's an executable file. If you are using Windows, run "rtnf_win64.exe". 
2. Open "localhost:8080/edit/rtnf", mark this link as a bookmark in your browser. It will be your gateway to access this application.
3. Write something. It will be autosaved every several minutes and everytime you close the tab. 
4. Create a link to new note by typing \[[Something like this\]]. The program will convert it to link once you pressed "\]","\]","space" keypress sequence. Since this syntax is using wiki syntax, try \[[Something like this|link\]] or \[[http://example.com\]].
5. You can also paste images to your note. Basic formatting shortcut (ctrl+b, ctrl+i, ctrl+u) also supported on Chromium based browser.
6. (Ubuntu only) If you want to automatically start this program on startup. Edit `rtnf.service` file, modify the content to match your directory. Place that file in `/etc/systemd/system`. Then, `sudo systemctl enable rtnf` 


### Static Site Generator
Once you finished writing your note on rtnF, you can export this as a single html file. Then you can host this file into the server as a static site, or you can send it to your peers as a html file. In fact, https://altilunium.github.io/ is built on rtnF. To enable this feature, [SingleFile](https://github.com/gildas-lormeau/SingleFile) dependency is required (available on Firefox and Chromium-based browsers). After installing SingleFile, here is the steps :
1. Press Ctrl+. (it will "lock" your current page from further editing)
2. Use SingleFile to generate current page's single html file.
3. Done. You can distribute that html file to your peers or store it on your webserver.
4. To unlock your page, press Ctrl+. again




