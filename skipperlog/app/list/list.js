const fs = require("tns-core-modules/file-system");
const { path } = require("@nativescript/core");
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

function mainPageLoaded(args) {
 let page = args.object;
 let pageHeader = page.getViewById('logHeader');
 let layout = page.getViewById('layout');
 var label;
 var itemId = [];
 var skipperlog = '';

 getGeo();

 file = fs.File.fromPath(skipperLogFile);
 file.readText().then((content) => {
  if (content.length > 10) {
   let jsonStr = content.trim();
   try {
    skipperlog = JSON.parse(jsonStr);
   } catch (err) {
    console.log(err.message);
   }
   for (let firstObject in skipperlog) {
    let firstArray = skipperlog[firstObject];
    for (let a = 0; a < firstArray.length; a++) {
     for (let secondObject in firstArray[a]) {
      let firstArrayObjects = firstArray[a];
      if (a === 0) {
       let vesselname = firstArrayObjects.vesselname; // firstArrayObjects[secondObject];
       pageHeader.text = `Skippers Log for ${vesselname}`;
      } else {
       if (firstArrayObjects[secondObject].length === 1) {
        label = new Label();
        label.className = "center";
        label.textWrap = "true";
        label.text = 'No logs have been recorder yet.';
        layout.addChild(label);
        label = new Label();
        label.className = "center";
        label.textWrap = "true";
        label.text = 'Use the "Add" button to add a new log.';
        layout.addChild(label);
       } else {
        for (let b = 0; b < firstArrayObjects[secondObject].length; b++) {
         let secondArrayObjects = firstArrayObjects[secondObject][b];
         itemId.push("Log" + b);
         let itemIdStr = itemId[b];
         if (b > 0) {
          let stackLayout = new StackLayout();
          stackLayout.class = "bordered";
          stackLayout.id = itemIdStr;
          label = new Label();
          label.text = "Edit";
          label.className = "tRight";
          label.on("tap", () => {
           file = fs.File.fromPath(editTxt);
           file.writeText('"' + stackLayout.id + '"').then(() => {}, (error) => {
            console.log('ERROR=> ' + error);
            alert({
             title: "Error",
             message: 'Could not record the user on this local device.',
             okButtonText: "Close"
            });
           });
           Toast.makeText(`Edit record => ${stackLayout.id}`, "long").show();
           page.frame.navigate("edit/edit");
          });
          stackLayout.addChild(label);
          for (var items in secondArrayObjects) {
           let convertedItem = items.charAt(0).toUpperCase() + items.substring(1);
           switch (items) {
           case 'date':
            label = new Label();
            label.className = "stdtxt";
            label.text = `${convertedItem} : ${secondArrayObjects[items]}`;
            stackLayout.addChild(label);
            break;
           case 'comment':
            label = new Label();
            label.className = "stdtxt";
            label.textWrap = "true";
            label.text = `${convertedItem} : ${secondArrayObjects[items]}`;
            stackLayout.addChild(label);
            label = new Label();
            label.className = "spacer";
            label.text = " ";
            stackLayout.addChild(label);
            break;
           default:
            label = new Label();
            label.className = "stdtxt";
            label.textWrap = "true";
            label.text = `${convertedItem} : ${secondArrayObjects[items]}`;
            stackLayout.addChild(label);
            break;
           }
          }
          layout.addChild(stackLayout);
          label = new Label();
          label.className = "spacer";
          label.text = " ";
          layout.addChild(label);
         }
        }
       }
      }
     }
    }
   }
  } else {
   Toast.makeText("Start a new skipperlog list", "long").show();
  }
 }, function (error) {
  console.log(JSON.stringify(error));
 });
}

function getGeo() {
 geolocation.getGeoLocation();
 file = fs.File.fromPath(geoLocFile);
 file.readText().then((result) => {
  console.log({ result });
  let locObj = JSON.parse(result);
  currentLat = locObj.latitude;
  currentLon = locObj.longitude;
  journeySpeed = locObj.speed.toFixed(2);
  Toast.makeText(`${currentLat}, ${currentLon}, ${journeySpeed}`).show();
 });
}

function add(args) {
 console.log("Add...");
 const p = args.object;
 const page = p.page;
 page.frame.navigate("add/add");
}

function menu(args) {
 const p = args.object;
 const page = p.page;
 page.frame.navigate('/menu/menu');
}

exports.add = add;
exports.menu = menu;
exports.mainPageLoaded = mainPageLoaded;
