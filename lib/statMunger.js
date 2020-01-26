const CsvReader = require('promised-csv');
const fs = require('fs');

const reader = new CsvReader();

function randNumberFrom(lowest, highest) {
  const diff = highest - lowest;
  return Math.round(Math.random() * diff) + lowest;
}

async function libCalStatMunger(libCalCSVFile) {
  // this will shit the bed with single quotes, like `lisa's intern`
  reader.on('error', function (err) {
    console.log('uh oh: ' + err);
  });

  const rawCSV = await reader.read(libCalCSVFile, row => {
    return row
  })

  const headers = [ ...rawCSV[0], ...['Primary Category', 'Secondary Category', 'Tertiary Category', 'Quaternary Category']]
  const data = rawCSV.slice(1, rawCSV.length)
  const titleIndex = headers.indexOf('Title')
  const primaryCategoryIndex = headers.indexOf('Primary Category')
  const secondaryCategoryIndex = headers.indexOf('Secondary Category')
  const tertiaryCategoryIndex = headers.indexOf('Tertiary Category')
  const quaternaryCategoryIndex = headers.indexOf('Quaternary Category')
  const actualAttendanceIndex = headers.indexOf('Actual Attendance')
  const seatsIndex = headers.indexOf('Seats')

  if (
    titleIndex === -1 ||
    primaryCategoryIndex === -1 ||
    secondaryCategoryIndex === -1 ||
    tertiaryCategoryIndex === -1 ||
    quaternaryCategoryIndex === -1 ||
    actualAttendanceIndex === -1 ||
    seatsIndex === -1
  ) {
    throw new Error('Oh dear, an important header is missing... Check your CSV for the following headers:\n  Title\n  Primary Category\n  Secondary Category\n  Tertiary Category\n  Quaternary Category\n  Actual Attendance\n  Seats')
  }

  const mungedRows = [ headers ]
  let newRow = []
  data.forEach(row => {
    newRow = [ ...row ]

    newRow[primaryCategoryIndex] = 'Classes & Activities'
    newRow[tertiaryCategoryIndex] = 'STEAM'

    if (newRow[titleIndex] === 'Tool Orientation: Shopbot CNC') {
      newRow[actualAttendanceIndex] = 15;
      newRow[secondaryCategoryIndex] = 'Tool Orientation'
      newRow[quaternaryCategoryIndex] = 'CNC'
    } else if (newRow[titleIndex] === 'Tool Orientation: Laser Cutting') {
      newRow[actualAttendanceIndex] = 30;
      newRow[secondaryCategoryIndex] = 'Tool Orientation'
      newRow[quaternaryCategoryIndex] = 'Laser Cutting'
    } else if (newRow[titleIndex] === 'Laser Cutting Guided Access') {
      newRow[actualAttendanceIndex] = row[seatsIndex];
      newRow[secondaryCategoryIndex] = 'Guided Practice'
      newRow[quaternaryCategoryIndex] = 'Laser Cutting'
    } else if (newRow[titleIndex] === 'CNC Guided Access') {
      newRow[actualAttendanceIndex] = row[seatsIndex];
      newRow[secondaryCategoryIndex] = 'Guided Practice'
      newRow[quaternaryCategoryIndex] = 'CNC'
    } else if (newRow[titleIndex] === 'Open Studio & Limited Shop Access') {
      newRow[actualAttendanceIndex] = randNumberFrom(50, 70);
      newRow[secondaryCategoryIndex] = 'Open Studio';
    } else if (newRow[titleIndex] === 'Sewing Rebellion Workshop') {
      newRow[actualAttendanceIndex] = row[seatsIndex];
      newRow[secondaryCategoryIndex] = 'Workshop';
    } else if (newRow[titleIndex] === 'Shop 61: Guided Access') {
      newRow[actualAttendanceIndex] = row[seatsIndex];
      newRow[secondaryCategoryIndex] = 'Guided Practice'
      newRow[quaternaryCategoryIndex] = 'Woodshop'
    } else {
      newRow[actualAttendanceIndex] = row[seatsIndex];
    }

    mungedRows.push(newRow)
  })

  const newFilePath = libCalCSVFile.split('.csv')[0] + `-munged.csv`;

  const newFileContent = mungedRows.map(row => {
    return `"${row.join('", "')}"`
  }).join('\n').concat('\n')

  await fs.writeFileSync(newFilePath, newFileContent);

  return newFileContent
}

module.exports = libCalStatMunger;
