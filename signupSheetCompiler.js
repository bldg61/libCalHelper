const signupSheetCompiler = require('./lib/signupSheetCompiler');

// edit these below lines to point to all files you want to compile.
// you can have one to many in this list, just copy the lines as is and edit.

const signupSheets = [
  './secretCSV/signupSheets/filename1.csv',
  './secretCSV/signupSheets/filename2.csv',
  './secretCSV/signupSheets/filename3.csv',
  './secretCSV/signupSheets/filename4.csv',
];
signupSheetCompiler(signupSheets, "Today's lasers");
