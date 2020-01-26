# README

### TODOS

* [ ] StatMunger - An array of headers is created from Gina's Quarterly libcal version, these are the only headers (and assoc data) that will "make the munge"

### Is LibCal Stat Reporting making you super sads? Use this handy dandy tool to make your life a little less painful.

### BUT HOW
1. Clone (or fork and clone if you want to remix)
1. Add your super awesome LibCal csv file(s) to the appropriate `./secretCSV/` directory
1. Munging some stats? Edit the `statMunger.js` with the name of your stat file and run ONE of the following. Your munged file will be named and in the same directory as the original file with the suffix `-munged`.
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
* Actual Attendance
* Seats
