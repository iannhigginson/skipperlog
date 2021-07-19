const fs = require("tns-core-modules/file-system");
const { path, ControlStateChangeListener } = require("@nativescript/core");
const StackLayout = require("tns-core-modules/ui/layouts/stack-layout").StackLayout;
const Toast = require("nativescript-toast");

const geolocation = require('../geolocation/geolocation');

const Label = require("tns-core-modules/ui/label").Label;
const exd = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOCUMENTS).toString();
const skipperLogFolder = path.join(exd, "skipperlog");
let geoLocFile = path.join(skipperLogFolder, "geoloc.json");
const skipperLogFile = path.join(skipperLogFolder, "skipperlog.json");
const editTxt = path.join(skipperLogFolder, "edit.txt");

var currentLat;
var currentLon;
var journeySpeed;

var file;

function vdPageLoaded(args) {
 let page = args.object;
 let vesselname = page.getViewById('vesselname');
 let regno = page.getViewById('regno');
 let econtact = page.getViewById('econtact');
 var skipperlog = '';

 file = fs.File.fromPath(skipperLogFile);
 file.readText().then((content) => {
  if (content.length > 10) {
   console.log(content.length);
   let jsonStr = content.trim();
   try {
    skipperlog = JSON.parse(jsonStr);
   } catch (err) {
    console.log(err.message);
   }
   for (let firstObject in skipperlog) {
    let firstArray = skipperlog[firstObject];
    for (let a = 0; a < firstArray.length; a++) {
     console.log({a});
     for (let secondObject in firstArray[a]) {
      let firstArrayObjects = firstArray[a];
      if (a === 0) {
       console.log(firstArrayObjects[secondObject]);
       vesselname.text = firstArrayObjects.vesselname; // firstArrayObjects[secondObject];
       regno.text = firstArrayObjects.regno;
       econtact.text = firstArrayObjects.econtact;
      }
     }
    }
   }
  } else {
   Toast.makeText("Vessel details", "long").show();
  }
 }, function (error) {
  console.log(JSON.stringify(error));
 });
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

exports.home = home;
exports.menu = menu;
exports.vdPageLoaded = vdPageLoaded;
