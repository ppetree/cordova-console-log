// JavaScript Document

// make a multideminsional array for testing
var stuff = [];
    stuff["foreground"] = false;
    stuff["gcm.message_id"] = "01234567890abcdefghijklmnopqrstuvwxyz";
    stuff["gcm.notification.custom_field_1"] = 4;
    stuff["coldstart"] = false;
    stuff["gcm.notification.custom_field_2"] = 1;

var dataobj = [];
    dataobj["title"] = "robbery";
    dataobj["additionalData"] = stuff;
    dataobj["message"] = "Violent: Gun, Knife, smash and grab";
                    

// modified code stolen from stackoverflow
var print = function( o, maxLevel, level )
{
    if ( typeof level == "undefined" )
    {
        level = 0;
    }
    if ( typeof maxlevel == "undefined" )
    {
        maxLevel = 0;
    }

    var str = '';
    // Remove this if you don't want the pre tag, but make sure to remove
    // the close pre tag on the bottom as well
    if ( level == 0 )
    {
        str = '<pre>';   // can also be <pre>
    }

    var levelStr = '<br>';
    for ( var x = 0; x < level; x++ )
    {
        levelStr += '    ';   // all those spaces only work with <pre>
    }

    if ( maxLevel != 0 && level >= maxLevel )
    {
        str += levelStr + '...<br>';
        return str;
    }

    for ( var p in o )
    {
        switch(typeof o[p])
        {
          case 'string':
          case 'number':    // .tostring() gets automatically applied
          case 'boolean':   // ditto
            str += levelStr + p + ': ' + o[p] + ' <br>';
            break;
            
          case 'object':    // this is where we become recursive
          default:
            str += levelStr + p + ': [ <br>' + print( o[p], maxLevel, level + 1 ) + levelStr + ']</br>';
            break;
        }
    }

    // Remove this if you don't want the pre tag, but make sure to remove
    // the open pre tag on the top as well
    if ( level == 0 )
    {
        str += '</pre>';   // also can be </pre>
    }
    return str;
};

// this too was stolen... just don't remember from who... 
// load this first thing on deviceready()
// if first time (or doesn't exist), create a div at the bottom of the page
// write all log functions to that element by appending them.
function debugConsole()
{
    var original = window.console
    window.console = {
        log: function(){
           $('#debug').append( print(arguments) );
                        
            // call the original console.log()
            // original.log.apply(original, arguments)
        }, warn: function(){
            $('#debug').append( print(arguments) );
            // original.warn.apply(original, arguments)
        }, error: function(){
            $('#debug').append( print(arguments) );
            // original.error.apply(original, arguments)
        }
    }
}
