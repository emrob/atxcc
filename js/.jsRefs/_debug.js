$atxcc._debug = {// _debug.js

dgCount: 0,

//---------------------
debug: function (params) {
    // called by each function property in any class referenced in PROJECT.json
    // if corresponding property name in 'debug.js' (autogenerated) has value '1', then 
    // function call parameters are dumped to console.log.  

        // Bounce, unless mDebug is true
    if (!$atxcc.m.mDebug) {

        return

    } // end if (!m.mDebug)
    
        // Error produces stack trace, enabling calling fn to be extracted on 2nd line
    var err = new Error ()
    var fns = err.stack
        
        // skip first line -> .*\n, (expected to begin with '$1._debug.debug') then get full path of second line containing callling fn
        // 'at Object.' from webkit engines should be filtered out
        // 1st character of matching fn path cannot contain digit, so: '$_a-zA-Z' matches 1st chr
        // remaining characters can include letters, digits, '_' (\w), '$' or '.', as well as 
    var fn = fns.match (/^.*\n(?:\s*at Object\.)?([$_a-zA-Z][$\.\w]*)/)

    var caller = fn [1]
    var callerParts = caller.split ('.')  // extract nsName, propName

        // dg.scope is set classes that map to either 
        //   => 1)  '0' (output none of the property fns) or '1' (output all of the property fns), 
        //   => 2)  set of individually specified property fns mapping to either 0 or 1.
        // scopePath, therefore, maps namespace names to either 0 or 1 for case 1 or 
        //     individual property names to either 0 or 1
    var scopePath = {}

        // global Prefix is in callerParts [0]
    var nsName = callerParts [1]
    var propName = callerParts [2]

//    var scopeKeys = Object.keys (dg.scope)
    
    if ($atxcc.dg.scope.hasOwnProperty(nsName)) {

            // determine if entire set of fn's in namespace should output debug stmts
        if (typeof ($atxcc.dg.scope [nsName]) == 'number') {

            scopePath [nsName] = $atxcc.dg.scope [nsName]

        } else {

                // case where only specific functions are to be debugged
            scopePath [nsName] = 0
            var nsSet = $atxcc.dg.scope [nsName]

            if (nsSet.hasOwnProperty(propName)) {

                scopePath [propName] = nsSet [propName]

            } // end if (nsSet.hasOwnProperty(propName))


        } // end if (typeof (dg.scope [nsName]) == 'number' && dg.scope [nsName])
        

    } else {

        scopePath [nsName] = 0
        scopePath [propName] = 0

    } // end if (dg.scope.hasOwnProperty(nsName))
    
    
        // All the above builds scopePath to determine if doDebug gets called
    if ($atxcc.dg.scope ['all'] == 1 || scopePath [nsName] || scopePath [propName]) {

        $atxcc._debug.doDebug (caller, params)

    } // end if (dg.debug ['all'] = 1)
    
},


//---------------------
doDebug: function (caller, params) {

    console.log (++$atxcc._debug.dgCount + ' ' + caller + ':')

    var pkeys = Object.keys (params)
    var parent

    for (var i = 0; i < pkeys.length; i++) {

        var pname = pkeys [i]
        var pval = params [pname]

        var pvalId = ""
        if (pname == 'event') {

            pval = ' =>  type: ' + pval ['type'] + ' target_id: ' + pval['target'].id + ' pageX: ' + pval ['pageX'] + ' pageY: ' + pval ['pageY']

        } else {

                // if pval is an Id, get the parent hierarchy to 7 levels up
            if (typeof(pval) == 'string' && pval.match (/#i/)) {

                var curP = pval
                pvalId = pval  // capture pval, if id to dump 'text' value
                pval = ""

                for (var j = 0; j < 7; j++) {

                    pval += ' ' + curP 
                    pval += '(' + $(curP).attr('name') + ')'
                    curP = $(curP).parent().attr ('id')

                    if (!curP) {

                        break

                    } // end if (!curP)
                    
                    curP = '#' + curP

                } // end for (var j = 0; j < 3; j++)
                
            } // end if (pv.match (/^i#/))
            

        } // end if (pname == 'event')


        
        //var pval = JSON.stringify (params [pname]
//        console.log ('    ' + pname + ': ' + pval)
        $atxcc.ut.dumpOb (pname, pval)

        $atxcc.ut.clText ('    ', pvalId)
        //console.log ('    ' + pname + ': ')
        
        //console.log (JSON.stringify (params [pname]))
        //console.log (params [pname].toSource())
        //console.log (params [pname])

    } // end for (var i = 0; i < pkeys.length; i++)

}, // end doDebug ()


//---------------------
getName: function (pvalId) {
    
    var name = $(pvalId).attr('name')
    return name

}, // getName: function (pvalId) {




}  // $atxcc._debug
$atxcc._dg = $atxcc._debug
