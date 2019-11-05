const fs = require('fs');

const signupSheetCompiler = require('./lib/signupSheetCompiler');

const directory = './secretCSV/signupSheets/'
const nameOfOutputFile = "Today's signups"

fs.readdir(directory, function(err, directoryFiles) {
  signupSheetCompiler((
    directoryFiles.filter(file => {
      return file.startsWith('lc_attendees')
    }).map(file => {
      return `${directory}${file}`
    })
  ), nameOfOutputFile);
});
