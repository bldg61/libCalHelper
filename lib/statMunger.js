const CsvReader = require('promised-csv');
const fs = require('fs');

const reader = new CsvReader();

function randNumberFrom(lowest, highest) {
  const diff = highest - lowest;
  return Math.round(Math.random() * diff) + lowest;
}

async function libCalStatMunger(libCalCSVFile) {
  reader.on('error', function (err) {
    console.log('uh oh: ' + err);
  });

  const rawCSV = await reader.read(libCalCSVFile, row => {
    return row
  })

  const headers = rawCSV[0];
  const data = rawCSV.slice(1, rawCSV.length)
  const titleIndex = headers.indexOf('Title')
  const categories1Index = headers.indexOf('Categories.1')
  const categories2Index = headers.indexOf('Categories.2')
  const categories3Index = headers.indexOf('Categories.3')
  const categories4Index = headers.indexOf('Categories.4')
  const actualAttendanceIndex = headers.indexOf('Actual Attendance')
  const seatsIndex = headers.indexOf('Seats')

  if (
    titleIndex === -1 ||
    categories1Index === -1 ||
    categories2Index === -1 ||
    categories3Index === -1 ||
    categories4Index === -1 ||
    actualAttendanceIndex === -1 ||
    seatsIndex === -1
  ) {
    throw new Error('Oh dear, an important header is missing... Check your CSV for the following headers:\n  Title\n  Categories.1\n  Categories.2\n  Categories.3\n  Categories.4\n  Actual Attendance\n  Seats')
  }

  const mungedRows = [ headers ]
  let newRow = []
  data.forEach(row => {
    newRow = [ ...row ]

    newRow[categories1Index] = 'Classes & Activities'
    newRow[categories3Index] = 'STEAM'

    if (newRow[titleIndex] === 'Tool Orientation: Shopbot CNC') {
      newRow[actualAttendanceIndex] = 15;
      newRow[categories2Index] = 'Tool Orientation'
      newRow[categories4Index] = 'CNC'
    } else if (newRow[titleIndex] === 'Tool Orientation: Laser Cutting') {
      newRow[actualAttendanceIndex] = 25;
      newRow[categories2Index] = 'Tool Orientation'
      newRow[categories4Index] = 'Laser Cutting'
    } else if (newRow[titleIndex] === 'Laser Cutting Guided Access') {
      newRow[actualAttendanceIndex] = row[seatsIndex];
      newRow[categories2Index] = 'Guided Practice'
      newRow[categories4Index] = 'Laser Cutting'
    } else if (newRow[titleIndex] === 'CNC Guided Access') {
      newRow[actualAttendanceIndex] = row[seatsIndex];
      newRow[categories2Index] = 'Guided Practice'
      newRow[categories4Index] = 'CNC'
    } else if (newRow[titleIndex] === 'Open Studio & Limited Shop Access') {
      newRow[actualAttendanceIndex] = randNumberFrom(50, 70);
      newRow[categories2Index] = 'Open Studio';
    } else if (newRow[titleIndex] === 'Sewing Rebellion Workshop') {
      newRow[actualAttendanceIndex] = row[seatsIndex];
      newRow[categories2Index] = 'Workshop';
    } else if (newRow[titleIndex] === 'Shop 61: Guided Access') {
      newRow[actualAttendanceIndex] = row[seatsIndex];
      newRow[categories2Index] = 'Guided Practice'
      newRow[categories4Index] = 'Woodshop'
    } else {
      newRow[actualAttendanceIndex] = row[seatsIndex];
    }

    mungedRows.push(newRow)
  })

  const newFilePath = libCalCSVFile.split('.csv')[0] + `-munged.csv`;

  const newFileContent = mungedRows.map(row => {
    return `"${row.join('", "')}"`
  }).join('\n')

  fs.writeFile(newFilePath, newFileContent, (err) => {
    if (err) throw err;
    console.log(`The file has been saved to ${newFilePath}`);
  });

}

module.exports = libCalStatMunger;
