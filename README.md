# README

### Too much data on your hands? Delete lines in your CSV with this handy dandy lil thing!

### BUT HOW
1. Clone (or fork and clone if you want to remix)
1. Add your super awesome CSV files (need to be named with lower case `.csv` NOT `.CSV`) to the `./secretCSV/` directory
1. Open script.js and edit...

    ```
    const filePath = './secretCSV/fileName.csv'; // change this fileName to your file name
    const reduceByOneOutOfEveryXLines = 5;       // this will kick every out 1/5 lines.
                                                 // change it to 2 and it will kick out every 1/2 lines...
                                                 // IF your delimiter is NOT \n, update that as well!
    ```

1. From the command line from within the repo directory, run `$ node script.js`
