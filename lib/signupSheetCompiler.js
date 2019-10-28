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

  const title = sheets[0][1][1]
  const masterDate = new Date(sheets[0][2][1].split(',')[2])
  let lastCutoffTime

  const signupSeshes = sheets.map(sheet => {
    const dateTime = sheet[2][1]
    const thisDate = new Date(sheet[2][1].split(',')[2])

    if (masterDate - thisDate !== 0) {
      throw new Error('OH DEAR THESE SHEETS HAVE DIFFERENT DATES 🤦🏽‍♀️')
    }

    lastCutoffTime = dateTime.split(' - ')[1].split(',')[0]
    const studentsDetailed = sheet.slice(10, sheet.length)
    const students = studentsDetailed.map(student => {
      return [student[0], student[1]]
    })
    return [
      [dateTime],
      ['First Name', 'Last Name']
    ].concat(
      students
    ).concat([[]])
  })

  const newFileContentArray = [
    [title],
    ['FOR EXTRA TIME'],
    ['PLEASE SEE STAFF'],
    [],
  ].concat(
    signupSeshes.flat()
  ).concat([
    [`LASERS OFF AT ${lastCutoffTime}`]
  ])

  const newFileContent = newFileContentArray.map(row => {
    return `"${row.join('", "')}"`
  }).join('\n').concat('\n')

  await fs.writeFileSync(newFilePath, newFileContent);
  return newFileContent
}

module.exports = signupSheetCompiler;
