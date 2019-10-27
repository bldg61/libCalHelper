# README

### TODOS

* [ ] Signup lists are munged for printout
* [ ] StatMuger - Categories are auto extracted from Category (LibCal direct download... do we need this?)
* [ ] StatMuger - Headers for categories 1-4 are generated if they do not exist

### Is LibCal making you super sads? Use this handy dandy tool to make your life a little less painful.

### BUT HOW
1. Clone (or fork and clone if you want to remix)
1. Add your super awesome LibCal csv file to the `./secretCSV/` directory
1. Open script.js and edit...

    ```
    const filePath = './secretCSV/fileName.csv'; // change this fileName to your file name
    ```

1. From the command line from within the repo directory, run `$ node script.js`

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
        * Will have minimal rules applied (see else statement)
* Categories.1
* Categories.2
* Categories.3
* Categories.4
* Actual Attendance
* Seats
