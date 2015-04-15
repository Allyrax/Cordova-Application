/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


/**
 * This file only is a sample provided based off of the cordova sample for your use
 * @type {{initialize: Function, bindEvents: Function, onDeviceReady: Function, receivedEvent: Function}}
 */
var token = "";
var email = "skethees@uwo.ca";

$( document ).ready(function() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    getToken();
});

function onSuccess(position) {
    here = position.coords.latitude + " " + position.coords.longitude;
    now = position.timestamp;

    var element = document.getElementById('geolocation');
            element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
                                'Longitude: '          + position.coords.longitude             + '<br />' +
                                'Altitude: '           + position.coords.altitude              + '<br />' +
                                'Accuracy: '           + position.coords.accuracy              + '<br />' +
                                'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
                                'Heading: '            + position.coords.heading               + '<br />' +
                                'Speed: '              + position.coords.speed                 + '<br />' +
                                'Timestamp: '          + position.timestamp                    + '<br />';
}

    // onError Callback receives a PositionError object
    //
function onError(error)  {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

function test() {
    alert("button");
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        alert("device ready");
        app.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {


        console.log('Received Event: ' + id);



        //Example to pragmatically set the iframe src
        //dexit.msdk.setPlayerUrl("player.dexit.co","/player");


        setTimeout(function() {

            //This assumes you have only one iframe on the page with the player.  If there are multiple you need to pass there reference in like below
            var wid = document.getElementById("playerFrame");
            dexit.msdk.xkbPluginManager = new dexit.msdk.XKbPluginManager([wid]);

            var options = {
                "name": "TestxKBPluginManagement",
                "namespace": "dexit.msdk",
                "extractDataFunction": "extract",
                "pluginUpdatesFunction": ""
            };

            dexit.msdk.xkbPluginManager.registerPlugin(options);

        }, 2000); //delay to make sure page is loading
    }
};

app.initialize();

 function getToken()  {
     $.ajax({
         type: 'POST',
         url: 'https://sso.dexit.co/openam/oauth2/access_token?realm=techiesindev',
         headers: {
             "Content-Type":"application/x-www-form-urlencoded",
             "Authorization": "Basic ZHgtc2VydmljZToxMjMtNDU2LTc4OQ==",
         },
         data: {
             "grant_type":"password",
             "username":"",
             "password":""
         },
         success: function(data, status){
             //Add buttons
             alert(data.access_token);
             token = data.access_token;
             queryDatabase();
         },
         error: function(xhr,status,error){
             alert(error);
         }
     });
 }

 function queryDatabase() {
    var query = "SELECT course_id FROM developer_course_student WHERE student_email= \'"+ email +"\'";

    $.ajax({
         type: 'GET',
         url: 'http://developer.kb.dexit.co/access/stores/course_admin/query/?query='+query,
         headers: {
             'Authorization' : 'Bearer '+ token,
             'Accept' : 'application/json',
             'Name' : 'Value'
         },
         success: function(data, status){

             console.log(data);

             var classes = data.result.rows;
             if(classes.length == 0)
                 alert("No Classes");

             classes.forEach(addClass);

         },
         error: function(xhr,status,error){
             alert(error);
         }
     });
 }

 function addClass(element, index, array) {
    console.log(element);
     $('#classDiv').append('<button id="http://player.dexit.co/player/?course=techs'+element+'" onclick="setPlayerUrl()">' + element + '</button>');
 }

 function setPlayerUrl() {
    var classUrl = event.target.id;
    $('#playerFrame').attr("src",classUrl);

    setTimeout(function() {

        //This assumes you have only one iframe on the page with the player.  If there are multiple you need to pass there reference in like below
        var wid = document.getElementById("playerFrame");
        dexit.msdk.xkbPluginManager = new dexit.msdk.XKbPluginManager([wid]);

        var options = {
            "name": "TestxKBPluginManagement",
            "namespace": "dexit.msdk",
            "extractDataFunction": "extract",
            "pluginUpdatesFunction": ""
        };

        dexit.msdk.xkbPluginManager.registerPlugin(options);

    }, 2000); //delay to make sure page is loading
 }
