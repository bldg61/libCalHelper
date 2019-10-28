const fs = require('fs');
const statMunger = require('../lib/statMunger');

describe('Stat Munger', () => {
  it('updates `Open Studio & Limited Shop Access` correctly', async () => {
    const filePath = './spec/fixtures/stats/sampleOpenStudio.csv'

    const returnCSV = await statMunger(filePath)
    const savedCSV = await fs.readFileSync('./spec/fixtures/stats/sampleOpenStudio-munged.csv', 'utf8')
    const expected = await fs.readFileSync('./spec/fixtures/stats/sampleOpenStudio-expected.csv', 'utf8')

    expect(returnCSV).toBe(savedCSV)

    const headers = returnCSV.split('\n')[0].split('", "')
    const attendanceIndex = headers.indexOf('Actual Attendance')

    const attendance = returnCSV.split('\n')[1].split('", "')[attendanceIndex];
    expect(attendance).toBeGreaterThan(50)
    expect(attendance).toBeLessThan(70)

    const returnWithoutAttendance =
      returnCSV.split('\n')[0] + '\n' +
      returnCSV.split('\n')[1].split('", "').slice(0, attendanceIndex - 1).join(',') +
      returnCSV.split('\n')[1].split('", "').slice(attendanceIndex + 1, expected.split('\n').length).join(',')
    const expectedWithoutAttendance =
      expected.split('\n')[0] + '\n' +
      expected.split('\n')[1].split('", "').slice(0, attendanceIndex - 1).join(',') +
      expected.split('\n')[1].split('", "').slice(attendanceIndex + 1, expected.split('\n').length).join(',')
    expect(returnWithoutAttendance).toBe(expectedWithoutAttendance)

    await fs.unlinkSync('./spec/fixtures/stats/sampleOpenStudio-munged.csv')
  })

  it('updates `Tool Orientation: Shopbot CNC` correctly', async () => {
    const filePath = './spec/fixtures/stats/sampleTOCNC.csv'

    const returnCSV = await statMunger(filePath)
    const savedCSV = await fs.readFileSync('./spec/fixtures/stats/sampleTOCNC-munged.csv', 'utf8')
    const expected = await fs.readFileSync('./spec/fixtures/stats/sampleTOCNC-expected.csv', 'utf8')

    expect(returnCSV).toBe(expected)
    expect(savedCSV).toBe(expected)

    await fs.unlinkSync('./spec/fixtures/stats/sampleTOCNC-munged.csv')
  })

  it('updates `Tool Orientation: Laser Cutting` correctly', async () => {
    const filePath = './spec/fixtures/stats/sampleTOLaser.csv'

    const returnCSV = await statMunger(filePath)
    const savedCSV = await fs.readFileSync('./spec/fixtures/stats/sampleTOLaser-munged.csv', 'utf8')
    const expected = await fs.readFileSync('./spec/fixtures/stats/sampleTOLaser-expected.csv', 'utf8')

    expect(returnCSV).toBe(expected)
    expect(savedCSV).toBe(expected)

    await fs.unlinkSync('./spec/fixtures/stats/sampleTOLaser-munged.csv')
  })

  it('updates `Laser Cutting Guided Access` correctly', async () => {
    const filePath = './spec/fixtures/stats/sampleGALaser.csv'

    const returnCSV = await statMunger(filePath)
    const savedCSV = await fs.readFileSync('./spec/fixtures/stats/sampleGALaser-munged.csv', 'utf8')
    const expected = await fs.readFileSync('./spec/fixtures/stats/sampleGALaser-expected.csv', 'utf8')

    expect(returnCSV).toBe(expected)
    expect(savedCSV).toBe(expected)

    await fs.unlinkSync('./spec/fixtures/stats/sampleGALaser-munged.csv')
  })

  it('updates `CNC Guided Access` correctly', async () => {
    const filePath = './spec/fixtures/stats/sampleGACNC.csv'

    const returnCSV = await statMunger(filePath)
    const savedCSV = await fs.readFileSync('./spec/fixtures/stats/sampleGACNC-munged.csv', 'utf8')
    const expected = await fs.readFileSync('./spec/fixtures/stats/sampleGACNC-expected.csv', 'utf8')

    expect(returnCSV).toBe(expected)
    expect(savedCSV).toBe(expected)

    await fs.unlinkSync('./spec/fixtures/stats/sampleGACNC-munged.csv')
  })

  it('updates `Sewing Rebellion Workshop` correctly', async () => {
    const filePath = './spec/fixtures/stats/sampleSewRebellion.csv'

    const returnCSV = await statMunger(filePath)
    const savedCSV = await fs.readFileSync('./spec/fixtures/stats/sampleSewRebellion-munged.csv', 'utf8')
    const expected = await fs.readFileSync('./spec/fixtures/stats/sampleSewRebellion-expected.csv', 'utf8')

    expect(returnCSV).toBe(expected)
    expect(savedCSV).toBe(expected)

    await fs.unlinkSync('./spec/fixtures/stats/sampleSewRebellion-munged.csv')
  })

  it('updates `Shop 61: Guided Access` correctly', async () => {
    const filePath = './spec/fixtures/stats/sampleGAShop.csv'

    const returnCSV = await statMunger(filePath)
    const savedCSV = await fs.readFileSync('./spec/fixtures/stats/sampleGAShop-munged.csv', 'utf8')
    const expected = await fs.readFileSync('./spec/fixtures/stats/sampleGAShop-expected.csv', 'utf8')

    expect(returnCSV).toBe(expected)
    expect(savedCSV).toBe(expected)

    await fs.unlinkSync('./spec/fixtures/stats/sampleGAShop-munged.csv')
  })

  it('updates other events correctly', async () => {
    const filePath = './spec/fixtures/stats/sampleOther.csv'

    const returnCSV = await statMunger(filePath)
    const savedCSV = await fs.readFileSync('./spec/fixtures/stats/sampleOther-munged.csv', 'utf8')
    const expected = await fs.readFileSync('./spec/fixtures/stats/sampleOther-expected.csv', 'utf8')

    expect(returnCSV).toBe(expected)
    expect(savedCSV).toBe(expected)

    await fs.unlinkSync('./spec/fixtures/stats/sampleOther-munged.csv')
  })

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
