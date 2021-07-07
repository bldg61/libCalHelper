# README

### TODOS

* [ ] StatMunger - Categories are auto extracted from Category (LibCal direct download... do we need this?)
* [ ] StatMunger - Headers for categories 1-4 are generated if they do not exist
* [x] signupSheetCompiler - autoselects files that are in a directory (typing?? gross.)
* [x] signupSheetCompiler - for not lasers (no need for special messages)
* [x] signupSheetCompiler - Signup lists are munged for printout

### Is LibCal making you super sads? Use this handy dandy tool to make your life a little less painful.

### BUT HOW
1. Clone (or fork and clone if you want to remix)
1. Add your super awesome LibCal csv file(s) to the appropriate `./secretCSV/` directory
1. SIGNUP SHEET COMPILER IS DEPRECATED! We rolled this into the Wrangler.
    * repo: [github.com/bldg61/libCalWrangler](https://github.com/bldg61/libCalWrangler)
    * deployed: [bldg61cal.herokuapp.com/signupCompiler](http://bldg61cal.herokuapp.com/signupCompiler)

    Previous README instructs below...

    ```
    Printing out signup sheets? Check the `signupSheetCompiler.js` to verify location of files and name of output file. List will print in order of file names.
        * `$ yarn signups`
        * `$ npm signups`
        * `$ node signupSheetCompiler.js`
    ```

1. Munging some stats? Edit the `statMunger.js` with the name of your stat file and run one of the following. Your munged file will be named and in the same directory as the original file with the suffix `-munged`.
    * `$ yarn signups`
    * `$ npm signups`
    * `$ node statMunger.js`

### NOTE:

This lil statMunger algo assumes MUCH about the formatting of your `csv`. PLEASE TAKE CARE. Required fields are:

* Title, with the names matching either:
    * 'Tool Orientation: Shopbot CNC'
    * 'Tool Orientation: Laser Cutting'
    * 'Laser Cutting Guided Access'
    * 'CNC Guided Access'
    * 'Open Studio & Limited Shop Access'
    * 'Sewing Rebellion Workshop'
    * 'Shop 61: Guided Access'
    * OTHER:
        * Will have the minimal rules applied (see else statement)
* Categories.1
* Categories.2
* Categories.3
* Categories.4
* Actual Attendance
* Seats
