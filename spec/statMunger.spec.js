const fs = require('fs');
const statMunger = require('../lib/statMunger');

describe('Stat Munger', () => {
  it('throws if an important header is missing', () =>{
    const statMungerFilePaths = [
      './spec/fixtures/stats/missingAttendanceHeader.csv',
      './spec/fixtures/stats/missingCategory1Header.csv',
      './spec/fixtures/stats/missingCategory2Header.csv',
      './spec/fixtures/stats/missingCategory3Header.csv',
      './spec/fixtures/stats/missingCategory4Header.csv',
      './spec/fixtures/stats/missingSeatsHeader.csv',
      './spec/fixtures/stats/missingTitleHeader.csv',
    ];

    statMungerFilePaths.forEach(async filePath => {
      try {
        await statMunger(filePath);
      } catch (error) {
        expect(error).toEqual(new Error('Oh dear, an important header is missing... Check your CSV for the following headers:\n  Title\n  Categories.1\n  Categories.2\n  Categories.3\n  Categories.4\n  Actual Attendance\n  Seats'))
      }
    })
  })
  it('updates `Tool Orientation: Shopbot CNC` correctly', async () => {
    const filePath = './spec/fixtures/stats/sampleTOCNC.csv'

    const returnCSV = await statMunger(filePath)
    const savedCSV = await fs.readFileSync('./spec/fixtures/stats/sampleTOCNC-munged.csv', 'utf8')
    const expected = await fs.readFileSync('./spec/fixtures/stats/sampleTOCNC-expected.csv', 'utf8')

    expect(returnCSV).toBe(expected)
    expect(savedCSV).toBe(expected)
  })
})
