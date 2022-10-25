import * as Fs from 'fs';
import CsvReadableStream from 'csv-reader';
import { FILE_NAME } from './constants.js';
import { axiosShortcutInstance } from '../axios.js';


function getInputStream(fileName) {
  return Fs.createReadStream(fileName, 'utf8');
}

function readCsvFile(fileName, callback) {
  const inputStream = getInputStream(fileName);
  const data = [];
  inputStream
  .pipe(new CsvReadableStream({
    parseNumbers: true,
    parseBooleans: true,
    trim: true
  }))
  .on('data', (row)=> {
    data.push(row[0])
  })
  .on('end', ()=> {
    callback(data)
  })
  
}

export function addProductCategory() {
 readCsvFile(FILE_NAME.PRODUCT_CATEGORY, async (data) => {
   for (const datum of data) {
     console.log(datum);
     await axiosShortcutInstance.post('products', {
       data: {
         name: datum
       }
     })
   }
   // axiosShortcutInstance.post()
 });
}
