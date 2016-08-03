JOSE Toolbox
============

Yet another bunch of tools to use NICT's JOSE (Japan-wide Orchestrated Smart/Sensor Environment) Testbed.

![iterm2](https://github.com/itolab-hayashi-rafik/jose-toolbox/raw/master/img/iterm2.png "iterm2")

# iterm2.scpt
launches iterm2 with 40 split panes, each being connected to an individual JOSE compute node (e.g. 10.1.0.4).
Open `iterm2.scpt` in macOS's AppleScriptEditor, modify the script, and then run it.

# JOSE API
`jose.js` provides JOSE API to manipulate JOSE nodes. Most of the operations you can do in JOSE Portal are implemented. `jose_test.js` tests the implemented API.

# myscript.js
Useful functions will be provided in `myscript.js`. Currently a function to create a user on all of the compute nodes is implemented.

# http-proxy-server-in-80-lines
This is a lightweight http/https proxy server used to allow JOSE compute nodes to access to the internet. The sourcecode is originally provided by [LightSpeedC](https://gist.github.com/LightSpeedC) at https://gist.github.com/LightSpeedC/6413034
Run the following command to start the server. 
```
$ node http-proxy-server-in-80-lines.js
```