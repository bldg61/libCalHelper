const fs = require('fs');
const signupSheetCompiler = require('../lib/signupSheetCompiler');

describe('Signup Sheet Compiler', () => {
  beforeAll(() => {
    jasmine.clock().install();
    const today = new Date('Nov 2 2019')
    jasmine.clock().mockDate(today)
  })

  afterAll(() => {
    jasmine.clock().uninstall();
  })

  it('generates a Laser Guided Access sheet from one signup sheet', async () => {
    const filePath = './spec/fixtures/signups/GALasersOneTime.csv'

    const returnedSheet = await signupSheetCompiler([filePath], 'GALasersOneTime')
    const savedSheet = await fs.readFileSync('./spec/fixtures/signups/GALasersOneTime-compiled.csv', 'utf8')
    const expected = await fs.readFileSync('./spec/fixtures/signups/GALasersOneTime-expected.csv', 'utf8')

    expect(returnedSheet).toBe(expected)
    expect(savedSheet).toBe(expected)

    await fs.unlinkSync('./spec/fixtures/signups/GALasersOneTime-compiled.csv')
  })

  it('generates a Laser Guided Access sheet from two signup sheets', async () => {
    const filePaths = [
      './spec/fixtures/signups/GALasersOneTime.csv',
      './spec/fixtures/signups/GALasersTwoTime.csv',
    ]

    const returnedSheet = await signupSheetCompiler(filePaths, 'GALasersTwoTime')
    const savedSheet = await fs.readFileSync('./spec/fixtures/signups/GALasersTwoTime-compiled.csv', 'utf8')
    const expected = await fs.readFileSync('./spec/fixtures/signups/GALasersTwoTime-expected.csv', 'utf8')

    expect(returnedSheet).toBe(expected)
    expect(savedSheet).toBe(expected)

    await fs.unlinkSync('./spec/fixtures/signups/GALasersTwoTime-compiled.csv')
  })

  it('throws if the two sheets dates are different', async () => {
    const filePaths = [
      './spec/fixtures/signups/GALasersOneTime.csv',
      './spec/fixtures/signups/GALasersYesterday.csv',
    ]

    try {
      await signupSheetCompiler(filePaths, 'GALasersDiffDates')
    } catch (error) {
      expect(error).toEqual(new Error('OH DEAR THESE SHEETS HAVE DIFFERENT DATES 🤦🏽‍♀️'))
    }
  })

  it('logs WARNING if the date is not for today', async () => {
    const filePaths = [
      './spec/fixtures/signups/GALasersYesterday.csv',
    ]

    const returnedSheet = await signupSheetCompiler(filePaths, 'GALasersYesterday')
    const savedSheet = await fs.readFileSync('./spec/fixtures/signups/GALasersYesterday-compiled.csv', 'utf8')
    const expected = await fs.readFileSync('./spec/fixtures/signups/GALasersYesterday-expected.csv', 'utf8')

    expect(returnedSheet).toBe('WARNING - These signup sheets are not for today. File saved.\n' + expected)
    expect(savedSheet).toBe(expected)

    await fs.unlinkSync('./spec/fixtures/signups/GALasersYesterday-compiled.csv')
  })
})
