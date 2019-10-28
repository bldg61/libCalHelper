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
})
