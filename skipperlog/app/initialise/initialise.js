const fs = require("tns-core-modules/file-system");
const { path } = require("@nativescript/core");
const permissions = require("nativescript-permissions");
const Toast = require('nativescript-toast');

var argsCarrier;
var exists;
var file;

let exd = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOCUMENTS).toString();
let skipperLogFolder = path.join(exd, "skipperlog");
let skipperLogFile = path.join(skipperLogFolder, "skipperlog.json");


function pageLoaded(args) {
 const page = args.object;
 argsCarrier = args;

 getPermissions();

 exists = fs.File.exists(skipperLogFile);
 if (exists === false) {
  console.log({ exists });
 } else {
  page.frame.navigate('list/list');
 }

}

function onTap() {
 let page = argsCarrier.object;
 let vesselName = page.getViewById('vesselName');
 let regNo = page.getViewById('regNo');
 let econtact = page.getViewById('econtact');
 let skipperlogStructure = '{"skipperlog":[{"vesselname":"' + vesselName.text + '", "regno":"' + regNo.text + '", "econtact":"' + econtact.text + '"},{"data":[{}]}]}';
 console.log({
  skipperlogStructure
 });
 file = fs.File.fromPath(skipperLogFile);
 file.writeText(skipperlogStructure).then(() => {
  Toast.makeText("Initialise skipper's log").show();
  page.frame.navigate('/list/list');
 }, function (error) {
  console.log(`Could not write to skipperlog.json because ${error}`);
 });
}

function getPermissions() {

 /** Permissions **/
 permissions.requestPermission(android.Manifest.permission.READ_EXTERNAL_STORAGE, "I need these permissions because I'm cool")
  .then(() => { })
  .catch(() => {
   Toast.makeText("No permission for READ_EXTERNAL_STORAGE!", "long").show();
  });
 permissions.requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE, "I need these permissions because I'm cool")
  .then(() => { })
  .catch(() => {
   Toast.makeText("No permission for WRITE_EXTERNAL_STORAGE!", "long").show();
  });
 permissions.requestPermission(android.Manifest.permission.ACCESS_FINE_LOCATION, "I need these permissions because I'm cool")
  .then(() => { })
  .catch(() => {
   Toast.makeText("No permission for ACCESS_FINE_LOCATION!", "long").show();
  });
 permissions.requestPermission(android.Manifest.permission.ACCESS_NETWORK_STATE, "I need these permissions because I'm cool")
  .then(() => { })
  .catch(() => {
   Toast.makeText("No permission for ACCESS_NETWORK_STATE!", "long").show();
  });
 permissions.requestPermission(android.Manifest.permission.INTERNET, "I need these permissions because I'm cool")
  .then(() => { })
  .catch(() => {
   Toast.makeText("No permission for INTERNET!", "long").show();
  });
 /** /Permissions **/

}

exports.pageLoaded = pageLoaded;
exports.onTap = onTap;
