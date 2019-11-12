const fs = require('fs');

const signupSheetCompiler = require('./lib/signupSheetCompiler');

const directory = './secretCSV/signupSheets/'
const nameOfOutputFile = "Today's signups"

console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n");
console.log("HAY FRIEND, WE ARE USING A WEB APP FOR THIS NOW:");
console.log("http://bldg61cal.herokuapp.com/signupCompiler\n");
console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

fs.readdir(directory, function(err, directoryFiles) {
  signupSheetCompiler((
    directoryFiles.filter(file => {
      return file.startsWith('lc_attendees')
    }).map(file => {
      return `${directory}${file}`
    })
  ), nameOfOutputFile);
});
