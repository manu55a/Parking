
var pictureSource; // picture source
var destinationType; // sets the format of returned value

// Wait for device API libraries to load
//
document.addEventListener("deviceready", onDeviceReady, false);
// device APIs are available
//
function onDeviceReady()
{
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
//        navigator.geolocation.getCurrentPosition(onSuccessGPS, onErrorGPS);
//        checkConnection();
    navigator.vibrate([1000]);
// corre en background        

//        cordova.plugins.backgroundMode.enable();
//        cordova.plugins.backgroundMode.configure({
//            silent: true
//        })
    /*
     cordova.plugins.backgroundMode.setDefaults({ text:'Doing heavy tasks.'});
     // Enable background mode
     cordova.plugins.backgroundMode.enable();
     
     // Called when background mode has been activated
     cordova.plugins.backgroundMode.onactivate = function () {
     setTimeout(function () {
     // Modify the currently displayed notification
     cordova.plugins.backgroundMode.configure({
     silent: true
     });
     }, 5000);
     }
     
     
     */
}

// Log de estacionamientos
function log() {
    var ref = window.open('http://www.macle.com.ar/parking/verpar.php', '_blank', 'location=no');
}

// Notificaciones vía GCM con pushplugin
//-------------------------------------------
function successHandler(result)
{
    alert('Callback Success! Result = ' + result);
}

function errorHandler(error)
{
    alert(error);
}

function onNotificationGCM(e)
{
    switch (e.event)
    {
        case 'registered':
            if (e.regid.length > 0)
            {
                //console.log("Regid " + e.regid);
                alert('Registration ID = ' + e.regid);
                //Cuando se registre le pasamos el regid al input 
                document.getElementById('regId').value = e.regid;
            }
            break;

        case 'message':
            // NOTIFICACION!!! 
            //alert('message = ' + e.message + ' msgcnt = ' + e.msgcnt);
            if (e.message.toString()!='undefined')
                alert(e.message);
            break;

        case 'error':
            alert('GCM error = ' + e.msg);
            break;

        default:
            alert('An unknown GCM event has occurred');
            break;
    }
}

function reggcm()
{
    var pushNotification = window.plugins.pushNotification;
    if (device.platform == 'android' || device.platform == 'Android') {
        //alert("Llamada al registro");
        pushNotification.register(successHandler, errorHandler, {"senderID": "44145671782", "ecb": "onNotificationGCM"});
    }
    else {
        //alert("Llamada al registro");
        pushNotification.register(successHandler, errorHandler, {"badge": "true", "sound": "true", "alert": "true", "ecb": "onNotificationAPN"});
    }
}

function registrar_servidor()
{
    var regId = document.getElementById('regId').value;
    var device_model = device.model;
    var device_platform = device.platform;
    if (regId != "") {
        //Enviamos los datos al servidor php 
        //document.formulario.submit();
        var url = 'http://www.macle.com.ar/servergcm/registro.php?regId='+regId+'&name='+device_model+'&email='+device_platform;
        var ref = window.open(url, '_blank', 'location=no');
        $(ref.document).ready(function() {
            alert('READY');
        });
    }
    else
    {
        alert('Esperando el regId del registro en GCM!');
    }
    //navigator.app.exitApp();
}
// FIN Notificaciones vía GCM con pushplugin
//-------------------------------------------

// linterna on/off
function linterna() {
    window.plugins.flashlight.toggle();
//        window.plugins.pinDialog.prompt("Te gusto mi linterna?", callback, "Linterna", ["Claro que si","No"]);    
}

function notifica() {
    window.plugin.notification.badge.set(1);
    navigator.vibrate([500]);
    navigator.notification.beep(2);
}

// Respuesta del alert
function callback(results) {
    if (results.buttonIndex == 1)
    {
        // Si
        alert(results.input1);
    }
    if (results.buttonIndex == 2)
    {
        // No
        alert("No");
    }
}

// GPS
function gps() {
    navigator.geolocation.getCurrentPosition(onSuccessGPS, onErrorGPS);
    var element = document.getElementById('geolocaliza');
    element.innerHTML = '<img src="wait.gif" />';
}

