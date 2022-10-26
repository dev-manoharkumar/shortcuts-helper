import fs from 'fs';


export function writeCsvFile(path, data) {
  fs.writeFile(path, data, 'utf8', function (err) {
    if (err) {
      console.log('Some error occured - file either not saved or corrupted file saved.');
    } else {
      console.log('It\'s saved!');
    }
  });
}
