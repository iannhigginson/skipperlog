/**
 * This is the HTML side of the Skipper's Log Mobile App.
 */

var skipperlog, vesselname, out;


fetch('./json/skipperlog.json')
 .then(response => response.json())
 .then(skipperlog => {

  for (let firstObject in skipperlog) {
   let firstArray = skipperlog[firstObject];
   for (let a = 0; a < firstArray.length; a++) {
    for (let secondObject in firstArray[a]) {
     let firstArrayObjects = firstArray[a];
     if (a === 0) {
      out = '<div class="card"><div class="card-title" style="text-align:center">';
      vesselname = firstArrayObjects.vesselname;
      out += `Skippers Log for ${vesselname}`;
      out += '</div></div><br />';
     } else {
      for (let b = 0; b < firstArrayObjects[secondObject].length; b++) {
       let secondArrayObjects = firstArrayObjects[secondObject][b];
       if (secondArrayObjects.date !== undefined) {
        out += '<div class="card"><div class="card-block">';
        out+='<div class="row"><div class="col-md-1">&nbsp;</div><div class="col-md-10" id="out">';
        for (var items in secondArrayObjects) {
         let convertedItem = items.charAt(0).toUpperCase() + items.substring(1);
         switch (items) {
          case 'comment':
           out += `${convertedItem} : ${secondArrayObjects[items]}<br><br>`;
           break;
          default:
           out += `${convertedItem} : ${secondArrayObjects[items]}<br>`;
           break;
         }
        }
        out+='</div><div class="col-md-1">&nbsp;</div></div>';
        out += '</div></div><br />';
       }
      }
      out += '<br>';
     }
    }
   }
  }

  document.getElementById('out').innerHTML = out;

 });
