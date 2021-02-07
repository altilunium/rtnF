# rtnF
A web-based notetaking app. With WYSIWYG editor, support linking to other notes (wikilink), image paste support, basic formatting, autosave feature. Tested on Ubuntu 20.04 LTS (amd64)


## How to use
1. Run "rtnf". It's an executable file.
2. Open "localhost:8080/edit/T", mark this link as a bookmark in your browser. It will be your gateway to access this application.
3. Write something. It will be autosaved each 3 minutes
4. Create a link to new note by typing \[[Something like this\]]. The program will convert it to link once you pressed "\]","\]","space" keypress sequence.
5. Oh, you can also paste images to your note. Basic formatting shortcut (ctrl+b, ctrl+i, ctrl+u) also supported on Chromium based browser.
6. If you want to automatically start this program on startup. Edit "rtnf.service" file, modify the content to match your directory. Place that file in "/etc/systemd/system". Then, "sudo systemctl enable rtnf" 

## Screenshots
![Screenshot](https://raw.githubusercontent.com/altilunium/rtnF/main/rtnf-screenshot.png)
![Screenshot2](https://raw.githubusercontent.com/altilunium/rtnF/main/rtnf_screenshot2.jpeg)
