import * as Fs from 'fs';
import CsvReadableStream from 'csv-reader';
import { FILE_NAME } from './constants.js';
import { axiosShortcutInstance } from '../axios.js';


function getInputStream(fileName) {
  return Fs.createReadStream(fileName, 'utf8');
}

function assembleProductCategoryData(existingData, currentRow) {
  existingData.push(currentRow[0])
}

function assembleProductData(existingData, currentRow) {
  const name = currentRow[0];
  const description = currentRow[1];
  const productCategoriesRaw = currentRow[2];
  const productCategories = [];
  if(typeof productCategoriesRaw === 'string'){
    const splitData = productCategoriesRaw.split(',')
    for (const splitDatum of splitData) {
      productCategories.push(Number(splitDatum))
    }
  } else {
    productCategories.push(productCategoriesRaw)
  }
  existingData.push({
    name: name,
    description: description,
    productCategories: productCategories
  })
}

function readCsvFile(fileName, callback) {
  const inputStream = getInputStream(fileName);
  let data = [];
  inputStream
  .pipe(new CsvReadableStream({
    parseNumbers: true,
    parseBooleans: true,
    trim: true
  }))
  .on('data', (row)=> {
    switch (fileName) {
      case FILE_NAME.PRODUCT_CATEGORY:
        assembleProductCategoryData(data, row);
        break;
      case FILE_NAME.PRODUCT:
        assembleProductData(data, row);
        break;
    }
  })
  .on('end', ()=> {
    callback(data)
  })
  
}

export function addProductCategory() {
 readCsvFile(FILE_NAME.PRODUCT_CATEGORY, async (data) => {
   for (const datum of data) {
     await axiosShortcutInstance.post('product-categories', {
       data: {
         name: datum
       }
     })
   }
 });
}

export function addProduct() {
  readCsvFile(FILE_NAME.PRODUCT, async (data) => {
    for (const datum of data) {
      try{
        await axiosShortcutInstance.post('products', {
          data: datum
        })
        console.log('successfully added: ', datum.name)
      } catch (e) {
        console.log('Failed for : ', datum.name);
        console.log(e.data);
      }
    }
  })
}
