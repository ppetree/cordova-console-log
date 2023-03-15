# cordova-console.log
takeover console.log in cordova webviews and output text to a div.

History:
Like most developers, I find console.log output a valuable debugging tool and this was missing when trying to debug cordova apps in the field (without a laptop or desktop).

My solution, when I originally wrote about 7 years ago, was to hijack the console.log, console.warn and console.error functions and write the output to a &ltdiv&gt.

Since the original version, I've added a few functions and a few others had fallen behind so this version constitutes a pretty major rewrite with some added functions.

How to use:
To use this, include the debug.js in your index.html. Next create a debug page and add the debug like this: <div id="debug"></div>.
Alternatively, you can add the debug div to your index.html or another page, depending on your needs. I find having a separate debug page works best for 99% of my uses.

Next, inside your onDeviceReady(), add a call to debugConsole() and this will take over the console logging from that point onward. Obviously, the earlier in the process the better. To view errors, simply call up the debug.html page, run the debugPageInit() and that will load all your messages into the div.

If you want to save the log messages as part of the onPause/onResume testing then in the onPause handler call the debugSaveHistory() and your current messages will get save to localStorage.

Inside the debug.html I documented all of the potential uses.  I also added a style which limits the height and adds scroll bars to the div, that way you can constrain the #debug div within your viewable area.

You can load debug.html in your browser and see what happens in the browsers console window... this really is very simple to use.

Expectations / limitations:
This isn't a full replacement for windows.console so don't expect it to do everything that console.log does. I don't do any of the variable replacement in strings nor does it handle more than one object. It suits my needs and, hopefully, it will help you as well.

