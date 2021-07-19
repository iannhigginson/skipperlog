const Accuracy = require("tns-core-modules/ui/enums");
const dialogs = require("tns-core-modules/ui/dialogs");
const fs = require("tns-core-modules/file-system");
const geolocation = require("@nativescript/geolocation");
const { path } = require("@nativescript/core");
const Toast = require("nativescript-toast");

const exd = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOCUMENTS).toString();
const skipperLogFolder = path.join(exd, "skipperlog");
const geoLocFile = path.join(skipperLogFolder, "geoloc.json");
var file;

var currentLat;
var currentLon;
var journeySpeed;

function getGeoLocation() {
 if (!geolocation.isEnabled()) { // GPS is not enabled
  geolocation.enableLocationRequest(true, true).then(() => {
   geolocation.getCurrentLocation({
    desiredAccuracy: Accuracy.high,
    updateDistance: 5,
    updateTime: 60000,
    minimumUpdateTime: 5000,
    maximumAge: 60000,
    timeout: 300000
   }).then((location) => {
    if (!location) {
     dialogs.alert('Failed to get location. Please restart the app.');
    } else {
     currentLat = location.latitude;
     currentLon = location.longitude;
     journeySpeed = location.speed.toFixed(2);
     Toast.makeText(`${currentLat}, ${currentLon}, ${journeySpeed}`, "long").show();
     console.log(`from geolocation 1 => ${currentLat}, ${currentLon}, ${journeySpeed}`);
     recordLocation(location);
    }
   });
  }, (e) => {
   console.log("error: " + (e.message || e));
   Toast.makeText("error: " + (e.message || e), "long").show();
  }).catch((ex) => {
   console.log("Unable to Enable Location" + ex);
   Toast.makeText("Unable to Enable Location" + ex, "long").show();
  });
 } else { // GPS is enabled
  console.log("geolocation.isEnabled");
  // Toast.makeText("geolocation.isEnabled", "long").show();
  geolocation.getCurrentLocation({
   desiredAccuracy: Accuracy.high,
   updateDistance: 5,
   updateTime: 60000,
   minimumUpdateTime: 5000,
   maximumAge: 60000,
   timeout: 300000
  }).then((location) => {
   if (location) {
    currentLat = location.latitude;
    currentLon = location.longitude;
    journeySpeed = location.speed.toFixed(2);
    Toast.makeText(`${currentLat}, ${currentLon}, ${journeySpeed}`, "long").show();
    console.log(`from geolocation 2 => ${currentLat}, ${currentLon}, ${journeySpeed}`);
    recordLocation(location);
   } else {
    return 'No location located';
   }
  }).catch((err) => {
   console.log(`function(loc) => ${err}`);
   Toast.makeText(`function(loc) => ${err}`, "long").show();
  });
  // geolocation.watchLocation((location) => {
  //  if (location) {
  //   currentLat = location.latitude;
  //   currentLon = location.longitude;
  //   journeySpeed = location.speed.toFixed(2);
  //   Toast.makeText(`${currentLat}, ${currentLon}, ${journeySpeed}`, "long").show();
  //   console.log(`from geolocation 2 => ${currentLat}, ${currentLon}, ${journeySpeed}`);
  //   recordLocation(location);
  //  }
  // }, (e) => {
  //  console.log("Error: " + e.message);
  //  Toast.makeText("Error: " + e.message, "long").show();
  // }, {
  //  desiredAccuracy: Accuracy.high,
  //  maximumAge: 2500,
  //  minimumUpdateTime: 5000,
  //  updateDistance: 5,
  //  timeout: 20000
  // });
 }

}

function recordLocation(loc) {

 let returnString = {
  "latitude": loc.latitude,
  "longitude": loc.longitude,
  "speed": loc.speed
 };

 file = fs.File.fromPath(geoLocFile);
 file.writeText(JSON.stringify(returnString)).then(() => { }, (error) => {
  console.log(`Could not write to geoloc.json because ${error}`);
  Toast.makeText(`Could not write to geoloc.json because ${error}`, "long").show();
 });

}

function distanceCalculation(lat1, lon1, lat2, lon2) {
 if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
  console.log(`This is from the function distanceCalculation: ${lat1}, ${lon1}, ${lat2}, ${lon2}`);
  return 0;
 }
 const p = 0.017453292519943295;    // Math.PI / 180
 const c = Math.cos;
 let a = 0.5 - c((lat2 - lat1) * p) / 2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;
 return 6880.2 * Math.asin(Math.sqrt(a)); // 2 * R; R = 3 440,1 NM
}

exports.getGeoLocation = getGeoLocation;
exports.distanceCalculation = distanceCalculation;
