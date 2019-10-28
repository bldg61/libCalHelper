const fs = require('fs');
const signupSheetCompiler = require('../lib/signupSheetCompiler');

describe('Signup Sheet Compiler', () => {
  it('generates a Laser Guided Access sheet from one signup sheet', async () => {
    const filePath = './spec/fixtures/signups/GALasersOneTime.csv'

    const compiledSheet = await signupSheetCompiler([filePath], 'GALasersOneTime')
    const savedSheet = await fs.readFileSync('./spec/fixtures/signups/GALasersOneTime-compiled.csv', 'utf8')
    const expected = await fs.readFileSync('./spec/fixtures/signups/GALasersOneTime-expected.csv', 'utf8')

    expect(compiledSheet).toBe(expected)
    expect(savedSheet).toBe(expected)

    await fs.unlinkSync('./spec/fixtures/signups/GALasersOneTime-compiled.csv')
  })

  it('generates a Laser Guided Access sheet from two signup sheets', async () => {
    const filePaths = [
      './spec/fixtures/signups/GALasersOneTime.csv',
      './spec/fixtures/signups/GALasersTwoTime.csv',
    ]

    const compiledSheet = await signupSheetCompiler(filePaths, 'GALasersTwoTime')
    const savedSheet = await fs.readFileSync('./spec/fixtures/signups/GALasersTwoTime-compiled.csv', 'utf8')
    const expected = await fs.readFileSync('./spec/fixtures/signups/GALasersTwoTime-expected.csv', 'utf8')

    expect(compiledSheet).toBe(expected)
    expect(savedSheet).toBe(expected)

    await fs.unlinkSync('./spec/fixtures/signups/GALasersTwoTime-compiled.csv')
  })
  it('throws if the two sheets dates are different', async () => {
    const filePaths = [
      './spec/fixtures/signups/GALasersOneTime.csv',
      './spec/fixtures/signups/GALasersTomorrow.csv',
    ]

    try {
      const whatDis = await signupSheetCompiler(filePaths, 'GALasersDiffDates')
      console.log("whatDis", whatDis);
    } catch (error) {
      expect(error).toEqual(new Error('OH DEAR THESE SHEETS HAVE DIFFERENT DATES 🤦🏽‍♀️'))
    }
  })
  it('throws if the two sheets titles are different')
  it('logs WARNING if the date is not for today')
})
