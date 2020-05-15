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

  if ( headers.indexOf('Categories.1') === -1 ) { headers.push('Categories.1') }
  if ( headers.indexOf('Categories.2') === -1 ) { headers.push('Categories.2') }
  if ( headers.indexOf('Categories.3') === -1 ) { headers.push('Categories.3') }
  if ( headers.indexOf('Categories.4') === -1 ) { headers.push('Categories.4') }

  const categories1Index = headers.indexOf('Categories.1')
  const categories2Index = headers.indexOf('Categories.2')
  const categories3Index = headers.indexOf('Categories.3')
  const categories4Index = headers.indexOf('Categories.4')
  const actualAttendanceIndex = headers.indexOf('Actual Attendance')
  const seatsIndex = headers.indexOf('Seats')

  if (
    titleIndex === -1 ||
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
      newRow[actualAttendanceIndex] = 20;
      newRow[categories2Index] = 'Tool Orientation'
      newRow[categories4Index] = 'CNC'
    } else if (newRow[titleIndex] === 'Tool Orientation: Laser Cutting') {
      newRow[actualAttendanceIndex] = 30;
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
    } else if (newRow[titleIndex].includes('Open Studio')) {
      newRow[actualAttendanceIndex] = randNumberFrom(50, 70);
      newRow[categories2Index] = 'Open Studio';
    } else if (newRow[titleIndex].includes('Colorado Sewing')) {
      newRow[actualAttendanceIndex] = row[seatsIndex];
      newRow[categories2Index] = 'Workshop';
    } else if (newRow[titleIndex] === 'Shop 61: Guided Access') {
      newRow[actualAttendanceIndex] = row[seatsIndex];
      newRow[categories2Index] = 'Guided Practice'
      newRow[categories4Index] = 'Woodshop'
    } else if (newRow[titleIndex].includes('U-Fix-It')) {
      newRow[actualAttendanceIndex] = randNumberFrom(25, 32);
      newRow[categories2Index] = 'Workshop'
    } else {
      newRow[actualAttendanceIndex] = row[seatsIndex];
    }

    if (
      newRow[titleIndex].includes('CANCELED') ||
      newRow[titleIndex].includes('CANCELLED') ||
      newRow[titleIndex].includes('CANCELED') ||
      newRow[titleIndex].includes('Cancelled')
    ) {
      newRow[actualAttendanceIndex] = 0;
    }

    mungedRows.push(newRow)
  })

  const newFilePath = libCalCSVFile.split('.csv')[0] + `-munged.csv`;

  const newFileContent = mungedRows.map(row => {
    return `"${row.join('", "')}"`
  }).join('\n').concat('\n')

  await fs.writeFileSync(newFilePath, newFileContent);

  console.log("Please check output for all events with Actual Attendance set to 0...");
  console.log("  Events that do not require signup will not have an attendance since");
  console.log("  algo assumes 'other' events attendance = seats.");
  return newFileContent
}

module.exports = libCalStatMunger;
