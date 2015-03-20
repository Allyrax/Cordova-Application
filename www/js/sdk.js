/**
 * Copyright Digital Engagement Xperience 2015
 * @description
 */

/*jslint browser: true */
/*jslint devel: true */
/*jslint nomen: true */
/*global dexit, PubSub */
if (!dexit) {
    var dexit = {};
}
if (!dexit.msdk) {
    dexit.msdk = {};
}
dexit.msdk._listener = {};
/**
 * Setup listener for player winder
 * @param iframe {object}  reference to iframe's .contentWindow  (ie. document.getElementById('targetFrame').contentWindow)
 */
dexit.msdk.setupPostMessageListener = function () {
    "use strict";
    var iframe;

    function receiveMessage(e) {
        console.log(e.data);

        //reference to other iframe that sent message
        iframe = e.source;


        if (e.data) {
            var data = JSON.parse(e.data);
            if (data.type && data.type === 'dexit.sdk.xkb.plugins.registrationResponse') {
                console.log("successfully registered");
            }else if (data.type && data.type === 'dexit.sdk.xkb.plugins.extractData') {
                console.log('call to extract data');
                var response = dexit.msdk.xkbPluginManager.getData(data.name);
                var toSend = JSON.stringify({
                    data: response,
                    type: 'dexit.sdk.xkb.plugins.extractDataResponse',
                    messageId : data.messageId
                });
                setTimeout(function() {
                    iframe.postMessage(toSend, e.origin);
                }, 200);
            }
        }
    }

    //add listener for postMessage
    window.addEventListener('message', receiveMessage);


};


/**
 * Set the player url.
 * @param host {string} host name
 * @param path {string} path which should include the /   Defaults to "";
 * @param location {string} location suffix (ie.  ?location=111)  Defaults to ""
 * @param iframe {string} the iframe dom element
 */

dexit.msdk.setPlayerUrl = function (host, path, location, iframe) {
    "use strict";
    var str = "https://" + host;
    if (path) {
        str += path
    }
    if (location) {
        str += location
    }

    if (iframe) {
        iframe.src = str;
    }

};
/**
 *
 * @param iframes {Array} All iframes contentWindows.  If not specified will take try playerFrame from the DOM
 * @constructor
 */
dexit.msdk.XKbPluginManager = function (iframes) {
    "use strict";
    this.plugins = [];
    this.iframes  = iframes|| [document.getElementById("playerFrame")];
    dexit.msdk.setupPostMessageListener();
};


dexit.msdk.XKbPluginManager.prototype.getData = function(name) {

    var self = this;
    var toReturn = "";
    for (var i=0;i< self.plugins.length;i++) {
        var plugin = self.plugins[i];

        if (plugin.name === name) {
            var str = (plugin.namespace ? plugin.namespace + '.' + plugin.extractDataFunction : plugin.extractDataFunction);


            try {
                var data = eval(str + "()");

                toReturn = data;
            }catch(e) {
                alert("warning your plugin is not properly loaded");
                console.log("warning your plugin is not properly loaded");
            }
        }
    }

    return toReturn;


};


dexit.msdk.XKbPluginManager.prototype.registerPlugin = function (options) {
    var self = this;

    /**
     * Returns validated plugin or returns nothing if failed
     */
    function validatePlugin(options) {

        var plugin = {
            name: options.name,
            namespace: options.namespace,
            extractDataFunction: options.extractDataFunction,
            pluginUpdatesFunction: options.pluginUpdatesFunction
        };
        return plugin;
    }

    var plugin = validatePlugin(options);
    if (!plugin) {
        return;
    }else {
        this.plugins.push(plugin);
        //send registration to each embedded player url loaded
        for (var i=0;i<self.iframes.length;i++) {
            var iframe = self.iframes[i].contentWindow;
            var src = self.iframes[i].src;

            var parser = document.createElement('a');
            parser.href = src;
            var url = parser.protocol + '//' + parser.host;

            iframe.postMessage(JSON.stringify({"type": "dexit.sdk.xkb.plugins.registration", data: plugin}),url);
        }
    }


};

var here = "50 -120";
var now = "474898981";


dexit.msdk.extract = function(args) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    alert(here + " " + now);
    return { "location": here, "time": now}
};


// onSuccess Geolocation
    //
function onSuccess(position) {
    here = position.coords.latitude + " " + position.coords.longitude;
    now = position.timestamp;
}

    // onError Callback receives a PositionError object
    //
function onError(error)  {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

