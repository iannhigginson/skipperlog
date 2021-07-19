const fs = require("tns-core-modules/file-system");
const mapsModule = require("nativescript-google-maps-sdk");
const { path } = require("@nativescript/core");
const Toast = require('nativescript-toast');

const exd = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOCUMENTS).toString();
const skipperLogFolder = path.join(exd, "skipperlog");
const skipperLogFile = path.join(skipperLogFolder, "skipperlog.json");

var currentLat;
var currentLon;
var file;
var latLonArr = [];
var marker;
var skipperlog;


function mapsPageLoaded(args) { }

function onMapReady(args) {

 var mapView = args.object;

 console.log('onMapReady');

 mapView.zoom = 2;
 mapView.settings.zoomGesturesEnabled = true;

 file = fs.File.fromPath(skipperLogFile);

 file.readText().then((skippersLogResult) => {

  console.log({ skippersLogResult });

  skipperlog = JSON.parse(skippersLogResult);

  for (let firstObject in skipperlog) {
   let firstArray = skipperlog[firstObject];
   for (let a = 0; a < firstArray.length; a++) {
    if (a > 0) {
     for (let secondObject in firstArray[a]) {
      let firstArrayObjects = firstArray[a];
      for (let b = 0; b < firstArrayObjects[secondObject].length; b++) {
       let secondArrayObjects = firstArrayObjects[secondObject][b];
       for (var items in secondArrayObjects) {
        console.log(secondArrayObjects[items]);
        switch (items) {
         case 'position':
          latLonArr = secondArrayObjects[items].split(",");
          currentLat = latLonArr[0];
          currentLon = latLonArr[1];
          console.log(`currentLat => ${currentLat}, currentLon  => ${currentLon}`);
          if (currentLat !== "undefined" && currentLon !== "undefined") {
           setMarker(b, currentLat, currentLon);
          }
          break;
        }
       }
      }
     }
    }
   }
  }
 });

 function setMarker(i, lat, lon) {
  marker = new mapsModule.Marker();
  marker.position = mapsModule.Position.positionFromLatLng(lat, lon);
  marker.title = "Marker " + i.toString();
  marker.snippet = lat + ", " + lon;
  marker.userData = { index: i };
  mapView.addMarker(marker);
 }

}

function onMarkerSelect(args) {
 console.log("Clicked on " + args.marker.title);
 Toast.makeText("Clicked on " + args.marker.title, "long").show();
}

function onCameraChanged(args) {
 console.log("Camera changed: " + JSON.stringify(args.camera));
 Toast.makeText("Camera changed: " + JSON.stringify(args.camera), "long").show();
}

function onCameraMove(args) {
 console.log("Camera moving: " + JSON.stringify(args.camera));
 Toast.makeText("Camera moving: " + JSON.stringify(args.camera), "long").show();
}

function home(args) {
 console.log("Home...");
 const p = args.object;
 const page = p.page;
 page.frame.navigate("list/list");
}

function menu(args) {
 const p = args.object;
 const page = p.page;
 page.frame.navigate('/menu/menu');
}

exports.onMapReady = onMapReady;
exports.onMarkerSelect = onMarkerSelect;
exports.onCameraChanged = onCameraChanged;
exports.onCameraMove = onCameraMove;
exports.mapsPageLoaded = mapsPageLoaded;
exports.home = home;
exports.menu = menu;
