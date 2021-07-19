const Exit = require("nativescript-exit");
const Toast = require("nativescript-toast");

function menuLoaded() { }

function vdetails(args){
 const p = args.object;
 const page = p.page;
 page.frame.navigate("vdetails/vdetails");
}

function geoloc(args) {
 const p = args.object;
 const page = p.page;
 page.frame.navigate("geoloc/geoloc");
}

function map(args) {
 const p = args.object;
 const page = p.page;
 page.frame.navigate("maps/maps");
}

function settings(args) {
 const p = args.object;
 const page = p.page;
 page.frame.navigate("settings/settings");
}

function exitThis() {
 console.log('Buy buy...');
 Toast.makeText("Buy Buy.", "long").show();
 Exit.exit();
}

exports.vdetails = vdetails;
exports.geoloc = geoloc;
exports.exitThis = exitThis;
exports.map = map;
exports.settings = settings;

exports.menuLoaded = menuLoaded;
