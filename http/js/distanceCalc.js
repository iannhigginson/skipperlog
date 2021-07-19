
function distance(lat1, lon1, lat2, lon2) {
 const p = 0.017453292519943295;    // Math.PI / 180
 const c = Math.cos;
 let a = 0.5 - c((lat2 - lat1) * p) / 2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;
 return 6880.2 * Math.asin(Math.sqrt(a)); // 2 * R; R = 3 440,1 NM
 //return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

/*
alert(calcCrow(59.3293371, 13.4877472, 59.3225525, 13.4619422).toFixed(1));



//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function distance(lat1, lon1, lat2, lon2) {
 var R = 6371; // km
 var dLat = toRad(lat2 - lat1);
 var dLon = toRad(lon2 - lon1);
 var lat1 = toRad(lat1);
 var lat2 = toRad(lat2);

 var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
 var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
 var d = R * c;
 return d;
}

// Converts numeric degrees to radians
function toRad(Value) {
 return Value * Math.PI / 180;
}
 */