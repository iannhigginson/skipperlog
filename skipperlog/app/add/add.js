const buttonModule = require("tns-core-modules/ui/button");
const fs = require("tns-core-modules/file-system");
const { path } = require("@nativescript/core");
const labelModule = require("tns-core-modules/ui/label");
const textFieldModule = require("tns-core-modules/ui/text-field");
const textViewModule = require("tns-core-modules/ui/text-view");
const Toast = require("nativescript-toast");

const geolocation = require('../geolocation/geolocation');

const exd = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOCUMENTS).toString();
const skipperLogFolder = path.join(exd, "skipperlog");
const distanceFile = path.join(skipperLogFolder, "distance.txt");
const lastPositionFile = path.join(skipperLogFolder, "lastPosition.txt");
const skipperLogFile = path.join(skipperLogFolder, "skipperlog.json");
const geolocFile = path.join(skipperLogFolder, "geoloc.json");
var file;
var journeySpeed;
var distance;
var accumulatedDistance;
var geolocJson;

function addPageLoaded(args) {
 let page = args.object;


 /** Setup the date and time */
 var myDate = new Date().toJSON("dd/MM/yyyy HH:mm");
 myDate = myDate.substr(0, myDate.length - 5);
 let myDateBits = myDate.split('T');
 let dateBits = myDateBits[0];
 let newTime = myDateBits[1];
 dateBits = dateBits.split('-');
 let newDate = dateBits[2] + "/" + dateBits[1] + "/" + dateBits[0];

 /** Get last position, accumulated distance, current position and get a distance */
 let lastPosition = getLastRecordedPosition();
 setTimeout(() => {
  file = fs.File.fromPath(lastPositionFile);
  file.readText().then((lpos) => {
   lastPosition = lpos;
   console.log('This is the lastPosition recorder in skipperlog.json ' + lastPosition);
   file = fs.File.fromPath(geolocFile);
   file.readText().then((cpos) => {
    console.log({ cpos });
    geolocJson = JSON.parse(cpos);
    let latlon = lpos.split(',');
    let lat1 = latlon[0];
    let lon1 = latlon[1];
    let lat2 = geolocJson.latitude;
    let lon2 = geolocJson.longitude;
    console.log(lat1 + ', ' + lon1 + ', ' + lat2 + ', ' + lon2);
    distance = geolocation.distanceCalculation(lat1, lon1, lat2, lon2);
    console.log( distance.toFixed(2) );
   });
  });
 }, 100);

 /** Draw up the display */
 setTimeout(() => {
  let button = new buttonModule.Button();
  let label = new labelModule.Label();
  let textField = new textFieldModule.TextField();
  let textView = new textViewModule.TextView();
  let layout = page.getViewById('layout');
  let skipperlog = '';
  let latitude = geolocJson.latitude;
  let longitude = geolocJson.longitude;
  journeySpeed = geolocJson.speed.toFixed(2);
  textField = new textFieldModule.TextField();
  textField.class = "input input-border";
  textField.hint = 'Date:';
  textField.id = 'date';
  textField.text = newDate;
  layout.addChild(textField);
  textField = new textFieldModule.TextField();
  textField.class = "input input-border";
  textField.hint = 'Time';
  textField.id = 'time';
  textField.text = newTime + " UTC";
  layout.addChild(textField);
  textField = new textFieldModule.TextField();
  textField.class = "input input-border";
  textField.hint = 'Position';
  textField.id = 'position';
  textField.text = `${latitude}, ${longitude}`;
  layout.addChild(textField);
  textField = new textFieldModule.TextField();
  textField.class = "input input-border";
  textField.hint = 'Distance';
  textField.id = 'distance';
  textField.text = distance.toFixed(2) + ' NM';
  layout.addChild(textField);
  textField = new textFieldModule.TextField();
  textField.class = "input input-border";
  textField.hint = 'Average speed';
  textField.id = 'speed';
  textField.text = journeySpeed;
  layout.addChild(textField);
  textField = new textFieldModule.TextField();
  textField.class = "input input-border";
  textField.hint = 'Engine hours';
  textField.id = 'enginehours';
  layout.addChild(textField);
  textField = new textFieldModule.TextField();
  textField.class = "input input-border";
  textField.hint = 'Fuel';
  textField.id = 'fuel';
  layout.addChild(textField);
  textField = new textFieldModule.TextField();
  textField.class = "input input-border";
  textField.hint = 'Oil';
  textField.id = 'oil';
  layout.addChild(textField);
  textField = new textFieldModule.TextField();
  textField.class = "input input-border";
  textField.hint = 'Water';
  textField.id = 'water';
  layout.addChild(textField);
  textField = new textFieldModule.TextField();
  textField.class = "input input-border";
  textField.hint = 'Sea State';
  textField.id = 'seastate';
  layout.addChild(textField);
  textField = new textFieldModule.TextField();
  textField.class = "input input-border";
  textField.hint = 'Wind.';
  textField.id = 'wind';
  layout.addChild(textField);
  textView = new textViewModule.TextView();
  textView.class = "input input-border";
  textView.hint = 'Comments';
  textView.id = 'comment';
  textView.rowSpan = "10";
  textView.textWrap = true;
  layout.addChild(textView);
  label = new labelModule.Label();
  label.text = ' ';
  label.className = "spacer";
  layout.addChild(label);
  button = new buttonModule.Button();
  button.className = "btn";
  button.text = "Add skipper's log";
  /** The Button */
  button.on("tap", () => {
   Toast.makeText("Save This skipperlog...").show();
   /** Collect the data */
   let date = page.getViewById('date');
   let time = page.getViewById('time');
   let position = page.getViewById('position');
   let distance = page.getViewById('distance');
   let speed = page.getViewById('speed');
   let enginehours = page.getViewById('enginehours');
   let fuel = page.getViewById('fuel');
   let oil = page.getViewById('oil');
   let water = page.getViewById('water');
   let seastate = page.getViewById('seastate');
   let wind = page.getViewById('wind');
   let comment = page.getViewById('comment');
   let jsonFragment = {
    "date": date.text,
    "time": time.text,
    "position": position.text,
    "distance": distance.text,
    "speed": speed.text,
    "enginehours": enginehours.text,
    "fuel": fuel.text,
    "oil": oil.text,
    "water": water.text,
    "seastate": seastate.text,
    "wind": wind.text,
    "comment": comment.text
   };
   /** Save the data to skipperlog.json */
   file = fs.File.fromPath(skipperLogFile);
   file.readText().then(content => {
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
       if (a === 1) {
        let secondObject = firstArray[a];
        for (let obj in secondObject) {
         let secondObjBit = secondObject[obj];
         secondObjBit.push(jsonFragment);
        }
       }
      }
     }
     file.writeText(JSON.stringify(skipperlog)).then(() => {
      file = fs.File.fromPath(distanceFile);
      file.writeText(distance).then(() => { }).catch((err) => {
       console.error('storing distance ' + err);
      });
     }).catch((err) => {
      console.error('Storing skipperlog ' + err);
     });
    }
   });
   setTimeout(() => {
    page.frame.navigate("list/list");
   }, 1000);
  }); /// button

  layout.addChild(button);
  label = new labelModule.Label();
  label.text = ' ';
  layout.addChild(label);

 }, 1000);
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

