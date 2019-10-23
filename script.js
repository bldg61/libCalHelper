const fs = require('fs');
const cullCSVLines = require('./cullCSVLines');

const filePath = './secretCSV/matrix.csv';
const reduceByOneOutOfEveryXLines = 5;


const newFilePath = filePath.split('.csv')[0] + `-ReducedByOneOutOfEvery${reduceByOneOutOfEveryXLines}Lines.csv`

const myCSV = fs.readFileSync(filePath, 'utf8', (err, data) => {
  if (err) throw err;
  return data;
});

const result = cullCSVLines(myCSV, '\n', reduceByOneOutOfEveryXLines);

fs.writeFile(newFilePath, result, (err) => {
  if (err) throw err;
  console.log(`The file has been saved to ${newFilePath}`);
});
