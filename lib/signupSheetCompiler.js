const CsvReader = require('promised-csv');
const fs = require('fs');

const reader = new CsvReader();

async function signupSheetCompiler(filePaths, newFileName) {
  reader.on('error', function (err) {
    console.log('uh oh: ' + err);
  });

  const saveDirectory = filePaths[0].split('/').slice(0, filePaths[0].split('/').length - 1).join('/') + '/'
  const newFilePath = saveDirectory + newFileName + `-compiled.csv`;

  const firstSheet = await reader.read(filePaths[0], row => {
    return row
  })

  const title = firstSheet[1][1]
  const dateTime = firstSheet[2][1]
  const cutoffTime = dateTime.split(' - ')[1].split(',')[0]
  const studentsDetailed = firstSheet.slice(10, firstSheet.length)
  const students = studentsDetailed.map(student => {
    return [student[0], student[1]]
  })

  const newFileContentArray = [
    [title],
    ['FOR EXTRA TIME'],
    ['PLEASE SEE STAFF'],
    [],
    [dateTime],
    ['First Name', 'Last Name'],
  ].concat(
    students
  ).concat([
    [],
    [`LASERS OFF AT ${cutoffTime}`]
  ])


  const newFileContent = newFileContentArray.map(row => {
    return `"${row.join('", "')}"`
  }).join('\n').concat('\n')

  await fs.writeFileSync(newFilePath, newFileContent);
  return newFileContent
}

module.exports = signupSheetCompiler;
