function cullCSVLines(csv, lineDeliminator, oneOutOfEveryXLines) {
  const newCSV = csv.split(lineDeliminator).filter((line, index) => {
    return index % oneOutOfEveryXLines === 0
  });
  return newCSV.join(lineDeliminator);
}

module.exports = cullCSVLines;
