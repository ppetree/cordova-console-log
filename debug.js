// JavaScript Console hijacker

/* 
 * This is a very simple console.log hijacker.
 *
 * Why use a console.log hijacker? Because sometimes, it's just easier to view the console
 * inside the app than to hook up to a computer and muck around. This is especially true 
 * when your app uses GPS and needs to be tested in the 'wild.'
 * 
 * To use:
 * Create a div on the page where you want the debug output and give it the id='debug'
 * like this: <div id="debug"></div>
 * 
 * If you put this div on a separate page, no worries, the output will be stored in the arrDebug[]; until
 * the page is loaded. Also, if you do use a separate page, call the debugPageInit() when the page is loaded
 * 
 * To start the console.log hijacker call the debugConsole() within your deviceready(). The earlier the better.
 * 
 * NOTE: If you're going to plug your device into a computer and debug with a browser like safari 
 * or chrome, you will need to comment out debugConsole() otherwise you will not see any output 
 * in the browsers console as this will capture it.
 * 
 * There's a function to clear/reset the debug div and array called debugClear();
 * 
 * Also, if you have cordoa.plugin.email installed, you can email the debug output to whatever email 
 * address you desire by using the debugEmail() function.
 * 
 * Functions in this file:
 * debugConsole()  - no params, used to hijack the original console.
 * debugPageInit() - no params, used to initialize the page containing the <div id='debug'></div
 *                   which is where we display the debug output.
 * timeStamp(bDateFlag) single boolean param if true returns the full date/time string,
 *                      if false, it returns a timestamp.
 * debugEmail(first, last, email) - params are first name, last name and email. 
 *                   Currently only email is used, the content (body of the email) is generated
 *                   from the arrDebug[]. This function can be hooked to a button or menu item and
 *                   when invoked it will popup the "compose email" window OR produce an error if
 *                   don't have the cordova.plugin.email installed.
 * debugClear() - no params
 * debugGetHistory() - no params, returns saved arrDebug data - this is called when the 
 *                   console hijacker is initialized via debugConsole()
 * debugSaveHistory() - no params, uses JSON.stringify to convert the arrDebug to a string
 *                    and then saves that to localStorage as "debug" - call this in your 
 *                    onPause handler and then debugConsole will automatically restore the
 *                    debug data from the last run.
 * getType(variable) - some type of variable (num, string, obj etc), returns the typeof of that
 *                   variable. This currently uses typeof() but you can write your own that has
 *                   more accuracy (search stackoverflow)
 * getColor(variable) - param is a string returned from getType and returns the color that Chrome
 *                   uses to display variables. This is added to the <span> as a style.
 * syntaxHighlight(json) - param is a json string and if it's not a string it gets converted to 
 *                   json, then it's prettied up and the components are colorized.
 * debugMessage(arguments) - arguments are the params passed to console.log/.warn/.error
 *                    The type is determined and the argument is formatted accordingly and
 *                    an html string is returned.
 */

// this holds the console.log output until it's cleared.
var arrDebug = [];

// call this first thing on deviceready()
// if first time (or doesn't exist), create a div at the bottom of the page
// write all log functions to that element by appending them.
function debugConsole()
{
  // get any previously saved debug data
  let history = debugGetHistory();
  if(history)
    arrDebug = history;

  // initialize the array with some basic info
  arrDebug.push("== Debugging " +userInfo.dname +" ==");
  arrDebug.push("== " +timeStamp(true) +" ==");

  // take over the onerror function as this is outside the console
  // this way we can trap bad errors on app startup etc.
  window.onerror = function(message, source, lineno, colno, error) {
    // build the err message
    var html = "<span style='color:red'>ERROR:<br>"
             + "<span style='overflow-wrap: break-word'>" +message +"</span><br>"
             + "<span>URL: " +source +"</span><br>"
             + "<span>Line: " +lineno +"</span><br>"
             + "<span>Column: " +colno +"</span><br>"
             + "<span>Error Object: " +JSON.stringify(error) +"</span>"
             + "</span";

    // save this to the array for later use
    arrDebug.push(html);

    // figure out which way to display it       
    if(appInfo.bInitialized == true)                      // true if all startup initialization is complete
    {
      // using a debug page already loaded in the DOM or an external page
      if(document.getElementById("debug") !== null)
      {
        // display it on our debug page
        // $('#debug').append("<pre style='overflow-wrap: break-word'>" +html +"</pre>");
        document.getElementById("debug").insertAdjacentHTML('beforeend', "<pre style='overflow-wrap: break-word'>" +html +"</pre>");
      }
      else
      {
        // no #debug node so lust leave it in the array
        alert( html );
        return(false);
      }
    }
    else
    {
      // no debug page, display it in an alert()
      alert( html );
    }
    return(false);
  };
  
  // save the original console.
  var original = window.console;
  // now hijack the console and replace it with our own.
  window.console = {
      log: function(arguments) {
        var message = debugMessage(arguments);

        // save this message
        arrDebug.push(message);

        // if we have a div, display it as well
        if(document.getElementById("debug") !== null)
        {
          // $('#debug').append("<pre>" +message +"</pre>");
          document.getElementById("debug").insertAdjacentHTML('beforeend', "<pre style='overflow-wrap: break-word'>" +message +"</pre>");
        }
      }, warn: function(arguments){
        var message = debugMessage(arguments);

        // save this message
        arrDebug.push(message);

        // if we have a div, display it as well
        if(document.getElementById("debug") !== null)
        {
          // $('#debug').append("<span style='color:orange'>WARNING:<pre>" +message +"</pre></span>");
          document.getElementById("debug").insertAdjacentHTML('beforeend', "<span style='color:orange'>WARNING:<pre>" +message +"</pre></span>");
        }
      }, error: function(arguments){
        var message = debugMessage(arguments);

        // save this message
        arrDebug.push(message);

        // if we have a div, display it as well
        if(document.getElementById("debug") !== null)
        {
          // $('#debug').append("<span style='color:red'>ERROR:<pre>" +message +"</pre></span>");
          document.getElementById("debug").insertAdjacentHTML('beforeend',"<span style='color:red'>ERROR:<pre>" +message +"</pre></span>");
        }
      }
  };
}

