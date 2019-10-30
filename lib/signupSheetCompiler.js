const CsvReader = require('promised-csv');
const fs = require('fs');

const reader = new CsvReader();

async function signupSheetCompiler(filePaths, newFileName) {
  reader.on('error', function (err) {
    console.log('uh oh: ' + err);
  });

  const saveDirectory = filePaths[0].split('/').slice(0, filePaths[0].split('/').length - 1).join('/') + '/'
  const newFilePath = saveDirectory + newFileName + `-compiled.csv`;

  const sheets = await Promise.all(filePaths.map(filepath => {
    return reader.read(filepath, row => { return row})
  }))

  const masterDate = new Date(sheets[0][2][1].split(',')[2])
  let laserCutoffTime
  let titles = []

  const signupSeshes = sheets.map(sheet => {
    const thisTitle = sheet[1][1]
    if (!titles.includes(thisTitle)) {
      titles.push(thisTitle)
    }
    const dateTime = sheet[2][1]
    const thisDate = new Date(sheet[2][1].split(',')[2])

    if (masterDate - thisDate !== 0) {
      throw new Error('OH DEAR THESE SHEETS HAVE DIFFERENT DATES 🤦🏽‍♀️')
    }

    laserCutoffTime = thisTitle === 'Laser Cutting Guided Access' ? dateTime.split(' - ')[1].split(',')[0] : laserCutoffTime
    const studentsDetailed = sheet.slice(10, sheet.length)
    const students = studentsDetailed.map(student => {
      return [student[0], student[1]]
    })
    return [
      [thisTitle],
      [dateTime],
      ['First Name', 'Last Name']
    ].concat(
      students
    ).concat([[]])
  })

  const newFileContentArray = [
    [titles.join(' AND ')]
  ].concat(
    laserCutoffTime ? [ ['FOR EXTRA TIME'], ['PLEASE SEE STAFF'], []] : [[]]
  ).concat(
    titles.length > 1 ? signupSeshes.flat() : signupSeshes.map( session => session.slice(1, session.length)).flat()
  ).concat(
    laserCutoffTime ? [ [`LASERS OFF AT ${laserCutoffTime}`] ] : []
  )

  const newFileContent = newFileContentArray.map(row => {
    return `"${row.join('", "')}"`
  }).join('\n').concat('\n')

  await fs.writeFileSync(newFilePath, newFileContent);

  const today = new Date(new Intl.DateTimeFormat('en-US').format(new Date))

  if (masterDate - today !==0) {
    const warning = 'WARNING - These signup sheets are not for today. File saved.'
    console.warn(warning)
    return `${warning}\n${newFileContent}`
  }
  return newFileContent
}

module.exports = signupSheetCompiler;
