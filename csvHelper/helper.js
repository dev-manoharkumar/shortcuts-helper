import * as Fs from 'fs';
import CsvReadableStream from 'csv-reader';
import { FILE_NAME } from './constants.js';
import { axiosShortcutInstance } from '../axios.js';


function getInputStream(fileName) {
  return Fs.createReadStream(fileName, 'utf8');
}

function assembleProductCategoryData(existingData, currentRow) {
  existingData.push(currentRow[0]);
}

function assembleShortcutCategoryData(existingData, currentRow) {
  const name = currentRow[0];
  const slug = currentRow[1];
  const order = currentRow[2];
  const product = currentRow[3];
  existingData.push({
    name,
    slug,
    order,
    product
  });
}

function assembleShortcutData(existingData, currentRow) {
  const keyCombo = currentRow[0];
  const title = currentRow[1];
  const operating_system = currentRow[2];
  const product = currentRow[3];
  const shortcut_category = currentRow[4];
  existingData.push({
    keyCombo,
    title,
    operating_system,
    product,
    shortcut_category
  });
}

function assembleProductData(existingData, currentRow) {
  const name = currentRow[0];
  const description = currentRow[1];
  const productCategoriesRaw = currentRow[2];
  const productCategories = [];
  if (typeof productCategoriesRaw === 'string') {
    const splitData = productCategoriesRaw.split(',');
    for (const splitDatum of splitData) {
      productCategories.push(Number(splitDatum));
    }
  } else {
    productCategories.push(productCategoriesRaw);
  }
  existingData.push({
    name: name,
    description: description,
    productCategories: productCategories
  });
}

function readCsvFile(fileName, callback) {
  const inputStream = getInputStream(fileName);
  let data = [];
  inputStream
  .pipe(new CsvReadableStream({
    parseNumbers: true,
    parseBooleans: true,
    trim: true,
    skipHeader: true
  }))
  .on('data', (row) => {
    switch (fileName) {
      case FILE_NAME.PRODUCT_CATEGORY:
        assembleProductCategoryData(data, row);
        break;
      case FILE_NAME.PRODUCT:
        assembleProductData(data, row);
        break;
      case FILE_NAME.SHORTCUT_CATEGORY:
        assembleShortcutCategoryData(data, row);
        break;
      case FILE_NAME.SHORTCUT:
        assembleShortcutData(data, row);
        break;
    }
  })
  .on('end', () => {
    callback(data);
  });
  
}

export function addProductCategory() {
  readCsvFile(FILE_NAME.PRODUCT_CATEGORY, async (data) => {
    for (const datum of data) {
      await axiosShortcutInstance.post('product-categories', {
        data: {
          name: datum
        }
      });
    }
  });
}

export function addShortcutCategory() {
  readCsvFile(FILE_NAME.SHORTCUT_CATEGORY, async (data) => {
    for (const datum of data) {
      
      try {
        await axiosShortcutInstance.post('shortcut-categories', {
          data: datum
        });
        console.log('successfully added: ', datum.name);
      } catch (e) {
        console.log('********** Failed for : ', datum.name);
        console.log(e.data);
      }
    }
  });
}

export function addShortcuts() {
  readCsvFile(FILE_NAME.SHORTCUT, async (data) => {
    for (const datum of data) {
      try {
        await axiosShortcutInstance.post('shortcuts', {
          data: datum
        });
        console.log('successfully added: ', datum.keyCombo);
      } catch (e) {
        console.log('********** Failed for : ', datum.keyCombo);
        console.log(e.message);
      }
    }
  });
}

export function addProduct() {
  readCsvFile(FILE_NAME.PRODUCT, async (data) => {
    for (const datum of data) {
      try {
        await axiosShortcutInstance.post('products', {
          data: datum
        });
        console.log('successfully added: ', datum.name);
      } catch (e) {
        console.log('Failed for : ', datum.name);
        console.log(e.data);
      }
    }
  });
}
