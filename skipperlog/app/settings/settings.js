const buttonModule = require("tns-core-modules/ui/button");
const fs = require("tns-core-modules/file-system");
const http = require("tns-core-modules/http/");
const { path } = require("@nativescript/core");
const labelModule = require("tns-core-modules/ui/label");
const textFieldModule = require("tns-core-modules/ui/text-field");
const textViewModule = require("tns-core-modules/ui/text-view");
const Toast = require("nativescript-toast");

const exd = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOCUMENTS).toString();
const skipperLogFolder = path.join(exd, "skipperlog");
const _settingsFile = path.join(skipperLogFolder, "settings.json");
const _skipperlogFile = path.join(skipperLogFolder, "skipperlog.json");
var exists;
var settingsFile;
var skipperlogFile;
var settings;
var fileUrl = "";


function settingsPageLoaded(args) {
 let page = args.object;

 /** Setup the date and time */
 var myDate = new Date().toJSON("dd/MM/yyyy HH:mm");
 myDate = myDate.substr(0, myDate.length - 5);
 let myDateBits = myDate.split('T');
 let dateBits = myDateBits[0];
 let newTime = myDateBits[1];
 dateBits = dateBits.split('-');
 let newDate = dateBits[2] + "/" + dateBits[1] + "/" + dateBits[0];


 exists = fs.File.exists(_settingsFile);
 settingsFile = fs.File.fromPath(_settingsFile);
 skipperlogFile = fs.File.fromPath(_skipperlogFile);
 if (exists === false) {
  settingsFile.writeText('{}').then(() => { });
 } else {
  settingsFile.readText().then((settingsResult) => {
   console.log({ settingsResult });
   settings = JSON.parse(settingsResult);
   fileUrl = settings.url;
   console.log({ fileUrl });


   setTimeout(() => {
    let button = new buttonModule.Button();
    let label = new labelModule.Label();
    let textField = new textFieldModule.TextField();
    let textView = new textViewModule.TextView();
    let layout = page.getViewById('layout');

    label = new labelModule.Label();
    label.className = "spacer";
    layout.addChild(label);

    label = new labelModule.Label();
    label.className = "stdtxt";
    label.text = "Add a URL to upload the log to.";
    layout.addChild(label);

    label = new labelModule.Label();
    label.className = "spacer";
    layout.addChild(label);

    textField = new textFieldModule.TextField();
    textField.class = "input input-border";
    textField.hint = 'https://somewebsite.com/somewebpage.php';
    textField.id = 'url';
    textField.text = fileUrl;
    layout.addChild(textField);

    label = new labelModule.Label();
    label.className = "spacer";
    layout.addChild(label);

    button = new buttonModule.Button();
    button.className = "btn";
    button.text = "Save settings";
    button.on("tap", () => {
     let url = page.getViewById('url');
     let jsonFragment = {
      "url": url.text
     };
     let strToWrite = JSON.stringify(jsonFragment);
     settingsFile.writeText(strToWrite).then(() => {
      home(args);
     });
    });
    layout.addChild(button);

    label = new labelModule.Label();
    label.className = "spacer";
    layout.addChild(label);

    button = new buttonModule.Button();
    button.className = "btn";
    button.text = "Upload Skipper's log";
    button.on("tap", () => {

     if (fileUrl !== "") {

      skipperlogFile.readText().then((skipperlogFileContent) => {
       console.log({ skipperlogFileContent });
       http.request({
         url: fileUrl,
         method: "POST",
         headers: {
          "Content-Type": "application/json",
         },
         content: skipperlogFileContent,
        }).then((response) => {
         // console.log(response);
         home(args);
        },
         function (e) {
          Toast.makeText("Error occurred " + e).show();
         });
      });
     }
    });
    layout.addChild(button);
   }, 100);
  });
 }
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

exports.settingsPageLoaded = settingsPageLoaded;
exports.home = home;
exports.menu = menu;
