const Button = require("tns-core-modules/ui/button").Button;
const fs = require("tns-core-modules/file-system");
const { path } = require("@nativescript/core");
const Label = require("tns-core-modules/ui/label").Label;
const StackLayout = require("tns-core-modules/ui/layouts/stack-layout").StackLayout;
const TextField = require("tns-core-modules/ui/text-field").TextField;
const TextView = require("tns-core-modules/ui/text-view").TextView;
const Toast = require("nativescript-toast");
const exd = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOCUMENTS).toString();
const skipperLogFolder = path.join(exd, "skipperlog");
const skipperLogFile = path.join(skipperLogFolder, "skipperlog.json");
const editTxt = path.join(skipperLogFolder, "edit.txt");
var file;
function editPageLoaded(args) {
 let page = args.object;
 let button = new Button();
 let label = new Label();
 let stackLayout = new StackLayout();
 let inlineStackLayout = new StackLayout();
 let textField = new TextField();
 let textView = new TextView();
 let layout = page.getViewById('layout');
 let recordNo = '';
 let skipperlog = '';
 let textToWrite = "";
 var secondArrayObjects;
 file = fs.File.fromPath(editTxt);
 file.readText().then((t) => {
  recordNo = t.trim();
  recordNo = recordNo.substr(4, recordNo.length - 1);
  recordNo = parseInt(recordNo);
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
       if (a === 0) {}
       else {
        for (let b = 0; b < firstArrayObjects[secondObject].length; b++) {
         if (parseInt(recordNo) === b) {
          secondArrayObjects = firstArrayObjects[secondObject][b];
          stackLayout = new StackLayout();
          stackLayout.class = "bordered";
          for (var items in secondArrayObjects) {
           let convertedItem = items.charAt(0).toUpperCase() + items.substring(1);
           switch (items) {
           case 'date':
            inlineStackLayout = new StackLayout();
            inlineStackLayout.orientation = "horizontal";
            label = new Label();
            label.className = "stdtxt";
            label.text = `${convertedItem} : `;
            inlineStackLayout.addChild(label);
            textField = new TextField();
            textField.className = "stdtxt";
            textField.text = `${secondArrayObjects[items]}`;
            textField.id = items;
            inlineStackLayout.addChild(textField);
            stackLayout.addChild(inlineStackLayout);
            break;
           case 'comment':
            inlineStackLayout = new StackLayout();
            inlineStackLayout.orientation = "horizontal";
            label = new Label();
            label.className = "stdtxt";
            label.textWrap = "true";
            label.text = `${convertedItem} : `;
            inlineStackLayout.addChild(label);
            textView = new TextView();
            textView.className = "stdtxt";
            textView.textWrap = "true";
            textView.text = `${secondArrayObjects[items]}`;
            textView.id = items;
            inlineStackLayout.addChild(textView);
            stackLayout.addChild(inlineStackLayout);
            break;
           default:
            inlineStackLayout = new StackLayout();
            inlineStackLayout.orientation = "horizontal";
            label = new Label();
            label.className = "stdtxt";
            label.textWrap = "true";
            label.text = `${convertedItem} : `;
            inlineStackLayout.addChild(label);
            textField = new TextField();
            textField.className = "stdtxt";
            textField.textWrap = "true";
            textField.text = `${secondArrayObjects[items]}`;
            textField.id = items;
            inlineStackLayout.addChild(textField);
            stackLayout.addChild(inlineStackLayout);
            break;
           }
          }
          layout.addChild(stackLayout);
          stackLayout = new StackLayout();
          label = new Label();
          label.className = "stdtxt";
          label.textWrap = "true";
          label.text = " ";
          stackLayout.addChild(label);
          layout.addChild(stackLayout);
         }
        }
       }
      }
     }
    }
   }
  });
 });
 setTimeout(() => {
  button = new Button();
  button.class = "btn";
  button.text = "Update skipper's log";
  button.on("tap", () => {
   Toast.makeText("Save This skipperlog...").show();
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
   for (let firstObject in skipperlog) {
    let firstArray = skipperlog[firstObject];
    for (let a = 0; a < firstArray.length; a++) {
     if (a > 0) {
      for (let secondObject in firstArray[a]) {
       let firstArrayObjects = firstArray[a];
       for (let b = 0; b < firstArrayObjects[secondObject].length; b++) {
        if (parseInt(recordNo) === b) {
         secondArrayObjects = firstArrayObjects[secondObject][b];
         firstArrayObjects[secondObject][b] = jsonFragment;
         textToWrite = JSON.stringify(skipperlog);
        }
       }
      }
     }
    }
   }
   file.writeText(textToWrite).then(() => {
    Toast.makeText("Save This Log...").show();
    home(args);
   }, (error) => {
    console.log('ERROR=> ' + error);
    alert({
     title: "Error",
     message: 'Could not record the user on this local device.',
     okButtonText: "Close"
    });
   });
  }); /// button

  layout.addChild(button);

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

exports.home = home;
exports.menu = menu;
exports.editPageLoaded = editPageLoaded;
