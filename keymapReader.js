const Fs = require('fs');
const CsvReadableStream = require('csv-reader');

let inputStream = Fs.createReadStream('keymap.csv', 'utf8');

inputStream
.pipe(new CsvReadableStream({parseNumbers: true, parseBooleans: true, trim: true}))
.on('data', function (row) {
  console.log('A row arrived: ', row);
})
.on('end', function () {
  console.log('No more rows!');
});
