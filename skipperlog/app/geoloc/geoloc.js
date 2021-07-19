const fs = require("tns-core-modules/file-system");
const { path } = require("@nativescript/core");
const Toast = require('nativescript-toast');
const exit = require("nativescript-exit");

const geolocation = require('../geolocation/geolocation');

const exd = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOCUMENTS).toString();
const skipperLogFolder = path.join(exd, "skipperlog");
const geoLocFile = path.join(skipperLogFolder, "geoloc.json");

var locView;

var argsCarrier;
var file;

var currentLat;
var currentLon;
var journeySpeed;

function pageLoaded(args) {
 argsCarrier = args;
}

function onTap() {
 getGeo(argsCarrier);
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

function getGeo(args) {
 let page = args.object;
 locView = page.getViewById('loc');
 geolocation.getGeoLocation();
 file = fs.File.fromPath(geoLocFile);
 file.readText().then((result) => {
  console.log({ result });
  let locObj = JSON.parse(result);
  currentLat = locObj.latitude;
  currentLon = locObj.longitude;
  journeySpeed = locObj.speed;
  Toast.makeText(`${currentLat}, ${currentLon}, ${journeySpeed}`).show();
  locView.text = `${currentLat}, ${currentLon}, ${journeySpeed}`;
 });
}

exports.pageLoaded = pageLoaded;
exports.onTap = onTap;
exports.home = home;
exports.menu = menu;