// this function formats the message and returns
// a string that we can store in the arrDebug and/or
// output to the debug div.
function debugMessage(arguments)
{
  var message;
  switch(getType(arguments))
  {
    case 'boolean':
      message = arguments ? 'TRUE' : 'FALSE';
      break;

    case 'string':
      message = arguments;
      break;

    case 'number':
      message = arguments.toString();
      break;

    case 'undefined':
    case 'object':
    case 'function':
    case 'default':
      message = JSON.stringify(arguments, null, 2);
      message = syntaxHighlight(message);
      break;
  }
  return(message);
}


// https://stackoverflow.com/users/27862/user123444555621
function syntaxHighlight(json)
{
  // just in case, make sure it's already in a string and if not, convert it to a json
  if (typeof json != 'string')
  {
    json = JSON.stringify(json, undefined, 2);
  }
  // convert the <> to something html can display
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
   
  // now we can colorize the variables
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var sty = getColor('number');
      if (/^"/.test(match)) {
          if (/:$/.test(match)) {
              sty = getColor('key');
          } else {
              sty = getColor('string');
          }
      } else if (/true|false/.test(match)) {
          sty = getColor('boolean');
      } else if (/null/.test(match)) {
          sty = getColor('null');
      }
      return '<span style="' +sty +'">' +match +'</span>';
  });
}

// this function takes a variable and returns the type.
// for now this just returns the typeof for that var but
// could be updated to handle more times ala ES.5
function getType(variable)
{
  switch(typeof(variable))
  {
    case 'number':
      return("number");
    
    case 'string':
      return("string");
    
    case 'boolean':
      return("boolean");

    case 'undefined':
      return("undefined");

    case 'object':
      return("object");
    
    case 'function':
      return("function");
  }
}

// getColor takes a type from getType (plus a few more) and
// returns the color chrome uses to display that type in their console
function getColor(type)
{
  _string = 'color:green',
  _number = 'color:darkorange',
  _boolean = 'color:blue',
  _null = 'color:magenta',
  _key = 'color:red',
  _generic = 'color:black';

  switch(type)
  {
    case 'number':
      return(_number);
    
    case 'string':
      return(_string);
    
    case 'boolean':
      return(_boolean);

    case 'undefined':
      return(_generic);

    case 'null':
      return(_null);
    
    case 'key':
      return(_key);
  }
}

// this function preps what you see in the debug div
// and (if installed) will use the plugin cordova.plugins.email.open()
// to create and populate an email (probably to yourself)
function debugEmail(first, last, email)
{
  var output = $('#debug').text();
  var a = localStorage.getItem("debug");

  if(a) 
  {
    output += "\n\n" +a;
  } 
  
  output = output.replace(/0: /g, "<br>" );
  eMail(first, last, first +" " +last, email, output);
  cordova.plugins.email.open({
    isHtml: true,
    to:      email,
    subject: 'Mobile App Debug Output ',
    body:    output
  });
}

// this gets the arrDebug from the last session and restores it to the current arrDebug
function debugGetHistory()
{
  var history = localStorage.getItem("debug");
  if(history) 
  {
    return(JSON.parse(history));
  }
  // if local storage was empty, don't return anything
  return;

}

// saves the current arrDebug
function debugSaveHistory()
{
  if(arrDebug.length > 0)
  {
    let history = JSON.stringify(arrDebug);
    localStorage.setItem("debug", history);
  }
}

// this will clear the debug div, empty the array and clear the local storage variable
function debugClear()
{
  if(confirm("Really clear the debug contents?") == true)
  {
    $("#debug").empty();
    arrDebug = [];
    localStorage.removeItem("debug");  
  }
}

// returns a timestamp
// IF the bDateFlag is set, it returns a date + timestamp
// see debugPageInit() for a calling example
function timeStamp(bDateFlag)
{
  var date = new Date();                        // get a new date (local machine date time)  
  var n = date.toDateString();                  // get the date as a string
  // var time = date.toLocaleTimeString();         // get the time as a string
  var m = date.getMilliseconds();
  var time = date.getHours() +":" +date.getMinutes() +":" +date.getSeconds() +":" +m;

  if(bDateFlag)
    return(n +" " +time +"/" +m);
  else
    return(time);
 }

// Converts an object into an array 
// this function is no longer used
function objectToArray(obj)
{ 
  var array = [];
  for (prop in obj)
  {
    if (obj.hasOwnProperty(prop)) { 
        array.push(obj[prop]); 
    }
  } 
  return array;
} 

// this function populates the <div id="debug"> whenever the debug page is loaded
function debugPageInit()
{
  // this will output any data we have
  arrDebug.push("== " +timeStamp(true) +" ==");

  if(arrDebug.length)
  {
    arrDebug.forEach(function(err) {
      // $('#debug').append("<pre>" +err +"</pre>" );
      document.getElementById("debug").insertAdjacentHTML('beforeend',"<pre>" +err +"</pre>");
    });
  }
}