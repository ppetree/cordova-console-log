# phonegap-console.log
takeover console.log in phonegap webviews and output text to a div.

History:
Like most developers, I find console.log output a valuable debugging tool and this was missing in phonegap. 

While looking for a way to output an array (other than stringify() ) I ran across two different functions in two different places. One on stackoverflow (the print function) and the other (taking over the console) I simply don't remember.

I modified both functions:
  1) The print function so that it would handle more typeof's
  2) I renamed the console function and added some jquery code to append the output string to the #debug div

How to use:
To use this, include the debug.js in all the html files in your project. Insert the #debug div on your pages. Then, takeover/hijack the console function by calling debugConsole() in your ondeviceready().

Inside the debug.html I documented all of the potential uses.  I also added a style which limits the height and adds scroll bars to the div, that way you can constrain the #debug div within your viewable area.

You can load debug.html in your browser and see what happens in the browsers console window... this really is very simple to use.

Expectations / limitations:
This isn't a full replacement for windows.console so don't expect it to do everything that console.log does. I don't do any of the variable replacement in strings nor does it handle more than one object. It suits my needs and, hopefully, it will help you as well.