function getLastRecordedPosition() {
 var skipperlog;
 var lastPosition;
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
       // vesselname
      } else {
       if (firstArrayObjects[secondObject].length === 1) {
        Toast.makeText('No logs have been recorder yet.').show();
       } else {
        for (let b = 0; b < firstArrayObjects[secondObject].length; b++) {
         if (b > 0) {
          let secondArrayObjects = firstArrayObjects[secondObject][b];
          for (var items in secondArrayObjects) {
           switch (items) {
            case 'position':
             //console.log('position => ' + secondArrayObjects[items]);
             if (b === firstArrayObjects[secondObject].length - 1) {
              lastPosition = secondArrayObjects[items];
              file = fs.File.fromPath(lastPositionFile);
              file.writeText(lastPosition).then(() => {
               Toast.makeText(lastPosition).show();
              }, (error) => {
               console.log(`Could not write to lastPosition.txt because ${error}`);
              });
             }
             break;
            case 'distance':
             if (b === firstArrayObjects[secondObject].length - 1) {
              file = fs.File.fromPath(distanceFile);
              file.readText().then((d) => {
               accumulatedDistance = parseFloat(d) + parseFloat(secondArrayObjects[items]);
               file.writeText(accumulatedDistance.toFixed(2)).then(() => {
                Toast.makeText(accumulatedDistance.toFixed(2)).show();
               }, (error) => {
                console.log(`Could not write to distance.txt because ${error}`);
               });
              });
             }
             break;
           }
          }
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

exports.addPageLoaded = addPageLoaded;
exports.home = home;
exports.menu = menu;
