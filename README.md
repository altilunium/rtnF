# rtnF
Note-taking app. Tested on Ubuntu 20.04 LTS (amd64)

## How to use
1. Run "rtnf". It's an executable file.
2. Open "localhost:8080/edit/T", mark this link as a bookmark in your browser. It will be your gateway to access this application.
3. Write something. It will be autosaved each 3 minutes
4. Create a link to new note by typing \[[Something like this\]]. 
5. Oh, you can also paste images to your note. 
6. If you want to automatically start this program on startup. Edit "rtnf.service" file, modify the content to match your directory. Then "sudo systemctl enable rtnf" 