function onSuccessGPS(position) {
    var element = document.getElementById('geolocaliza');
    element.innerHTML = 'Latitud: ' + position.coords.latitude + '<br />' +
            'Longitud: ' + position.coords.longitude + '<br />' +
            'Altitud: ' + position.coords.altitude + '<br />' +
            'Presicion: ' + position.coords.accuracy + '<br />' +
            'Presicion de Altitud: ' + position.coords.altitudeAccuracy + '<br />' +
            'Grados: ' + position.coords.heading + '<br />' +
            'Velocidad: ' + position.coords.speed + '<br />' +
            'Tiempo: ' + position.timestamp + '<br />';
    graba(position.coords.latitude, position.coords.longitude);
    inimap(position.coords.latitude, position.coords.longitude);
    //    sms(position.coords.latitude,position.coords.longitude);
    enviamail();
}

function onErrorGPS(error) {
    alert('Error: ' + error.code + '\n' +
            'Mensaje: ' + error.message + '\n');
}

// Google Maps

function inimap(lat, lon) {
    var mapOptions = {
        center: new google.maps.LatLng(lat, lon),
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.MAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    var marker = new google.maps.Marker({
        position: map.getCenter(),
        map: map,
        title: 'Mi posicion'
    });
}

// Redes habilitadas

function checkConnection() {
    var redcon = document.getElementById('redes');
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Conexion Desconocida';
    states[Connection.ETHERNET] = 'Conexion Ethernet';
    states[Connection.WIFI] = 'Conexion WiFi';
    states[Connection.CELL_2G] = 'Conexion Celular 2G';
    states[Connection.CELL_3G] = 'Conexion Celular 3G';
    states[Connection.CELL_4G] = 'Conexion Celular 4G';
    states[Connection.CELL] = 'Conexion Celular generica';
    states[Connection.NONE] = 'Sin Conexion';
    redcon.innerHTML = 'Tipo de Conexion;' + states[networkState] + '<br />';
}

// Graba geoposicion en macle

function graba(latitud, longitud)
{

    var fecha = new Date().toJSON().slice(0, 10);
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    if (m < 10) {
        m = "0" + m
    }
    ;
    if (s < 10) {
        s = "0" + s
    }
    ;
    var hora = h + ":" + m + ":" + s;
    var key = 'AIzaSyB6LYglGPstG1CRRxblYWPRfV_AXRvy_AY';
    $("#geograba").load("http://www.macle.com.ar/parking/inspar.php", {latitud: latitud, longitud: longitud, fecha: fecha, hora: hora, key: key});
}

// envia un SMS
function sms(latitud, longitud) {
    var number = '+5493585065662';
    var message = 'Estacionaste loco';
    var intent = "INTENT"; //leave empty for sending sms using default intent
    var success = function() {
        alert('SMS ok');
    };
    var error = function(e) {
        alert('SMS error:' + e);
    };
    sms.send(number, message, intent, success, error);
}

function enviamail() {
    window.plugins.EmailComposer.showEmailComposerWithCallback(null, "Parking", "Este es un mail autom&aacute;tico desde <b>Parkeing<b/>:", ["soporte@danielrivarola.com.ar", "danielnelsonrivarola@gmail.com"], [], [], true, ["logo.png", "icon.png"]);
}


// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
    // Uncomment to view the base64-encoded image data
    // console.log(imageData);

    // Get image handle
    //
    var smallImage = document.getElementById('smallImage');
    // Unhide image elements
    //
    smallImage.style.display = 'block';
    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    smallImage.src = "data:image/jpeg;base64," + imageData;
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
    // Uncomment to view the image file URI
    // console.log(imageURI);

    // Get image handle
    //
    var largeImage = document.getElementById('largeImage');
    // Unhide image elements
    //
    largeImage.style.display = 'block';
    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    largeImage.src = imageURI;
}

// A button will call this function
//
function capturePhoto() {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {quality: 50,
        destinationType: destinationType.DATA_URL});
}

// A button will call this function
//
function capturePhotoEdit() {
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {quality: 20, allowEdit: true,
        destinationType: destinationType.DATA_URL});
}

// A button will call this function
//
function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source});
}

// Called if something bad happens.
//
function onFail(message) {
    alert('Se ha producido un error: ' + message);
}
