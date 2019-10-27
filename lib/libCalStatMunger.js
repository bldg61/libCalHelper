const CsvReader = require('promised-csv');
const fs = require('fs');

const reader = new CsvReader();

function randNumberFrom(lowest, highest) {
  const diff = highest - lowest;
  Math.round(Math.random() * diff) + lowest;
}

async function libCalStatMunger(libCalCSVFile) {
  reader.on('error', function (err) {
    console.log('uh oh: ' + err);
  });

  reader.on('done', function () {
    console.log('CSV has been imported into function...');
  });

  const rawCSV = await reader.read(libCalCSVFile, row => {
    return row
  })

  const headers = rawCSV[0];
  const data = rawCSV.slice(1, rawCSV.length)
  const dateIndex = headers.indexOf('Date')
  const libraryIndex = headers.indexOf('Library')
  const titleIndex = headers.indexOf('Title')
  const eventOrganizerIndex = headers.indexOf('Event Organizer')
  const audiencesIndex = headers.indexOf('Audiences')
  const categories1Index = headers.indexOf('Categories.1')
  const categories2Index = headers.indexOf('Categories.2')
  const categories3Index = headers.indexOf('Categories.3')
  const categories4Index = headers.indexOf('Categories.4')
  const actualAttendanceIndex = headers.indexOf('Actual Attendance')
  const seatsIndex = headers.indexOf('Seats')
  const confirmedRegisIndex = headers.indexOf('Confirmed Registrations')
  const waitlistRegisIndex = headers.indexOf('Waiting-List Registrations')
  console.log(headers);

  const mungedRows = [ headers ]
  let newRow = []
  data.forEach(row => {
    newRow = [ ...row ]

    newRow[categories1Index] = 'Classes & Activities'
    newRow[categories4Index] = 'STEAM'

    if (newRow[titleIndex] === 'Tool Orientation: Shopbot CNC') {
      newRow[actualAttendanceIndex] = 15;
      newRow[categories2Index] = 'Tool Orientation'
      newRow[categories3Index] = 'CNC'
    } else if (newRow[titleIndex] === 'Tool Orientation: Laser Cutting') {
      newRow[actualAttendanceIndex] = 25;
      newRow[categories2Index] = 'Tool Orientation'
      newRow[categories3Index] = 'Laser Cutting'
    } else if (newRow[titleIndex] === 'Laser Cutting Guided Access') {
      newRow[actualAttendanceIndex] = row[seatsIndex];
      newRow[categories2Index] = 'Guided Practice'
      newRow[categories3Index] = 'Laser Cutting'
    } else if (newRow[titleIndex] === 'CNC Guided Access') {
      newRow[actualAttendanceIndex] = row[seatsIndex];
      newRow[categories2Index] = 'Guided Practice'
      newRow[categories3Index] = 'CNC'
    } else if (newRow[titleIndex] === 'Open Studio & Limited Shop Access') {
      newRow[actualAttendanceIndex] = randNumberFrom(50, 70);
      newRow[categories2Index] = 'Open Studio';
    } else if (newRow[titleIndex] === 'Sewing Rebellion Workshop') {
      newRow[actualAttendanceIndex] = row[seatsIndex];
      newRow[categories2Index] = 'Workshop';
    } else if (newRow[titleIndex] === 'Shop 61: Guided Access') {
      newRow[actualAttendanceIndex] = row[seatsIndex];
      newRow[categories2Index] = 'Guided Practice'
      newRow[categories3Index] = 'Woodshop'
    } else {
      newRow[actualAttendanceIndex] = row[seatsIndex];
    }

    console.log("ROW: ", row);
    console.log("NEWROW: ", newRow);
    mungedRows.push(newRow)
  })

  const newFilePath = libCalCSVFile.split('.csv')[0] + `-munged.csv`;
  const newFileContent = mungedRows.join('\n');

  fs.writeFile(newFilePath, newFileContent, (err) => {
    if (err) throw err;
    console.log(`The file has been saved to ${newFilePath}`);
  });

}

module.exports = libCalStatMunger;
